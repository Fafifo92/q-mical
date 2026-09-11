/**
 * ⚙️ CONFIGURACIÓN GENERAL DEL SITIO
 * ----------------------------------
 * Todo lo que un administrador querría cambiar sin tocar código está aquí:
 * teléfono de WhatsApp, correo, link de pagos PSE, dirección, redes.
 *
 * 👉 Los valores marcados con "EDITAR" son de ejemplo: reemplázalos por los reales.
 */

export const SITE = {
  nombre: "Origen Chemical",
  razonSocial: "Origen Chemical S.A.S.",
  // Debe ser el dominio REAL: WhatsApp exige URL absoluta en la vista previa.
  dominio: "https://quiet-travesseiro-9a9569.netlify.app", // EDITAR

  /**
   * Sube este número al cambiar el diseño de las imágenes OG (`npm run og`).
   * WhatsApp cachea la vista previa por URL: sin cambiar la URL seguiría
   * mostrando la imagen antigua.
   */
  ogVersion: 2,

  // ── Canal comercial ─────────────────────────────────────────────
  // Número de WhatsApp en formato internacional SIN el signo +
  whatsapp: "573023060033", // EDITAR

  email: "comercial@origenchemical.com", // EDITAR
  telefono: "(+57) 601 000 0000", // EDITAR

  // ── Pagos ───────────────────────────────────────────────────────
  // Link de pagos PSE (Wompi, PayU, Epayco, etc.). Se muestra en /pagos.
  pseUrl: "https://checkout.wompi.co/l/EDITAR", // EDITAR

  // ── Ubicación ───────────────────────────────────────────────────
  direccion: "Cra. 68I # 36-21 Sur",
  ciudad: "Bogotá D.C. — Colombia",
  // Lo que se busca en Google Maps (mapa de /contacto y botón "Cómo llegar")
  mapaConsulta: "Carrera 68I # 36-21 Sur, Bogotá, Colombia",

  // ── Redes (deja "" para ocultar el ícono) ───────────────────────
  redes: {
    instagram: "", // EDITAR: URL real de Instagram
    linkedin: "", // EDITAR: URL real de LinkedIn
    facebook: "", // EDITAR (opcional)
    youtube: "", // EDITAR (opcional)
  },
} as const;

/** Construye un link de WhatsApp con mensaje pre-cargado. */
export function waLink(mensaje: string): string {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

/** Link a Google Maps para abrir la ubicación (botón "Cómo llegar"). */
export const mapaLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapaConsulta)}`;

/** Mapa embebido de Google Maps (sin API key). */
export const mapaEmbed = `https://www.google.com/maps?q=${encodeURIComponent(SITE.mapaConsulta)}&output=embed`;
