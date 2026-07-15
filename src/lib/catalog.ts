/**
 * 📦 CARGADOR DEL CATÁLOGO (multi-idioma)
 * ---------------------------------------
 * El maestro en español vive en src/data/products/*.json — se administra como
 * siempre (ver CATALOGO.md). Las traducciones son overlays por idioma en
 * src/data/i18n/products/<lang>/<linea>.json con SOLO los campos de texto;
 * si a un producto le falta traducción, cae al español en vez de romper.
 *
 * Uso: const c = getCatalogo(lang); c.productos, c.porLinea("aseo"), …
 */

import type { Locale } from "../i18n/config";
import { DEFAULT_LOCALE } from "../i18n/config";
import { ESPECIALIDADES, LINEAS, SECTORES } from "../data/taxonomy";

export interface Producto {
  id: string;
  nombre: string;
  inci: string | null;
  sinonimos: string[];
  linea: string;
  lineas_secundarias: string[];
  especialidades: string[];
  sectores: string[];
  descripcion: string;
  funciones: string[];
  aplicaciones: string[];
  formas_referenciales: string[];
  origen: string;
  destacado: boolean;
}

/** Campos que traducen los overlays. */
interface ProductoOverlay {
  id: string;
  nombre?: string;
  sinonimos?: string[];
  descripcion?: string;
  funciones?: string[];
  aplicaciones?: string[];
  formas_referenciales?: string[];
}

const modules = import.meta.glob<Producto[]>("../data/products/*.json", {
  eager: true,
  import: "default",
});

const overlays = import.meta.glob<ProductoOverlay[]>("../data/i18n/products/*/*.json", {
  eager: true,
  import: "default",
});

/** Muestra el origen con tildes aunque el JSON venga sin ellas. */
const ORIGEN_LABEL: Record<string, string> = {
  Sintetico: "Sintético",
  Biotecnologico: "Biotecnológico",
};

function normalizarProducto(p: Producto): Producto {
  return {
    ...p,
    sinonimos: p.sinonimos ?? [],
    lineas_secundarias: p.lineas_secundarias ?? [],
    origen: ORIGEN_LABEL[p.origen] ?? p.origen,
    destacado: p.destacado ?? false,
  };
}

/** Maestro en español (fuente de verdad). */
const MAESTRO: Producto[] = Object.values(modules)
  .flat()
  .map(normalizarProducto)
  .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

// ── Catálogo por idioma ───────────────────────────────────────────

export interface Catalogo {
  lang: Locale;
  productos: Producto[];
  porId: (id: string) => Producto | undefined;
  porLinea: (slug: string) => Producto[];
  porSector: (slug: string) => Producto[];
  destacados: (max?: number) => Producto[];
  relacionados: (p: Producto, max?: number) => Producto[];
}

const cache = new Map<Locale, Catalogo>();

export function getCatalogo(lang: Locale = DEFAULT_LOCALE): Catalogo {
  const enCache = cache.get(lang);
  if (enCache) return enCache;

  let productos = MAESTRO;

  if (lang !== DEFAULT_LOCALE) {
    // Overlay id → traducción, juntando los 8 archivos del idioma
    const trad = new Map<string, ProductoOverlay>();
    for (const [ruta, lista] of Object.entries(overlays)) {
      if (!ruta.includes(`/products/${lang}/`)) continue;
      for (const o of lista) trad.set(o.id, o);
    }
    productos = MAESTRO.map((p) => {
      const o = trad.get(p.id);
      if (!o) return p;
      return {
        ...p,
        nombre: o.nombre ?? p.nombre,
        sinonimos: o.sinonimos ?? p.sinonimos,
        descripcion: o.descripcion ?? p.descripcion,
        funciones: o.funciones?.length ? o.funciones : p.funciones,
        aplicaciones: o.aplicaciones?.length ? o.aplicaciones : p.aplicaciones,
        formas_referenciales: o.formas_referenciales?.length
          ? o.formas_referenciales
          : p.formas_referenciales,
      };
    }).sort((a, b) => a.nombre.localeCompare(b.nombre, lang));
  }

  const porIdMapa = new Map(productos.map((p) => [p.id, p]));

  const catalogo: Catalogo = {
    lang,
    productos,
    porId: (id) => porIdMapa.get(id),
    porLinea: (slug) => productos.filter((p) => lineasDe(p).includes(slug)),
    porSector: (slug) => productos.filter((p) => p.sectores.includes(slug)),
    destacados: (max = 8) => productos.filter((p) => p.destacado).slice(0, max),
    relacionados: (p, max = 4) => {
      const score = (o: Producto): number => {
        let s = 0;
        if (o.linea === p.linea) s += 2;
        if (o.especialidades.some((e) => p.especialidades.includes(e))) s += 3;
        if (o.sectores.some((e) => p.sectores.includes(e))) s += 1;
        return s;
      };
      return productos
        .filter((o) => o.id !== p.id)
        .map((o) => ({ o, s: score(o) }))
        .filter((x) => x.s > 0)
        .sort((a, b) => b.s - a.s)
        .slice(0, max)
        .map((x) => x.o);
    },
  };
  cache.set(lang, catalogo);
  return catalogo;
}

// ── Utilidades independientes del idioma ──────────────────────────

export function lineasDe(p: Producto): string[] {
  return [p.linea, ...p.lineas_secundarias];
}

export const STATS = {
  productos: MAESTRO.length,
  lineas: LINEAS.length,
  especialidades: Object.keys(ESPECIALIDADES).length,
  sectores: Object.keys(SECTORES).length,
};

// ── Compatibilidad (código existente en español) ──────────────────

export const PRODUCTOS: Producto[] = MAESTRO;

export function getProducto(id: string): Producto | undefined {
  return MAESTRO.find((p) => p.id === id);
}

export function porLinea(slug: string): Producto[] {
  return getCatalogo(DEFAULT_LOCALE).porLinea(slug);
}

export function porSector(slug: string): Producto[] {
  return getCatalogo(DEFAULT_LOCALE).porSector(slug);
}

export function destacados(max = 8): Producto[] {
  return getCatalogo(DEFAULT_LOCALE).destacados(max);
}

export function relacionados(p: Producto, max = 4): Producto[] {
  return getCatalogo(DEFAULT_LOCALE).relacionados(p, max);
}

export function labelEspecialidad(slug: string): string {
  return ESPECIALIDADES[slug] ?? slug;
}

export function labelSector(slug: string): string {
  return SECTORES[slug] ?? slug;
}
