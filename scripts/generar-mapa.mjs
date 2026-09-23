#!/usr/bin/env node
/**
 * 🗺️ GENERADOR DEL MAPA DE COLOMBIA — `npm run mapa`
 * -------------------------------------------------
 * Convierte los polígonos de departamentos del DANE (MGN 2018, en
 * scripts/datos/) en trazos SVG simplificados y escribe src/data/mapaColombia.ts.
 * Solo hay que correrlo si se cambia el archivo de datos: las ciudades se
 * editan en src/data/cobertura.ts sin regenerar nada.
 *
 * Se omite San Andrés y Providencia (700 km al noroeste): achicaría el mapa continental.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const g = JSON.parse(readFileSync(join(raiz, "scripts/datos/departamentos-colombia.geojson"), "utf8"));
const feats = g.features.filter((f) => f.properties.DPTO_CCDGO !== "88");

// Equirrectangular con corrección por la latitud media (Colombia está sobre el ecuador)
const K = Math.cos((6.5 * Math.PI) / 180);
const proy = ([lon, lat]) => [lon * K, -lat];
const anillos = (geom) => (geom.type === "Polygon" ? [geom.coordinates] : geom.coordinates).flat();
let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
for (const f of feats) for (const r of anillos(f.geometry)) for (const p of r) {
  const [x, y] = proy(p);
  minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
}
const ANCHO = 480, MARGEN = 14;
const escala = (ANCHO - MARGEN * 2) / (maxX - minX);
const ALTO = Math.round((maxY - minY) * escala + MARGEN * 2);
const px = (p) => { const [x, y] = proy(p); return [(x - minX) * escala + MARGEN, (y - minY) * escala + MARGEN]; };

// Douglas-Peucker: quita puntos redundantes sin cambiar la silueta
function simplificar(pts, tol) {
  if (pts.length < 4) return pts;
  const d2 = (p, a, b) => {
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const t = dx || dy ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy))) : 0;
    const x = a[0] + t * dx - p[0], y = a[1] + t * dy - p[1];
    return x * x + y * y;
  };
  const marca = new Array(pts.length).fill(false);
  marca[0] = marca[pts.length - 1] = true;
  const pila = [[0, pts.length - 1]];
  while (pila.length) {
    const [i, j] = pila.pop();
    let max = 0, k = -1;
    for (let n = i + 1; n < j; n++) { const d = d2(pts[n], pts[i], pts[j]); if (d > max) { max = d; k = n; } }
    if (max > tol * tol && k > -1) { marca[k] = true; pila.push([i, k], [k, j]); }
  }
  return pts.filter((_, n) => marca[n]);
}
const num = (n) => String(Math.round(n * 10) / 10);
const camino = (geom) =>
  (geom.type === "Polygon" ? [geom.coordinates] : geom.coordinates)
    .flatMap((poly) => poly.map((r) => simplificar(r.map(px), 0.35)))
    .map((r) => "M" + r.map(([x, y]) => `${num(x)} ${num(y)}`).join("L") + "Z")
    .join("");
const nombre = (s) => s.toLowerCase().replace(/(^|\s)\S/g, (m) => m.toUpperCase()).replace(/\bDe\b/g, "de").replace(/\bY\b/g, "y");
const deptos = feats.map((f) => ({ codigo: f.properties.DPTO_CCDGO, nombre: nombre(f.properties.DPTO_CNMBR), d: camino(f.geometry) }));

const salida = `/**
 * 🗺️ MAPA DE COLOMBIA — generado con \`npm run mapa\` (no editar a mano).
 * Departamentos del DANE (MGN 2018) simplificados y proyectados a un lienzo de
 * ${ANCHO}×${ALTO}. \`proy\` permite ubicar cualquier latitud/longitud sobre él
 * (ver src/data/cobertura.ts).
 */
export const MAPA = {
  ancho: ${ANCHO},
  alto: ${ALTO},
  proy: { k: ${K}, minX: ${minX}, minY: ${minY}, escala: ${escala}, margen: ${MARGEN} },
  deptos: ${JSON.stringify(deptos)},
} as const;
`;
writeFileSync(join(raiz, "src/data/mapaColombia.ts"), salida);
console.log(`Mapa generado: ${ANCHO}×${ALTO}, ${deptos.length} departamentos, ${(salida.length / 1024).toFixed(1)} KB`);
