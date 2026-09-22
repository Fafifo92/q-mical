export const SITE = {
  nombre: "Origen Chemical",
  razonSocial: "Origen Chemical S.A.S.",
  dominio: "https://o-chemical.netlify.app",

  ogVersion: 4,

  whatsapp: "573153832707",

  email: "adminiistracion@origenchemical.com",
  telefono: "(+57) 315 383 2703",

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

export const mapaLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapaConsulta)}`;

export const mapaEmbed = `https://www.google.com/maps?q=${encodeURIComponent(SITE.mapaConsulta)}&output=embed`;