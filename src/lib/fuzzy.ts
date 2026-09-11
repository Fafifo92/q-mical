/**
 * 🔎 BÚSQUEDA TOLERANTE A ERRORES — portafolio Origen Chemical
 * --------------------------------------------------
 * Módulo puro: sin dependencias, sin DOM y sin disco. Corre igual en el build
 * (Astro), en el navegador (bundleado por Vite) y en Node (pruebas).
 *
 * Permite que "glicerna", "niasinamida" o "aseite de coco" encuentren
 * "Glicerina", "Niacinamida" y "Aceite de Coco".
 *
 * Estrategia por palabra de la consulta, de mejor a peor coincidencia:
 *   igual > prefijo > contiene > distancia de edición dentro de tolerancia.
 * Todas las palabras de la consulta deben coincidir (AND).
 *
 * El orden importa además por rendimiento: los tres primeros criterios son
 * comparaciones de string baratas; sólo si fallan se paga la matriz de edición,
 * y aun así se descarta antes por diferencia de longitud.
 */

// ---------------------------------------------------------------------------
// Pesos (calibrados contra los 227 productos reales — ver scripts/test-fuzzy.mjs)
// ---------------------------------------------------------------------------

/** El token del documento es idéntico a la palabra buscada. */
const PESO_IGUAL = 100;
/** Rango del prefijo: "glice" → "glicerina". Se escala según cuánto cubre. */
const PESO_PREFIJO_MIN = 55;
const PESO_PREFIJO_MAX = 80;
/** La palabra aparece dentro del token ("estearico" en "polihidroxiestearico"). */
const PESO_CONTIENE = 40;
/** Punto de partida de una coincidencia difusa, antes de penalizar. */
const PESO_FUZZY_BASE = 30;
/** Cuánto resta cada error de tecleo: dist 1 → 22, dist 2 → 14. */
const PENALIZACION_FUZZY = 8;

/**
 * Bonus multiplicativo por acertar al principio del documento. Por convención
 * el índice se construye como [nombre, INCI, sinónimos], así que los primeros
 * tokens SON el nombre del producto: acertar ahí vale más que acertar en un
 * sinónimo lejano. Es lo que ordena "Dióxido de Titanio" por encima de
 * "Nacarante Mica-Dióxido de Titanio" para la consulta "dioxido titanio".
 */
const BONUS_PRIMER_TOKEN = 1.3;
const BONUS_NOMBRE = 1.15;
/** Cuántos tokens iniciales se consideran "el nombre" (cabe "Manteca de Karité"). */
const TOKENS_DEL_NOMBRE = 4;

/**
 * Desempate por letra o dígito suelto de la consulta ("vitamina E", "polisorbato 80").
 * Ver `puntuar` para el detalle de por qué es bonus y no filtro.
 */
const BONUS_DISCRIMINADOR = 25;

/**
 * Palabras que no aportan poder discriminante. "Manteca de Karité" y
 * "Aceite de Coco" comparten el "de" y no por eso se parecen.
 * (Las de 1 carácter — "y", "o", "a", "e" — ya caen por el filtro de longitud.)
 */
const VACIAS = new Set([
  "de", "del", "la", "el", "los", "las", "un", "una", "unos", "unas",
  "en", "para", "con", "sin", "por", "al", "sobre",
  // El sitio es multilingüe: partículas equivalentes de los demás idiomas.
  // en / INCI
  "the", "and", "of", "for", "with",
  // fr
  "le", "les", "des", "du", "et", "pour", "aux",
  // pt-BR
  "do", "da", "dos", "das", "em", "com",
  // de-DE
  "der", "die", "das", "und", "für", "fur", "mit", "von", "aus",
  // ru (ya sin tildes tras normalizar)
  "и", "для", "из", "на",
]);

// ---------------------------------------------------------------------------
// Normalización
// ---------------------------------------------------------------------------

/**
 * minúsculas · sin tildes · sin puntuación · espacios colapsados.
 *
 *   normalizar("Ácido Cítrico Anhidro")   → "acido citrico anhidro"
 *   normalizar("Caprylic/Capric (CI 1)")  → "caprylic capric ci 1"
 *
 * Quitar tildes no es cosmético: el comprador escribe "acido citrico" y el
 * catálogo dice "Ácido Cítrico". Sin este paso cada tilde omitida gastaría un
 * error del presupuesto de tolerancia, que es justo lo que hay que reservar
 * para las erratas de verdad.
 */
