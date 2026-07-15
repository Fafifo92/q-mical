#!/usr/bin/env node
/**
 * 🖼️  GENERADOR DE IMÁGENES OG — `npm run og`
 * -------------------------------------------
 * Crea las imágenes de vista previa que se ven al compartir el sitio por
 * WhatsApp, LinkedIn, etc. Se maquetan con satori (flexbox → SVG, con la
 * tipografía real de la marca) y se rasterizan a JPG.
 *
 * Genera en public/og/:
 *   general.jpg        → portada y cualquier página sin imagen propia
 *   <seccion>.jpg      → catálogo, sectores, cotización, servicio técnico…
 *   linea-<slug>.jpg   → una por línea; cada ficha de producto usa la suya
 *
 * Reglas que impone WhatsApp (doc oficial de Meta): imagen <600 KB, ancho
 * mínimo 300px, ratio ≤4:1 y URL absoluta. Usamos 1200×630 (el estándar OG).
 * Ojo: WhatsApp cachea por URL — si cambias el diseño, sube OG_VERSION en
 * src/data/site.ts para que vuelva a leerla.
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const salida = join(raiz, "public", "og");
mkdirSync(salida, { recursive: true });

const W = 1200;
const H = 630;

// Fuentes ESTÁTICAS: satori no sabe leer las variables (falla en el eje fvar).
// Las .ttf viven en scripts/fuentes/ y se generan desde los .woff2 de
// @fontsource con `npm run og:fuentes`.
const F = (archivo) => readFileSync(join(raiz, "scripts", "fuentes", archivo));
const fuentes = [
  { name: "Space Grotesk", data: F("space-grotesk-700.ttf"), weight: 700, style: "normal" },
  { name: "Inter", data: F("inter-400.ttf"), weight: 400, style: "normal" },
  { name: "Inter", data: F("inter-600.ttf"), weight: 600, style: "normal" },
];

/** Atajo para escribir el árbol de satori sin JSX. */
const h = (type, props = {}, ...children) => ({
  type,
  props: { ...props, children: children.length === 1 ? children[0] : children.length ? children : props.children },
});

/** Matraz de la marca, en trazos (el mismo del favicon). */
const logo = () =>
  h("svg", { width: 46, height: 46, viewBox: "0 0 24 24", fill: "none" },
    h("path", {
      d: "M10 2v7.5L4.5 19a2 2 0 0 0 1.8 3h11.4a2 2 0 0 0 1.8-3L14 9.5V2M8.5 2h7M7 15.5h10",
      stroke: "#d0f070", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round",
    })
  );

/** Ondas decorativas de la marca, teñidas del color de la sección. */
const ondas = (color) =>
  h("div", { style: { position: "absolute", top: 0, right: 0, width: 700, height: 630, display: "flex" } },
    h("svg", { width: 700, height: 630, viewBox: "0 0 700 630", fill: "none" },
      ...Array.from({ length: 10 }, (_, k) =>
        h("path", {
          d: `M-40 ${-40 + k * 46} C 220 ${120 + k * 34}, 380 ${340 - k * 22}, 760 ${200 + k * 48}`,
          stroke: color, strokeOpacity: 0.3, strokeWidth: 1.6,
        })
      )
    )
  );

function tarjeta({ titulo, bajada, etiqueta, color, pie }) {
  return h("div", {
    style: {
      width: W, height: H, display: "flex", flexDirection: "column", justifyContent: "space-between",
      padding: "64px 72px", position: "relative",
      backgroundColor: "#052420",
      backgroundImage: `radial-gradient(900px 500px at 85% 0%, ${color}55, transparent 70%), radial-gradient(700px 500px at 0% 100%, #a8d12930, transparent 70%)`,
      fontFamily: "Inter",
    },
  },
    ondas(color),

    // Marca
    h("div", { style: { display: "flex", alignItems: "center", gap: 18, position: "relative" } },
      h("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", width: 72, height: 72, borderRadius: 20, backgroundColor: "#157a64" } }, logo()),
      h("div", { style: { display: "flex", fontFamily: "Space Grotesk", fontSize: 38, fontWeight: 700, color: "white" } },
        h("span", {}, "Q"),
        h("span", { style: { color: "#a8d129" } }, "'"),
        h("span", {}, "mical")
      )
    ),

    // Mensaje
    h("div", { style: { display: "flex", flexDirection: "column", position: "relative", maxWidth: 950 } },
      h("div", { style: { display: "flex", fontSize: 23, fontWeight: 400, color, letterSpacing: 4, textTransform: "uppercase", marginBottom: 18 } }, etiqueta),
      h("div", { style: { display: "flex", fontFamily: "Space Grotesk", fontSize: 60, fontWeight: 700, color: "white", lineHeight: 1.14, letterSpacing: -1 } }, titulo),
      h("div", { style: { display: "flex", fontSize: 26, color: "#b3e4d1", marginTop: 22, lineHeight: 1.35 } }, bajada)
    ),

    // Pie
    h("div", { style: { display: "flex", alignItems: "center", gap: 14, position: "relative" } },
      h("div", { style: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#a8d129", display: "flex" } }),
      h("div", { style: { display: "flex", fontSize: 21, color: "#81cfb5" } }, pie)
    )
  );
}

