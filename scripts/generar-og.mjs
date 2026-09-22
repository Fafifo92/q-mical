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
 *   <seccion>.jpg      → portafolio, contacto, cotización, nosotros, pagos
 *   linea-<slug>.jpg   → una por línea de producto; cada ficha usa la de su línea principal
 *
 * Reglas que impone WhatsApp (doc oficial de Meta): imagen <600 KB, ancho
 * mínimo 300px, ratio ≤4:1 y URL absoluta. Usamos 1200×630 (el estándar OG).
 * Ojo: WhatsApp cachea por URL — si cambias el diseño, sube `ogVersion` en
 * src/data/site.ts para que vuelva a leerla.
 */
import { mkdirSync, writeFileSync, readFileSync, readdirSync, existsSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { LINEAS, INDUSTRIAS } from "../src/data/taxonomy.ts";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const salida = join(raiz, "public", "og");

const W = 1200;
const H = 630;

// ── Tipografías del manual de marca ────────────────────────────────
// Satori no lee fuentes variables ni WOFF2: se usan los .woff estáticos de
// @fontsource, un archivo por subconjunto (latín, latín extendido, cirílico).
// Cada subconjunto se registra con su propio nombre y el texto usa la pila
// completa (p. ej. "Montserrat, Montserrat cyrillic…"): así satori busca el
// glifo en el siguiente archivo cuando el primero no lo tiene.
const woff = (paquete, archivo) => readFileSync(join(raiz, "node_modules", "@fontsource", paquete, "files", archivo));
const SUBCONJUNTOS = ["latin", "latin-ext", "cyrillic"];
const nombre = (familia, s) => (s === "latin" ? familia : `${familia} ${s}`);
const pila = (familia) => SUBCONJUNTOS.map((s) => `"${nombre(familia, s)}"`).join(", ");
const fuentesMarca = [
  ...SUBCONJUNTOS.map((s) => ({ name: nombre("Montserrat", s), data: woff("montserrat", `montserrat-${s}-700-normal.woff`), weight: 700, style: "normal" })),
  ...SUBCONJUNTOS.flatMap((s) =>
    [400, 600].map((w) => ({ name: nombre("Open Sans", s), data: woff("open-sans", `open-sans-${s}-${w}-normal.woff`), weight: w, style: "normal" }))
  ),
];
const TITULOS = pila("Montserrat");
const TEXTOS = pila("Open Sans");

/**
 * Chino: Montserrat y Open Sans no tienen ideogramas. Si está instalado
 * @fontsource/noto-sans-sc (devDependency), se cargan solo los subconjuntos
 * que cubren los caracteres de los textos en chino.
 */
function fuentesChino(textos) {
  const dir = join(raiz, "node_modules", "@fontsource", "noto-sans-sc");
  if (!existsSync(dir)) return null;
  const usados = new Set([...textos.join("")].map((c) => c.codePointAt(0)));
  const fuentes = [];
  const nombres = new Set();
  for (const peso of [400, 700]) {
    const css = readFileSync(join(dir, `${peso}.css`), "utf8");
    for (const bloque of css.split("@font-face").slice(1)) {
      const archivo = bloque.match(/url\(\.\/files\/([^)]+?\.woff)\)/)?.[1];
      const rango = bloque.match(/unicode-range:\s*([^;]+);/)?.[1];
      if (!archivo || !rango) continue;
      const cubre = rango.split(",").some((r) => {
        const [a, b] = r.trim().replace(/^U\+/i, "").split("-").map((h) => parseInt(h, 16));
        for (const cp of usados) if (cp >= a && cp <= (b ?? a)) return true;
        return false;
      });
      if (!cubre) continue;
      // Un nombre por subconjunto (igual en ambos pesos), como con el cirílico
      const subconjunto = archivo.match(/noto-sans-sc-(.+?)-\d{3}-normal/)?.[1] ?? archivo;
      const name = `Noto Sans SC ${subconjunto}`;
      nombres.add(name);
      fuentes.push({ name, data: readFileSync(join(dir, "files", archivo)), weight: peso, style: "normal" });
    }
  }
  return { fuentes, pila: [...nombres].map((n) => `"${n}"`).join(", ") };
}