export function normalizar(texto: string): string {
  return (
    texto
      .toLowerCase()
      .normalize("NFD")
      // Diacríticos combinantes que NFD acaba de separar (la ñ pasa a n: buscado).
      .replace(/[̀-ͯ]/g, "")
      // La puntuación se convierte en separador, no se borra: así "Mica-Dióxido"
      // da dos tokens y no el engendro "micadioxido".
      // \p{L}\p{N} en vez de a-z0-9: el catálogo también existe en ruso y chino,
      // y el regex ASCII borraría "Глицерин" o "甘油" por completo.
      .replace(/[^\p{L}\p{N}]+/gu, " ")
      .trim()
  );
}

/**
 * Normaliza y parte en palabras útiles: descarta las de 1 carácter y las vacías.
 *
 *   tokenizar("Aceite Esencial de Árbol de Té") → ["aceite","esencial","arbol","te"]
 */
export function tokenizar(texto: string): string[] {
  const tokens: string[] = [];
  for (const t of normalizar(texto).split(" ")) {
    if (t.length > 1 && !VACIAS.has(t)) tokens.push(t);
  }
  return tokens;
}

// ---------------------------------------------------------------------------
// Distancia de edición
// ---------------------------------------------------------------------------

/**
 * Distancia de Damerau-Levenshtein (variante OSA) con corte temprano.
 *
 * Cuenta cuatro operaciones de coste 1: inserción, borrado, sustitución y
 * TRANSPOSICIÓN de caracteres adyacentes. La transposición importa porque el
 * error más común al teclear rápido es cruzar dos letras:
 *
 *   distancia("gliceirna", "glicerina", 2) === 1   // y no 2
 *
 * Tres optimizaciones que evitan calcular la matriz completa:
 *   1. Si |len(a) - len(b)| > maxDist, ninguna secuencia de ediciones alcanza.
 *   2. Sólo se calcula una BANDA diagonal de ancho 2·maxDist+1: fuera de ella
 *      la distancia ya supera el presupuesto por construcción.
 *   3. Si la mejor celda de una fila ya excede maxDist, ninguna fila posterior
 *      mejora (los valores crecen hacia abajo): se corta y se devuelve.
 *
 * @param maxDist presupuesto de errores. El valor devuelto es exacto mientras
 *   sea <= maxDist; si lo supera se devuelve maxDist + 1 como centinela
 *   ("no alcanza") sin terminar el cálculo.
 */
export function distancia(a: string, b: string, maxDist: number): number {
  if (a === b) return 0;

  const la = a.length;
  const lb = b.length;
  const INALCANZABLE = maxDist + 1;

  // (1) Filtro por longitud: cada carácter de diferencia cuesta al menos 1 edición.
  if (Math.abs(la - lb) > maxDist) return INALCANZABLE;
  if (la === 0) return lb <= maxDist ? lb : INALCANZABLE;
  if (lb === 0) return la <= maxDist ? la : INALCANZABLE;

  // Tres filas rotativas: la transposición necesita mirar dos filas atrás.
  let prev2: number[] = new Array(lb + 1);
  let prev: number[] = new Array(lb + 1);
  let fila: number[] = new Array(lb + 1);

  // Fila 0: convertir "" en los primeros j caracteres de b cuesta j inserciones.
  for (let j = 0; j <= lb; j++) prev[j] = j;

  for (let i = 1; i <= la; i++) {
    // (2) Banda diagonal.
    const desde = Math.max(1, i - maxDist);
    const hasta = Math.min(lb, i + maxDist);

    if (desde === 1) fila[0] = i;
    // Centinelas en los bordes: la fila siguiente los leerá como vecinos y
    // deben valer "inalcanzable", no basura reciclada de dos filas atrás.
    else fila[desde - 1] = INALCANZABLE;
    if (hasta < lb) fila[hasta + 1] = INALCANZABLE;

    let mejorFila = INALCANZABLE;

    for (let j = desde; j <= hasta; j++) {
      const costo = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;

      let v = prev[j] + 1; // borrado
      const insercion = fila[j - 1] + 1;
      if (insercion < v) v = insercion;
      const sustitucion = prev[j - 1] + costo;
      if (sustitucion < v) v = sustitucion;

      // Transposición: a[i-1] y a[i-2] aparecen cruzados en b.
      if (
        i > 1 && j > 1 &&
        a.charCodeAt(i - 1) === b.charCodeAt(j - 2) &&
        a.charCodeAt(i - 2) === b.charCodeAt(j - 1)
      ) {
        const transposicion = prev2[j - 2] + 1;
        if (transposicion < v) v = transposicion;
      }

      fila[j] = v;
      if (v < mejorFila) mejorFila = v;
    }

    // (3) Corte temprano: toda la fila gastó el presupuesto.
    if (mejorFila > maxDist) return INALCANZABLE;

    const reciclada = prev2;
    prev2 = prev;
    prev = fila;
    fila = reciclada;
  }

  const d = prev[lb];
  return d > maxDist ? INALCANZABLE : d;
}

