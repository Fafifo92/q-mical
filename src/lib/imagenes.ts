/**
 * 🖼️ FOTOS OPCIONALES
 * -------------------
 * Las fotos de industrias y del carrusel de noticias viven en public/img/.
 * Si un archivo no existe, la página usa un arte de marca en su lugar (nunca
 * una imagen rota), así que se pueden subir poco a poco.
 *
 *   public/img/industrias/<slug>.jpg   → tarjetas de industria (ej. cosmetica.jpg)
 *   public/img/noticias/<archivo>.jpg  → la ruta que indique cada noticia en src/i18n/ui/*.json
 */
import { existsSync } from "node:fs";
import { join } from "node:path";

/** Devuelve la ruta si el archivo existe en public/, o null si no. */
export function fotoPublica(ruta: string | undefined | null): string | null {
  if (!ruta) return null;
  return existsSync(join(process.cwd(), "public", ruta)) ? ruta : null;
}

export const fotoIndustria = (slug: string) => fotoPublica(`/img/industrias/${slug}.jpg`);
