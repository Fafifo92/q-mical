#!/usr/bin/env node
/**
 * Validador del catálogo — `npm run validar`
 * Revisa todos los src/data/products/*.json y avisa en español si algo está mal:
 * campos faltantes, slugs inexistentes, ids duplicados, tipos incorrectos.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const dirProductos = join(raiz, "src", "data", "products");

// Vocabularios (deben coincidir con src/data/taxonomy.ts)
const LINEAS = ["cosmetica", "maquillaje", "aseo", "alimentos", "agro", "veterinaria", "extractos", "industrial"];
const ESPECIALIDADES = ["activos", "aceites-vegetales", "mantecas-ceras", "emolientes", "emulsificantes", "tensoactivos", "humectantes", "espesantes-reologia", "conservantes", "antioxidantes", "filtros-uv", "pigmentos-colorantes", "nacarantes-efectos", "acondicionadores", "proteinas-aminoacidos", "vitaminas", "exfoliantes", "siliconas-alternativas", "polimeros", "quelantes", "solventes", "acidulantes-ph", "edulcorantes", "gomas-hidrocoloides", "enzimas", "biocidas-desinfectantes", "desengrasantes", "dispersantes-antiespumantes", "nutricion-vegetal", "adyuvantes-agricolas", "premezclas-veterinarias", "extractos-botanicos"];
const SECTORES = ["cosmetica-personal", "maquillaje-color", "aseo-hogar", "institucional-industrial", "alimentos", "bebidas", "nutraceutico", "veterinaria", "agricola", "pinturas-recubrimientos", "textil", "tratamiento-aguas"];
const ORIGENES = ["Vegetal", "Sintético", "Sintetico", "Mineral", "Biotecnológico", "Biotecnologico", "Animal", "Mixto"];

const OBLIGATORIOS = ["id", "nombre", "linea", "especialidades", "sectores", "descripcion", "funciones", "aplicaciones", "formas_referenciales", "origen"];

let errores = 0;
let advertencias = 0;
const idsVistos = new Map(); // id -> archivo

function error(archivo, msg) {
  console.error(`  ❌ [${archivo}] ${msg}`);
  errores++;
}
function advertir(archivo, msg) {
  console.warn(`  ⚠️  [${archivo}] ${msg}`);
  advertencias++;
}

let archivos;
try {
  archivos = readdirSync(dirProductos).filter((f) => f.endsWith(".json"));
} catch {
  console.error(`No existe la carpeta ${dirProductos}`);
  process.exit(1);
}

if (!archivos.length) {
  console.error("No hay archivos .json en src/data/products/");
  process.exit(1);
}

let totalProductos = 0;

for (const archivo of archivos) {
  let data;
  try {
    data = JSON.parse(readFileSync(join(dirProductos, archivo), "utf8"));
  } catch (e) {
    error(archivo, `JSON inválido: ${e.message}`);
    continue;
  }
  if (!Array.isArray(data)) {
    error(archivo, "el archivo debe contener un arreglo [ ... ] de productos");
    continue;
  }

  for (const p of data) {
    totalProductos++;
    const ref = p?.id ?? p?.nombre ?? "(producto sin id)";

    for (const campo of OBLIGATORIOS) {
      if (p[campo] === undefined || p[campo] === null || (Array.isArray(p[campo]) && !p[campo].length && campo !== "sinonimos")) {
        error(archivo, `"${ref}": falta el campo obligatorio "${campo}"`);
      }
    }
    if (!p.id) continue;

    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.id))
      error(archivo, `"${ref}": el id debe ser kebab-case (minúsculas, números y guiones)`);

    if (idsVistos.has(p.id))
      error(archivo, `"${ref}": id duplicado (ya existe en ${idsVistos.get(p.id)})`);
    else idsVistos.set(p.id, archivo);

    if (p.linea && !LINEAS.includes(p.linea))
      error(archivo, `"${ref}": línea desconocida "${p.linea}". Válidas: ${LINEAS.join(", ")}`);

    for (const l of p.lineas_secundarias ?? [])
      if (!LINEAS.includes(l)) error(archivo, `"${ref}": línea secundaria desconocida "${l}"`);

    for (const e of p.especialidades ?? [])
      if (!ESPECIALIDADES.includes(e))
        error(archivo, `"${ref}": especialidad desconocida "${e}". Agrégala a taxonomy.ts o usa una existente.`);

    for (const s of p.sectores ?? [])
      if (!SECTORES.includes(s))
        error(archivo, `"${ref}": sector desconocido "${s}". Agrégalo a taxonomy.ts o usa uno existente.`);

    if (p.origen && !ORIGENES.includes(p.origen))
      error(archivo, `"${ref}": origen "${p.origen}" no válido. Usa: Vegetal, Sintético, Mineral, Biotecnológico, Animal o Mixto`);

    if (typeof p.descripcion === "string") {
      if (p.descripcion.length < 40)
        advertir(archivo, `"${ref}": descripción muy corta (${p.descripcion.length} caracteres)`);
      if (/\b\d{1,3}\s?%/.test(p.descripcion))
        advertir(archivo, `"${ref}": la descripción menciona un porcentaje — evita prometer concentraciones o purezas`);
    }
  }
}

console.log("");
console.log(`Catálogo: ${totalProductos} productos en ${archivos.length} archivos.`);
if (errores) {
  console.error(`\n${errores} error(es) — corrígelos antes de publicar.`);
  process.exit(1);
}
console.log(advertencias ? `${advertencias} advertencia(s), nada bloqueante.` : "Todo en orden ✔");