// ── Qué se genera ──────────────────────────────────────────────────
// Los textos salen de los diccionarios de src/i18n/ui/<lang>.json, así que
// las vistas previas quedan en el idioma de la página que se comparte.
const MARCA = "#2b977c";
const LOCALES = ["es", "en", "fr", "pt", "de", "ru", "zh"];

/** Color de cada tarjeta de sección (el diccionario solo trae textos). */
const COLOR_SECCION = {
  general: MARCA,
  productos: MARCA,
  sectores: "#0E9BD8",
  cotizacion: "#85a81b",
  "servicio-tecnico": "#0E9BD8",
  nosotros: MARCA,
  pagos: "#65A30D",
};

// Colores y slugs de las líneas (el nombre/tagline se toma por idioma)
const taxonomia = readFileSync(join(raiz, "src", "data", "taxonomy.ts"), "utf8");
const lineas = [
  ...taxonomia.matchAll(
    /slug:\s*"([^"]+)",\s*\n\s*nombre:\s*"([^"]+)",\s*\n\s*corto:\s*"([^"]+)",\s*\n\s*tagline:\s*"([^"]+)",\s*\n\s*color:\s*"([^"]+)"/g
  ),
].map((m) => ({ slug: m[1], nombre: m[2], tagline: m[4], color: m[5] }));

if (!lineas.length) {
  console.error("No se pudieron leer las líneas de src/data/taxonomy.ts");
  process.exit(1);
}

const leerJSON = (p) => (existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null);
const uiEs = leerJSON(join(raiz, "src", "i18n", "ui", "es.json"));

/** Devuelve las tarjetas de un idioma (con fallback al español si falta). */
function tarjetasDe(lang) {
  const ui = lang === "es" ? uiEs : (leerJSON(join(raiz, "src", "i18n", "ui", `${lang}.json`)) ?? uiEs);
  const og = ui.og ?? uiEs.og;
  const tax = lang === "es" ? null : leerJSON(join(raiz, "src", "data", "i18n", "taxonomy", `${lang}.json`));

  const out = og.tarjetas.map((t) => ({
    archivo: t.archivo,
    etiqueta: t.etiqueta,
    titulo: t.titulo,
    bajada: t.bajada,
    color: COLOR_SECCION[t.archivo] ?? MARCA,
    pie: og.pie,
  }));

  for (const l of lineas) {
    const ovl = tax?.lineas?.[l.slug];
    out.push({
      archivo: `linea-${l.slug}`,
      etiqueta: og.lineaEtiqueta,
      titulo: ovl?.nombre ?? l.nombre,
      bajada: ovl?.tagline ?? l.tagline,
      color: l.color,
      pie: og.pie,
    });
  }
  return out;
}

// ── Generar ────────────────────────────────────────────────────────
const { default: sharp } = await import("sharp");
let pesoMax = 0;
let total = 0;

for (const lang of LOCALES) {
  // Español en la raíz de /og/, el resto en /og/<lang>/ (así lo espera Base.astro)
  const dir = lang === "es" ? salida : join(salida, lang);
  mkdirSync(dir, { recursive: true });

  for (const t of tarjetasDe(lang)) {
    const svg = await satori(tarjeta(t), { width: W, height: H, fonts: fuentes });
    const png = new Resvg(svg, { fitTo: { mode: "width", value: W } }).render().asPng();

    // JPG: es lo que Meta documenta como seguro y pesa una fracción del PNG
    const jpg = await sharp(png).jpeg({ quality: 84, progressive: true, mozjpeg: true }).toBuffer();

    const kb = jpg.length / 1024;
    pesoMax = Math.max(pesoMax, kb);
    if (kb > 600) {
      console.error(`  ✘ ${lang}/${t.archivo}.jpg pesa ${kb.toFixed(0)} KB — WhatsApp no carga imágenes de más de 600 KB`);
      process.exit(1);
    }
    writeFileSync(join(dir, `${t.archivo}.jpg`), jpg);
    total++;
  }
  process.stdout.write(`  ${lang} `);
}

console.log(`\n\n🖼️  ${total} imágenes OG en public/og/ — ${W}×${H}, la más pesada ${pesoMax.toFixed(0)} KB`);
console.log(`   ${LOCALES.length} idiomas × (7 de sección + ${lineas.length} de línea)\n`);
