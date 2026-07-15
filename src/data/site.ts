/**
 * ⚙️ CONFIGURACIÓN GENERAL DEL SITIO
 * ----------------------------------
 * Todo lo que un administrador querría cambiar sin tocar código está aquí:
 * teléfono de WhatsApp, correo, link de pagos PSE, dirección, redes.
 *
 * 👉 Los valores marcados con "EDITAR" son de ejemplo: reemplázalos por los reales.
 */

export const SITE = {
  nombre: "Q'mical",
  // Debe ser el dominio REAL: WhatsApp exige URL absoluta en la vista previa.
  dominio: "https://quiet-travesseiro-9a9569.netlify.app", // EDITAR
  slogan: "Materias primas con criterio técnico",

  /**
   * Sube este número al cambiar el diseño de las imágenes OG (`npm run og`).
   * WhatsApp cachea la vista previa por URL: sin cambiar la URL seguiría
   * mostrando la imagen antigua.
   */
  ogVersion: 1,
  descripcion:
    "Q'mical distribuye materias primas para cosmética, aseo, alimentos, agro, veterinaria e industria en Colombia, con documentación técnica por lote y acompañamiento en formulación.",

  // ── Canal comercial ─────────────────────────────────────────────
  // Número de WhatsApp en formato internacional SIN el signo +
  whatsapp: "573023060033", // EDITAR
  whatsappMensajeBase:
    "Hola, Q'mical 👋 Quiero información sobre sus materias primas.",

  email: "comercial@qmical.co", // EDITAR
  telefono: "(+57) 601 000 0000", // EDITAR

  // ── Pagos ───────────────────────────────────────────────────────
  // Link de pagos PSE (Wompi, PayU, Epayco, etc.). Se muestra en /pagos.
  pseUrl: "https://checkout.wompi.co/l/EDITAR", // EDITAR

  // ── Ubicación ───────────────────────────────────────────────────
  ciudad: "Bogotá D.C. — Colombia",
  direccion: "Zona industrial de Funza, Cundinamarca", // EDITAR

  // ── Redes (deja "" para ocultar el ícono) ───────────────────────
  redes: {
    instagram: "https://instagram.com/qmical", // EDITAR
    linkedin: "https://linkedin.com/company/qmical", // EDITAR
    facebook: "", // EDITAR (opcional)
    youtube: "", // EDITAR (opcional)
  },
} as const;

/** Construye un link de WhatsApp con mensaje pre-cargado. */
export function waLink(mensaje: string = SITE.whatsappMensajeBase): string {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}
