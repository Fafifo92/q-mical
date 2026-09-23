export const SITE = {
  nombre: "Origen Chemical",
  razonSocial: "Origen Chemical S.A.S.",
  dominio: "https://o-chemical.netlify.app",

  ogVersion: 4,

  whatsapp: "573153832703",

  email: "administracion@origenchemical.com",
  telefono: "(+57) 315 383 2703",
  telefono2: "(+57)300 650 2451",

  // ── Pagos en línea ──────────────────────────────────────────────
  // La página /pagos está hecha pero OCULTA. Para mostrarla de nuevo basta con
  // poner `pagosActivo: true`: reaparecen el botón PSE flotante, el enlace del
  // menú y del pie, el aviso de pago en cada producto y la página misma.
  pagosActivo: false,
  pseUrl: "https://checkout.wompi.co/l/EDITAR", // EDITAR

  direccion: "Cra. 68I # 36-21 Sur",
  ciudad: "Bogotá D.C. — Colombia",
  mapaConsulta: "Carrera 68I # 36-21 Sur, Bogotá, Colombia",

  redes: {
    instagram: "",
    linkedin: "",
    facebook: "",
    youtube: "",
  },
} as const;

export function waLink(mensaje: string): string {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

/** Enlace tel: a partir de un número escrito de cualquier forma (agrega +57 si es un celular colombiano de 10 dígitos). */
export function telHref(numero: string): string {
  const d = numero.replace(/\D/g, "");
  return `tel:+${d.length === 10 ? "57" + d : d}`;
}

export const mapaLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapaConsulta)}`;

export const mapaEmbed = `https://www.google.com/maps?q=${encodeURIComponent(SITE.mapaConsulta)}&output=embed`;