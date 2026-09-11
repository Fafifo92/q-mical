/**
 * 🌐 CARGADORES DE TRADUCCIONES
 * -----------------------------
 * El español es la fuente de verdad (src/i18n/ui/es.json, src/data/*). Los
 * demás idiomas son "overlays": si a un idioma le falta algo, cae al español
 * en vez de romper la página. `npm run validar:i18n` avisa de faltantes.
 */

import type { Locale } from "./config";
import { DEFAULT_LOCALE } from "./config";
import esUI from "./ui/es.json";
import { LINEAS, INDUSTRIAS, type Linea, type Industria } from "../data/taxonomy";

export type UIDict = typeof esUI;

// ── Diccionarios de interfaz ──────────────────────────────────────
const uiModulos = import.meta.glob<UIDict>("./ui/*.json", { eager: true, import: "default" });

/** Mezcla profunda: lo que falte en el overlay cae al español. */
function mezclar<T>(base: T, overlay: unknown): T {
  if (overlay === undefined || overlay === null) return base;
  if (Array.isArray(base)) return (Array.isArray(overlay) && overlay.length ? overlay : base) as T;
  if (typeof base === "object" && base !== null && typeof overlay === "object") {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(base as object)) {
      out[k] = mezclar((base as Record<string, unknown>)[k], (overlay as Record<string, unknown>)[k]);
    }
    return out as T;
  }
  return (typeof overlay === typeof base ? overlay : base) as T;
}

const uiCache = new Map<Locale, UIDict>();

/** Diccionario de interfaz del idioma (con fallback al español). */
export function t(lang: Locale): UIDict {
  const enCache = uiCache.get(lang);
  if (enCache) return enCache;
  const dict =
    lang === DEFAULT_LOCALE
      ? esUI
      : mezclar(esUI, uiModulos[`./ui/${lang}.json`] as UIDict | undefined);
  uiCache.set(lang, dict);
  return dict;
}

// ── Taxonomía localizada ──────────────────────────────────────────
type EtiquetasOverlay = Record<string, { nombre?: string; corto?: string; tagline?: string }>;

interface TaxOverlay {
  lineas?: EtiquetasOverlay;
  industrias?: EtiquetasOverlay;
  origenes?: Record<string, string>;
}

const taxModulos = import.meta.glob<TaxOverlay>("../data/i18n/taxonomy/*.json", {
  eager: true,
  import: "default",
});

export interface Taxonomia {
  lineas: Linea[];
  industrias: Industria[];
  linea: (slug: string) => Linea | undefined;
  industria: (slug: string) => Industria | undefined;
  origen: (valor: string) => string;
}

const taxCache = new Map<Locale, Taxonomia>();

/** Aplica el overlay de un idioma a las etiquetas de una lista (fallback al español). */
function localizar<T extends { slug: string; nombre: string; corto: string; tagline: string }>(
  base: T[],
  ov: EtiquetasOverlay | undefined
): T[] {
  return base.map((x) => ({
    ...x,
    nombre: ov?.[x.slug]?.nombre ?? x.nombre,
    corto: ov?.[x.slug]?.corto ?? x.corto,
    tagline: ov?.[x.slug]?.tagline ?? x.tagline,
  }));
}

export function taxonomia(lang: Locale): Taxonomia {
  const enCache = taxCache.get(lang);
  if (enCache) return enCache;

  const ov: TaxOverlay =
    lang === DEFAULT_LOCALE ? {} : (taxModulos[`../data/i18n/taxonomy/${lang}.json`] ?? {});

  const lineas = localizar(LINEAS, ov.lineas);
  const industrias = localizar(INDUSTRIAS, ov.industrias);

  const tax: Taxonomia = {
    lineas,
    industrias,
    linea: (slug) => lineas.find((l) => l.slug === slug),
    industria: (slug) => industrias.find((i) => i.slug === slug),
    origen: (valor) => ov.origenes?.[valor] ?? valor,
  };
  taxCache.set(lang, tax);
  return tax;
}
