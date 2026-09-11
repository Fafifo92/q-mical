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
const jsons = (dir) => readdirSync(dir).filter((f) => f.endsWith(".json"));

// ── Referencia en español ─────────────────────────────────────────
const maestro = new Map(); // id -> producto
for (const f of jsons(join(raiz, "src/data/products"))) {
  for (const p of leer(join(raiz, "src/data/products", f))) maestro.set(p.id, p);
}
const uiEs = leer(join(raiz, "src/i18n/ui/es.json"));

/** Todas las rutas de claves de un objeto: "home.noticias.0.titulo", … */
function claves(obj, prefijo = "") {
  const out = [];
  for (const [k, v] of Object.entries(obj)) {
    const ruta = prefijo ? `${prefijo}.${k}` : k;
    if (v && typeof v === "object") out.push(...claves(v, ruta));
    else out.push(ruta);
  }
  return out;
}
const clavesEs = claves(uiEs);

/** Marcadores {n}, {year}… de un texto, para comparar entre idiomas. */
const marcadores = (s) => (typeof s === "string" ? (s.match(/\{\w+\}/g) ?? []).sort().join(" ") : "");
const valor = (obj, ruta) => ruta.split(".").reduce((o, k) => o?.[k], obj);

// Slugs de la taxonomía (fuente única: src/data/taxonomy.ts)
const taxEs = readFileSync(join(raiz, "src/data/taxonomy.ts"), "utf8");
const slugsDe = (constante) => {
  const bloque = taxEs.match(new RegExp(`export const ${constante}[^=]*=\\s*\\[([\\s\\S]*?)\\n\\];`));
  return bloque ? [...bloque[1].matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]) : [];
};
const LINEAS = slugsDe("LINEAS");
const INDUSTRIAS = slugsDe("INDUSTRIAS");

console.log(
  `\n🌐 Traducciones — español: ${maestro.size} productos · ${clavesEs.length} claves de interfaz · ` +
    `${LINEAS.length} líneas · ${INDUSTRIAS.length} industrias\n`
);

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
    const sobran = [...suyas].filter((k) => !clavesEs.includes(k));
    const marcas = clavesEs.filter((k) => suyas.has(k) && marcadores(valor(uiEs, k)) !== marcadores(valor(ui, k)));
    if (faltan.length) avisar(`interfaz: ${faltan.length} claves sin traducir (ej. ${faltan.slice(0, 3).join(", ")})`);
    if (sobran.length) avisar(`interfaz: ${sobran.length} claves que ya no existen en español (ej. ${sobran.slice(0, 3).join(", ")})`);
    if (marcas.length) err(`interfaz: marcadores {…} distintos al español en ${marcas.slice(0, 3).join(", ")}`);
    if (!faltan.length && !sobran.length && !marcas.length) console.log(`  ✔ interfaz completa (${clavesEs.length} claves)`);
  }

  // 2. Productos
  const dir = join(raiz, "src/data/i18n/products", lang);
  if (!existsSync(dir)) {
    err(`falta la carpeta src/data/i18n/products/${lang}/`);
  } else {
    const vistos = new Set();
    for (const f of jsons(dir)) {
      let lista;
      try {
        lista = leer(join(dir, f));
      } catch (e) {
        err(`${lang}/${f} no parsea: ${e.message}`);
        continue;
      }
      for (const o of lista) {
        if (!maestro.has(o.id)) {
          err(`${lang}/${f}: id inexistente "${o.id}"`);
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

  // 3. Taxonomía: las 12 líneas y 8 industrias con nombre, corto y tagline
  const fTax = join(raiz, "src/data/i18n/taxonomy", `${lang}.json`);
  if (!existsSync(fTax)) {
    err(`falta src/data/i18n/taxonomy/${lang}.json`);
  } else {
    const tax = leer(fTax);
    const incompletas = (grupo, slugs) =>
      slugs.filter((s) => !["nombre", "corto", "tagline"].every((c) => tax[grupo]?.[s]?.[c]?.trim()));
    const fL = incompletas("lineas", LINEAS);
    const fI = incompletas("industrias", INDUSTRIAS);
    if (fL.length) avisar(`taxonomía: líneas sin traducir: ${fL.join(", ")}`);
    if (fI.length) avisar(`taxonomía: industrias sin traducir: ${fI.join(", ")}`);
    if (!fL.length && !fI.length)
      console.log(`  ✔ taxonomía completa (${LINEAS.length} líneas, ${INDUSTRIAS.length} industrias)`);
  }
}

console.log("");
if (errores) {
  console.error(`${errores} error(es)${avisos ? ` y ${avisos} aviso(s)` : ""}.\n`);
  process.exit(1);
}
console.log(avisos ? `Sin errores. ${avisos} aviso(s) — el contenido faltante cae al español.\n` : "Todas las traducciones completas ✔\n");
