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
import { LINEAS, ESPECIALIDADES, SECTORES, type Linea } from "../data/taxonomy";
import { SECTORES_COPY, type SectorCopy } from "../data/sectores";

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
interface TaxOverlay {
  lineas?: Record<string, { nombre?: string; corto?: string; tagline?: string }>;
  especialidades?: Record<string, string>;
  sectores?: Record<string, string>;
  origenes?: Record<string, string>;
}

const taxModulos = import.meta.glob<TaxOverlay>("../data/i18n/taxonomy/*.json", {
  eager: true,
  import: "default",
});

export interface Taxonomia {
  lineas: Linea[];
  linea: (slug: string) => Linea | undefined;
  especialidad: (slug: string) => string;
  sector: (slug: string) => string;
  origen: (valor: string) => string;
  especialidades: Record<string, string>;
  sectores: Record<string, string>;
}

const taxCache = new Map<Locale, Taxonomia>();

export function taxonomia(lang: Locale): Taxonomia {
  const enCache = taxCache.get(lang);
  if (enCache) return enCache;

  const ov = lang === DEFAULT_LOCALE ? {} : (taxModulos[`../data/i18n/taxonomy/${lang}.json`] ?? {});

  const lineas: Linea[] = LINEAS.map((l) => ({
    ...l,
    nombre: ov.lineas?.[l.slug]?.nombre ?? l.nombre,
    corto: ov.lineas?.[l.slug]?.corto ?? l.corto,
    tagline: ov.lineas?.[l.slug]?.tagline ?? l.tagline,
  }));

  const especialidades: Record<string, string> = { ...ESPECIALIDADES };
  for (const [k, v] of Object.entries(ov.especialidades ?? {})) if (v) especialidades[k] = v;

  const sectores: Record<string, string> = { ...SECTORES };
  for (const [k, v] of Object.entries(ov.sectores ?? {})) if (v) sectores[k] = v;

  const tax: Taxonomia = {
    lineas,
    linea: (slug) => lineas.find((l) => l.slug === slug),
    especialidad: (slug) => especialidades[slug] ?? slug,
    sector: (slug) => sectores[slug] ?? slug,
    origen: (valor) => ov.origenes?.[valor] ?? valor,
    especialidades,
    sectores,
  };
  taxCache.set(lang, tax);
  return tax;
}

// ── Copy de sectores localizado ───────────────────────────────────
interface SectorOverlay {
  titulo?: string;
  intro?: string[];
  retos?: { titulo: string; texto: string }[];
  regulatorio?: string | null;
  mensajeWhatsApp?: string;
}

const secModulos = import.meta.glob<Record<string, SectorOverlay>>("../data/i18n/sectores/*.json", {
  eager: true,
  import: "default",
});

const secCache = new Map<Locale, SectorCopy[]>();

export function sectoresCopy(lang: Locale): SectorCopy[] {
  const enCache = secCache.get(lang);
  if (enCache) return enCache;

  let copia = SECTORES_COPY;
  if (lang !== DEFAULT_LOCALE) {
    const ov = secModulos[`../data/i18n/sectores/${lang}.json`] ?? {};
    copia = SECTORES_COPY.map((s) => {
      const o = ov[s.slug];
      if (!o) return s;
      return {
        ...s,
        titulo: o.titulo ?? s.titulo,
        intro: o.intro?.length === 2 ? o.intro : s.intro,
        retos: o.retos?.length === 3 ? o.retos : s.retos,
        regulatorio: o.regulatorio !== undefined ? o.regulatorio : s.regulatorio,
        mensajeWhatsApp: o.mensajeWhatsApp ?? s.mensajeWhatsApp,
      };
    });
  }
  secCache.set(lang, copia);
  return copia;
}
