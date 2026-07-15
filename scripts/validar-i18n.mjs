#!/usr/bin/env node
/**
 * Validador de traducciones — `npm run validar:i18n`
 *
 * El español es la fuente de verdad. Este script comprueba que cada idioma
 * tenga todo traducido y bien formado; lo que falte cae al español en tiempo
 * de ejecución (el sitio no se rompe), pero aquí se reporta para que no pase
 * inadvertido.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const LOCALES = ["en", "fr", "pt", "de", "ru", "zh"];
const LINEAS = ["cosmetica", "maquillaje", "aseo", "alimentos", "agro", "veterinaria", "extractos", "industrial"];

let errores = 0;
let avisos = 0;
const err = (m) => {
  console.error(`  ❌ ${m}`);
  errores++;
};
const avisar = (m) => {
  console.warn(`  ⚠️  ${m}`);
  avisos++;
};

const leer = (p) => JSON.parse(readFileSync(p, "utf8"));

// ── Referencia en español ─────────────────────────────────────────
const maestro = new Map(); // id -> producto
for (const f of readdirSync(join(raiz, "src/data/products"))) {
  for (const p of leer(join(raiz, "src/data/products", f))) maestro.set(p.id, p);
}
const uiEs = leer(join(raiz, "src/i18n/ui/es.json"));

/** Todas las rutas de claves de un objeto: "home.heroTitulo1", … */
function claves(obj, prefijo = "") {
  const out = [];
  for (const [k, v] of Object.entries(obj)) {
    const ruta = prefijo ? `${prefijo}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) out.push(...claves(v, ruta));
    else out.push(ruta);
  }
  return out;
}
const clavesEs = claves(uiEs);

const sectoresEs = readFileSync(join(raiz, "src/data/sectores.ts"), "utf8");
const slugsSector = [...sectoresEs.matchAll(/"slug":\s*"([^"]+)"/g)].map((m) => m[1]);

const taxEs = readFileSync(join(raiz, "src/data/taxonomy.ts"), "utf8");
const slugsEsp = [...taxEs.matchAll(/^\s{2}"?([a-z-]+)"?:\s*"[^"]+",$/gm)].map((m) => m[1]);

console.log(`\n🌐 Traducciones — español: ${maestro.size} productos · ${clavesEs.length} claves de interfaz\n`);

for (const lang of LOCALES) {
  console.log(`── ${lang.toUpperCase()}`);

  // 1. Interfaz
  const rutaUI = join(raiz, "src/i18n/ui", `${lang}.json`);
  if (!existsSync(rutaUI)) {
    err(`falta src/i18n/ui/${lang}.json (la interfaz saldría en español)`);
  } else {
    const ui = leer(rutaUI);
    const suyas = new Set(claves(ui));
    const faltan = clavesEs.filter((k) => !suyas.has(k));
    if (faltan.length) avisar(`interfaz: ${faltan.length} claves sin traducir (ej. ${faltan.slice(0, 3).join(", ")})`);
    else console.log(`  ✔ interfaz completa (${clavesEs.length} claves)`);
  }

  // 2. Productos
  const dir = join(raiz, "src/data/i18n/products", lang);
  if (!existsSync(dir)) {
    err(`falta la carpeta src/data/i18n/products/${lang}/`);
  } else {
    const vistos = new Set();
    for (const linea of LINEAS) {
      const f = join(dir, `${linea}.json`);
      if (!existsSync(f)) {
        err(`falta ${lang}/${linea}.json`);
        continue;
      }
      let lista;
      try {
        lista = leer(f);
      } catch (e) {
        err(`${lang}/${linea}.json no parsea: ${e.message}`);
        continue;
      }
      for (const o of lista) {
        if (!maestro.has(o.id)) {
          err(`${lang}/${linea}.json: id inexistente "${o.id}"`);
          continue;
        }
        vistos.add(o.id);
        const m = maestro.get(o.id);
        if (!o.nombre?.trim()) err(`${lang}: "${o.id}" sin nombre`);
        if (!o.descripcion?.trim()) err(`${lang}: "${o.id}" sin descripción`);
        // Los arrays deben conservar la misma cantidad de elementos
        for (const campo of ["funciones", "aplicaciones", "formas_referenciales"]) {
          if (o[campo] && o[campo].length !== m[campo].length) {
            avisar(`${lang}: "${o.id}" tiene ${o[campo].length} ${campo} y el español ${m[campo].length}`);
          }
        }
      }
    }
    const sinTraducir = [...maestro.keys()].filter((id) => !vistos.has(id));
    if (sinTraducir.length) avisar(`productos: ${sinTraducir.length} sin traducir (caen al español)`);
    else console.log(`  ✔ ${vistos.size} productos traducidos`);
  }

  // 3. Sectores
  const fSec = join(raiz, "src/data/i18n/sectores", `${lang}.json`);
  if (!existsSync(fSec)) {
    err(`falta src/data/i18n/sectores/${lang}.json`);
  } else {
    const sec = leer(fSec);
    const faltan = slugsSector.filter((s) => !sec[s]);
    if (faltan.length) avisar(`sectores: faltan ${faltan.join(", ")}`);
    else {
      let malos = 0;
      for (const [slug, v] of Object.entries(sec)) {
        if (!v.titulo || v.intro?.length !== 2 || v.retos?.length !== 3) malos++;
      }
      malos
        ? err(`sectores: ${malos} con estructura incorrecta (intro debe tener 2 párrafos y retos 3)`)
        : console.log(`  ✔ ${Object.keys(sec).length} sectores`);
    }
  }

  // 4. Taxonomía
  const fTax = join(raiz, "src/data/i18n/taxonomy", `${lang}.json`);
  if (!existsSync(fTax)) {
    err(`falta src/data/i18n/taxonomy/${lang}.json`);
  } else {
    const tax = leer(fTax);
    const nL = Object.keys(tax.lineas ?? {}).length;
    const nE = Object.keys(tax.especialidades ?? {}).length;
    const nS = Object.keys(tax.sectores ?? {}).length;
    if (nL !== 8 || nE !== 32 || nS !== 12)
      avisar(`taxonomía: ${nL}/8 líneas, ${nE}/32 especialidades, ${nS}/12 sectores`);
    else console.log(`  ✔ taxonomía completa (8 líneas, 32 especialidades, 12 sectores)`);
  }
}

console.log("");
if (errores) {
  console.error(`${errores} error(es)${avisos ? ` y ${avisos} aviso(s)` : ""}.\n`);
  process.exit(1);
}
console.log(avisos ? `Sin errores. ${avisos} aviso(s) — el contenido faltante cae al español.\n` : "Todas las traducciones completas ✔\n");