/**
 * Errores tolerados según lo larga que sea la palabra buscada.
 *
 * Escala deliberadamente conservadora: en un catálogo químico las palabras
 * cortas son siglas donde 1 error las convierte en otro producto ("SLS"/"SLES",
 * "MAP"/"MKP"), y las largas comparten prefijos enormes, así que un presupuesto
 * generoso las hace colapsar entre sí ("estearico" y "estearato" ya están a
 * distancia 2). Por eso las de 10+ se quedan en 2 y no suben a 3.
 */
function tolerancia(largo: number): number {
  if (largo <= 3) return 0; // siglas: sin margen
  if (largo <= 6) return 1;
  return 2; // 7 o más
}

/** Bonus por acertar en el nombre del producto y no en un sinónimo lejano. */
function bonusPosicion(indice: number): number {
  if (indice === 0) return BONUS_PRIMER_TOKEN;
  if (indice < TOKENS_DEL_NOMBRE) return BONUS_NOMBRE;
  return 1;
}

// ---------------------------------------------------------------------------
// Puntuación
// ---------------------------------------------------------------------------

/**
 * Puntúa qué tan bien una consulta describe un producto.
 *
 * @param consulta  lo que escribió el usuario, tal cual (o ya normalizado: da igual).
 * @param tokensDoc tokens del producto, en orden: [nombre, INCI, sinónimos].
 * @returns 0 si NO hay coincidencia; > 0 si la hay (mayor = mejor).
 *
 * Semántica AND: toda palabra de la consulta debe coincidir con algún token del
 * producto. Es lo que evita que "acido estearico" devuelva los ~40 productos con
 * "ácido" en el nombre: "estearico" también tiene que aparecer. Cada palabra
 * aporta su MEJOR coincidencia y los aportes se suman.
 */
export function puntuar(consulta: string, tokensDoc: string[]): number {
  const palabras = tokenizar(consulta);
  if (!palabras.length || !tokensDoc.length) return 0;

  let total = 0;

  for (const palabra of palabras) {
    const tol = tolerancia(palabra.length);
    let mejor = 0;

    for (let i = 0; i < tokensDoc.length; i++) {
      const token = tokensDoc[i];
      let p = 0;

      if (token === palabra) {
        p = PESO_IGUAL;
      } else if (token.startsWith(palabra)) {
        // Cuanto más del token cubre el prefijo, mejor: "xantan" describe
        // "xantana" (6/7) mucho mejor que "ci" describe "citronelol" (2/10).
        const cobertura = palabra.length / token.length;
        p = PESO_PREFIJO_MIN + (PESO_PREFIJO_MAX - PESO_PREFIJO_MIN) * cobertura;
      } else if (token.includes(palabra)) {
        p = PESO_CONTIENE;
      } else if (tol > 0 && Math.abs(token.length - palabra.length) <= tol) {
        // Filtro O(1) ANTES de la matriz: descarta la inmensa mayoría de los
        // ~3.000 tokens del catálogo sin calcular ninguna distancia.
        const d = distancia(palabra, token, tol);
        if (d <= tol) p = PESO_FUZZY_BASE - PENALIZACION_FUZZY * d;
      }

      if (p <= 0) continue;

      p *= bonusPosicion(i);
      if (p > mejor) mejor = p;

      // Nada puede superar un exacto en el primer token: dejamos de buscar.
      if (mejor >= PESO_IGUAL * BONUS_PRIMER_TOKEN) break;
    }

    // AND: si una sola palabra de la consulta no aparece, el producto no sirve.
    if (mejor === 0) return 0;
    total += mejor;
  }

  // Desempate por letra/dígito suelto: `tokenizar` descarta los fragmentos de 1
  // carácter, pero en un catálogo químico esa letra suelta ES el producto
  // ("Vitamina E" vs "Vitamina A"). Sin esto, "vitamna e" empata a las cuatro
  // vitaminas y el orden lo decide el azar del catálogo.
  // Es BONUS y no filtro a propósito: sólo reordena entre productos que ya
  // pasaron el AND, así que jamás inventa resultados ni descarta uno bueno
  // (y si el índice no conserva sueltos, simplemente no suma: degrada limpio).
  for (const frag of normalizar(consulta).split(" ")) {
    if (frag.length === 1 && tokensDoc.includes(frag)) total += BONUS_DISCRIMINADOR;
  }

  return total;
}
