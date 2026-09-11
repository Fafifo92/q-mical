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

// Vocabularios: se leen de src/data/taxonomy.ts (fuente única de verdad)
const taxonomia = readFileSync(join(raiz, "src", "data", "taxonomy.ts"), "utf8");
const slugsDe = (constante) => {
  const bloque = taxonomia.match(new RegExp(`export const ${constante}[^=]*=\\s*\\[([\\s\\S]*?)\\n\\];`));
  return bloque ? [...bloque[1].matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]) : [];
};
const LINEAS = slugsDe("LINEAS");
const INDUSTRIAS = slugsDe("INDUSTRIAS");
const ORIGENES = ["Vegetal", "Sintético", "Sintetico", "Mineral", "Biotecnológico", "Biotecnologico", "Animal", "Mixto"];

if (!LINEAS.length || !INDUSTRIAS.length) {
  console.error("No se pudieron leer LINEAS / INDUSTRIAS de src/data/taxonomy.ts");
  process.exit(1);
}

const OBLIGATORIOS = ["id", "nombre", "lineas", "industrias", "descripcion", "funciones", "aplicaciones", "formas_referenciales", "origen"];

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
const porLinea = Object.fromEntries(LINEAS.map((l) => [l, 0]));

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
      if (p[campo] === undefined || p[campo] === null || (Array.isArray(p[campo]) && !p[campo].length)) {
        error(archivo, `"${ref}": falta el campo obligatorio "${campo}"`);
      }
    }
    if (!p.id) continue;

    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.id))
      error(archivo, `"${ref}": el id debe ser kebab-case (minúsculas, números y guiones)`);

    if (idsVistos.has(p.id))
      error(archivo, `"${ref}": id duplicado (ya existe en ${idsVistos.get(p.id)})`);
    else idsVistos.set(p.id, archivo);

    for (const l of p.lineas ?? []) {
      if (!LINEAS.includes(l))
        error(archivo, `"${ref}": línea de producto desconocida "${l}". Válidas: ${LINEAS.join(", ")}`);
      else porLinea[l]++;
    }

    for (const i of p.industrias ?? [])
      if (!INDUSTRIAS.includes(i))
        error(archivo, `"${ref}": industria desconocida "${i}". Válidas: ${INDUSTRIAS.join(", ")}`);

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
const vacias = Object.entries(porLinea).filter(([, n]) => !n).map(([l]) => l);
if (vacias.length)
  console.log(`ℹ️  Líneas sin productos publicados (se muestran como «Consultar disponibilidad»): ${vacias.join(", ")}`);
if (errores) {
  console.error(`\n${errores} error(es) — corrígelos antes de publicar.`);
  process.exit(1);
}
console.log(advertencias ? `${advertencias} advertencia(s), nada bloqueante.` : "Todo en orden ✔");
