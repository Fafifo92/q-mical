/**
 * 🌐 CONFIGURACIÓN DE IDIOMAS
 * ---------------------------
 * Español es el idioma principal y vive en la raíz (/productos). Los demás
 * llevan prefijo (/en/productos, /zh/productos…). Las URLs internas (slugs de
 * productos y sectores) NO se traducen: solo cambia el contenido.
 *
 * Para añadir un idioma: agrégalo aquí y crea sus archivos de traducción
 * (src/i18n/ui/<code>.json, src/data/i18n/...). `npm run validar:i18n` avisa
 * si falta algo.
 */

export const LOCALES = ["es", "en", "fr", "pt", "de", "ru", "zh"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "es";

/** Idiomas con prefijo de URL (todos menos el principal). */
export const LOCALES_PREFIJADOS = LOCALES.filter((l) => l !== DEFAULT_LOCALE);

export const LOCALE_INFO: Record<
  Locale,
  { nombre: string; bandera: string; og: string; html: string }
> = {
  es: { nombre: "Español", bandera: "🇨🇴", og: "es_CO", html: "es" },
  en: { nombre: "English", bandera: "🇺🇸", og: "en_US", html: "en" },
  fr: { nombre: "Français", bandera: "🇫🇷", og: "fr_FR", html: "fr" },
  pt: { nombre: "Português", bandera: "🇧🇷", og: "pt_BR", html: "pt-BR" },
  de: { nombre: "Deutsch", bandera: "🇩🇪", og: "de_DE", html: "de" },
  ru: { nombre: "Русский", bandera: "🇷🇺", og: "ru_RU", html: "ru" },
  zh: { nombre: "中文", bandera: "🇨🇳", og: "zh_CN", html: "zh-CN" },
};

/**
 * Construye la URL local de una ruta para un idioma.
 * rutaLocal("en", "/productos") → "/en/productos" · rutaLocal("es", "/") → "/"
 */
export function rutaLocal(lang: Locale, path: string): string {
  const limpia = path.startsWith("/") ? path : `/${path}`;
  if (lang === DEFAULT_LOCALE) return limpia;
  return limpia === "/" ? `/${lang}/` : `/${lang}${limpia}`;
}

/** Separa el prefijo de idioma de un pathname. "/en/productos" → {lang:"en", path:"/productos"} */
export function separarIdioma(pathname: string): { lang: Locale; path: string } {
  const seg = pathname.split("/").filter(Boolean);
  const posible = seg[0] as Locale;
  if (LOCALES_PREFIJADOS.includes(posible)) {
    const resto = "/" + seg.slice(1).join("/");
    return { lang: posible, path: resto === "//" ? "/" : resto || "/" };
  }
  return { lang: DEFAULT_LOCALE, path: pathname || "/" };
}

/** Rellena plantillas: tpl("Ver {n} productos", {n: 5}) */
export function tpl(texto: string, vars: Record<string, string | number>): string {
  return texto.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}

/**
 * Nombre de categoría dentro de una frase ("…su línea de emolientes").
 * En alemán los sustantivos siempre van con mayúscula: no se tocan.
 */
export function nombreEnFrase(nombre: string, lang: Locale): string {
  return lang === "de" ? nombre : nombre.toLocaleLowerCase(LOCALE_INFO[lang].html);
}
