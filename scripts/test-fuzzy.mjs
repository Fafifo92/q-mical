/**
 * Pruebas del buscador tolerante a errores — `npm run test:fuzzy`
 * Corre contra los 227 productos reales del catálogo, sin frameworks.
 *
 * Se ejecuta con `node --experimental-strip-types`, que importa el .ts
 * directamente borrando las anotaciones de tipo. Así la prueba usa EL MISMO
 * módulo que se bundlea para producción, sin duplicar la lógica ni compilar.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { puntuar, normalizar, tokenizar, distancia } from "../src/lib/fuzzy.ts";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(raiz, "src", "data", "products");

/**
 * Índice idéntico al de producción. `ProductCard.astro` publica
 *   data-buscar = normalizar([nombre, inci, ...sinonimos].join(" "))
 * y `productos/index.astro` lo parte con .split(" ").
 *
 * Ojo: se usa `normalizar().split()` y NO `tokenizar()` a propósito. Los tokens
 * del DOCUMENTO conservan las letras sueltas ("Vitamina E" → [..., "e"]), que en
 * un catálogo químico son parte del nombre del producto. `tokenizar()` es para
 * la CONSULTA, donde esos fragmentos sí son ruido para el AND.
 */
const productos = readdirSync(dir)
  .filter((f) => f.endsWith(".json"))
  .flatMap((f) => JSON.parse(readFileSync(join(dir, f), "utf8")))
  .map((p) => ({
    nombre: p.nombre,
    tokens: normalizar([p.nombre, p.inci ?? "", ...(p.sinonimos ?? [])].join(" "))
      .split(" ")
      .filter(Boolean),
  }));

/** Top N por relevancia, igual que `aplicar()` en productos/index.astro. */
function buscar(consulta, n = 3) {
  return productos
    .map((p) => ({ nombre: p.nombre, s: puntuar(consulta, p.tokens) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, n)
    .map((r) => r.nombre);
}

let fallos = 0;
const ok = (cond, etiqueta, detalle = "") => {
  if (!cond) fallos++;
  console.log(`  ${cond ? "✔" : "✘"} ${etiqueta}${detalle ? ` → ${detalle}` : ""}`);
};

console.log(`\n🔎 Buscador difuso — ${productos.length} productos\n`);

// ── 1. Unitarias de la distancia ───────────────────────────────────────────
console.log("Distancia de edición");
ok(distancia("gliceirna", "glicerina", 2) === 1, 'transposición "gliceirna"→"glicerina" = 1');
ok(distancia("glicerna", "glicerina", 2) === 1, 'inserción "glicerna"→"glicerina" = 1');
ok(distancia("niasinamida", "niacinamida", 2) === 1, 'sustitución "niasinamida" = 1');
ok(distancia("abc", "xyz", 1) === 2, "corte temprano devuelve maxDist+1");
ok(distancia("igual", "igual", 0) === 0, "idénticas = 0");
ok(tokenizar("Aceite Esencial de Árbol de Té").join("|") === "aceite|esencial|arbol|te", "tokenizar quita vacías y sueltas");
ok(normalizar("Ácido Cítrico (CI-1)") === "acido citrico ci 1", "normalizar quita tildes y puntuación");

// ── 2. Consultas con erratas: el producto esperado debe salir en el TOP 3 ──
// [consulta con errata, fragmento que debe aparecer en el nombre del top 3]
const CASOS = [
  ["glicerna", "Glicerina"],
  ["niasinamida", "Niacinamida"],
  ["xantan", "Goma Xantana"],
  ["goma xantan", "Goma Xantana"],
  ["acido estearico", "Ácido Esteárico"],
  ["estearico", "Ácido Esteárico"],
  ["hialuronico", "Hialuronato de Sodio"],
  ["carbomero", "Carbómero"],
  ["carbomer", "Carbómero"],
  ["dioxido titanio", "Dióxido de Titanio"],
  ["vitamna e", "Vitamina E"],
  ["acido citrico", "Ácido Cítrico Anhidro"],
  ["manteca karite", "Manteca de Karité"],
  ["aloe", "Aloe"],
  ["lauril eter sulfato", "Lauril Éter Sulfato de Sodio"],
  ["propilenglicol", "Propilenglicol"],
  // ── 5 erratas realistas de un comprador colombiano ──
  ["aseite de coco", "Aceite de Coco"], // seseo: c → s
  ["bicarvonato de sodio", "Bicarbonato de Sodio"], // confusión b/v
  ["cera de avejas", "Cera de Abejas"], // confusión b/v
  ["soda caustika", "Soda Cáustica"], // k por c
  ["peroxido de idrogeno", "Peróxido de Hidrógeno"], // h muda omitida
];

console.log("\nConsultas con erratas (esperado en el top 3)");
for (const [consulta, esperado] of CASOS) {
  const top = buscar(consulta);
  const acierta = top.some((n) => normalizar(n).includes(normalizar(esperado)));
  ok(acierta, `"${consulta}"`, top.length ? top.join(" · ") : "(sin resultados)");
}

// ── 3. Sin falsos positivos ────────────────────────────────────────────────
console.log("\nFalsos positivos");
const ruido = buscar("zzzznoexiste", 5);
ok(ruido.length === 0, '"zzzznoexiste" no devuelve nada', ruido.join(" · "));

const agua = productos.filter((p) => puntuar("agua", p.tokens) > 0).length;
ok(agua > 0 && agua < productos.length * 0.2, `"agua" no arrastra el catálogo`, `${agua}/${productos.length}`);

ok(puntuar("de", productos[0].tokens) === 0, "una consulta de sólo palabras vacías no puntúa");

// ── 4. Rendimiento ─────────────────────────────────────────────────────────
console.log("\nRendimiento");
const CONSULTAS_PERF = ["glicerna", "acido estearico", "goma xantan", "niasinamida", "aseite de coco"];
for (let i = 0; i < 20; i++) for (const q of CONSULTAS_PERF) buscar(q, 227); // calienta el JIT

let peor = 0;
for (const q of CONSULTAS_PERF) {
  const t0 = performance.now();
  buscar(q, 227);
  peor = Math.max(peor, performance.now() - t0);
}
ok(peor < 30, `filtrar ${productos.length} productos toma < 30 ms`, `peor caso ${peor.toFixed(3)} ms`);

console.log(fallos ? `\n❌ ${fallos} prueba(s) fallida(s).\n` : "\n✅ Todas las pruebas pasan.\n");
process.exit(fallos ? 1 : 0);