/** Atajo para escribir el árbol de satori sin JSX. */
const h = (type, props = {}, ...children) => ({
  type,
  props: { ...props, children: children.length === 1 ? children[0] : children.length ? children : props.children },
});

// Isotipo real de la marca (PNG con transparencia)
const isotipo = `data:image/png;base64,${readFileSync(join(raiz, "public", "brand", "isotipo.png")).toString("base64")}`;

/** Ondas decorativas en turquesa, a la derecha. */
const ondas = () =>
  h("div", { style: { position: "absolute", top: 0, right: 0, width: 700, height: 630, display: "flex" } },
    h("svg", { width: 700, height: 630, viewBox: "0 0 700 630", fill: "none" },
      ...Array.from({ length: 10 }, (_, k) =>
        h("path", {
          d: `M-40 ${-40 + k * 46} C 220 ${120 + k * 34}, 380 ${340 - k * 22}, 760 ${200 + k * 48}`,
          stroke: "#36bdbc", strokeOpacity: 0.22, strokeWidth: 1.6,
        })
      )
    )
  );

function tarjeta({ titulo, bajada, etiqueta, pie, familiaTexto, familiaTitulo }) {
  return h("div", {
    style: {
      width: W, height: H, display: "flex", flexDirection: "column", justifyContent: "space-between",
      padding: "60px 72px", position: "relative",
      backgroundColor: "#0b3b5e",
      backgroundImage:
        "radial-gradient(900px 520px at 88% 0%, rgba(20,168,168,0.55), transparent 70%), " +
        "radial-gradient(700px 500px at 0% 100%, rgba(196,217,44,0.18), transparent 70%), " +
        "linear-gradient(160deg, #0b3b5e 0%, #072840 100%)",
      fontFamily: familiaTexto,
    },
  },
    ondas(),

    // Marca: isotipo + logotipo (versión negativa)
    h("div", { style: { display: "flex", alignItems: "center", gap: 18, position: "relative" } },
      h("img", { src: isotipo, width: 92, height: 87 }),
      h("div", { style: { display: "flex", flexDirection: "column", fontFamily: "Montserrat", fontWeight: 700, fontSize: 38, lineHeight: 1 } },
        h("span", { style: { color: "#66d2cf" } }, "Origen"),
        h("span", { style: { color: "white", marginTop: 2 } }, "Chemical")
      )
    ),

    // Mensaje
    h("div", { style: { display: "flex", flexDirection: "column", position: "relative", maxWidth: 960 } },
      h("div", { style: { display: "flex", fontSize: 22, fontWeight: 600, color: "#d7e57a", letterSpacing: 4, textTransform: "uppercase", marginBottom: 18 } }, etiqueta),
      h("div", { style: { display: "flex", fontFamily: familiaTitulo, fontSize: 56, fontWeight: 700, color: "white", lineHeight: 1.15, letterSpacing: -0.5 } }, titulo),
      h("div", { style: { display: "flex", fontSize: 26, color: "#d5e3ee", marginTop: 22, lineHeight: 1.4 } }, bajada)
    ),

    // Pie
    h("div", { style: { display: "flex", alignItems: "center", gap: 14, position: "relative" } },
      h("div", { style: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#c4d92c", display: "flex" } }),
      h("div", { style: { display: "flex", fontSize: 21, color: "#adc7dc" } }, pie)
    )
  );
}

// ── Qué se genera ──────────────────────────────────────────────────
// Los textos salen de los diccionarios de src/i18n/ui/<lang>.json, así que
// las vistas previas quedan en el idioma de la página que se comparte.
// `npm run og -- es ru` regenera solo esos idiomas.
const TODOS = ["es", "en", "fr", "pt", "de", "ru", "zh"];
const pedidos = process.argv.slice(2).filter((l) => TODOS.includes(l));
const LOCALES = pedidos.length ? pedidos : TODOS;

// Cifras reales del portafolio para los textos con {productos}, {lineas} e {industrias}
const dirProductos = join(raiz, "src", "data", "products");
const totalProductos = readdirSync(dirProductos)
  .filter((f) => f.endsWith(".json"))
  .reduce((n, f) => n + JSON.parse(readFileSync(join(dirProductos, f), "utf8")).length, 0);
const cifras = { productos: totalProductos, lineas: LINEAS.length, industrias: INDUSTRIAS.length };
const conCifras = (s) => s.replace(/{(productos|lineas|industrias)}/g, (_, k) => String(cifras[k]));

const leerJSON = (p) => (existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null);
const uiEs = leerJSON(join(raiz, "src", "i18n", "ui", "es.json"));

/** Devuelve las tarjetas de un idioma (con fallback al español si falta). */
function tarjetasDe(lang) {
  const ui = lang === "es" ? uiEs : (leerJSON(join(raiz, "src", "i18n", "ui", `${lang}.json`)) ?? uiEs);
  const og = ui.og ?? uiEs.og;
  const tax = lang === "es" ? null : leerJSON(join(raiz, "src", "data", "i18n", "taxonomy", `${lang}.json`));

  const out = og.tarjetas.map((t) => ({ ...t, titulo: conCifras(t.titulo), bajada: conCifras(t.bajada), pie: og.pie }));
  for (const l of LINEAS) {
    const ovl = tax?.lineas?.[l.slug];
    out.push({
      archivo: `linea-${l.slug}`,
      etiqueta: og.lineaEtiqueta,
      titulo: ovl?.nombre ?? l.nombre,
      bajada: ovl?.tagline ?? l.tagline,
      pie: og.pie,
    });
  }
  return out;
}

// ── Generar ────────────────────────────────────────────────────────
const { default: sharp } = await import("sharp");
let pesoMax = 0;
let total = 0;
let porIdioma = 0;

// Regeneración completa: se borra lo anterior para que, si una sección o
// línea desaparece, su imagen también
if (!pedidos.length) rmSync(salida, { recursive: true, force: true });
mkdirSync(salida, { recursive: true });

for (const lang of LOCALES) {
  // Español en la raíz de /og/, el resto en /og/<lang>/ (así lo espera Base.astro)
  const dir = lang === "es" ? salida : join(salida, lang);
  mkdirSync(dir, { recursive: true });

  const tarjetas = tarjetasDe(lang);
  let fuentes = fuentesMarca;
  let familiaTexto = TEXTOS;
  let familiaTitulo = TITULOS;
  if (lang === "zh") {
    const cjk = fuentesChino(tarjetas.flatMap((t) => [t.etiqueta, t.titulo, t.bajada, t.pie]));
    if (cjk?.fuentes.length) {
      fuentes = [...fuentesMarca, ...cjk.fuentes];
      // Latín primero (cifras y marcas en Montserrat/Open Sans), ideogramas después
      familiaTexto = `${TEXTOS}, ${cjk.pila}`;
      familiaTitulo = `${TITULOS}, ${cjk.pila}`;
    } else {
      console.warn("  ⚠️  zh: instala @fontsource/noto-sans-sc (npm i -D) o las imágenes en chino saldrán sin ideogramas");
    }
  }

  for (const t of tarjetas) {
    const svg = await satori(tarjeta({ ...t, familiaTexto, familiaTitulo }), { width: W, height: H, fonts: fuentes });
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
  porIdioma = tarjetas.length;
  process.stdout.write(`  ${lang} `);
}

console.log(`\n\n🖼️  ${total} imágenes OG en public/og/ — ${W}×${H}, la más pesada ${pesoMax.toFixed(0)} KB`);
console.log(`   ${LOCALES.length} idiomas × ${porIdioma} (${porIdioma - LINEAS.length} de sección + ${LINEAS.length} de línea)\n`);
