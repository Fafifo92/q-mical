/**
 * 🗂️ TAXONOMÍA DEL CATÁLOGO
 * -------------------------
 * Fuente única de verdad para líneas de producto, especialidades y sectores.
 * Los productos (src/data/products/*.json) referencian estos slugs.
 *
 * Para agregar una línea/especialidad/sector nuevo: añade la entrada aquí
 * y ya puede usarse en los JSON del catálogo. `npm run validar` avisa si un
 * producto usa un slug que no existe.
 */

export interface Linea {
  slug: string;
  nombre: string;
  corto: string;
  tagline: string;
  color: string; // color de acento de la línea (hex)
  icono: string; // nombre del ícono en Icon.astro
}

export const LINEAS: Linea[] = [
  {
    slug: "cosmetica",
    nombre: "Cosmética & Cuidado Personal",
    corto: "Cosmética",
    tagline: "Activos, emulsificantes, humectantes y sistemas conservantes para skincare y capilar.",
    color: "#E4517E",
    icono: "linea-cosmetica",
  },
  {
    slug: "maquillaje",
    nombre: "Maquillaje & Color",
    corto: "Maquillaje",
    tagline: "Pigmentos, micas, cargas texturizantes y ceras para cosmética de color.",
    color: "#8B5CF6",
    icono: "linea-maquillaje",
  },
  {
    slug: "aseo",
    nombre: "Aseo & Desinfección",
    corto: "Aseo",
    tagline: "Tensoactivos, biocidas, álcalis y enzimas para hogar e institucional.",
    color: "#0E9BD8",
    icono: "linea-aseo",
  },
  {
    slug: "alimentos",
    nombre: "Alimentos & Bebidas",
    corto: "Alimentos",
    tagline: "Hidrocoloides, acidulantes, conservantes y edulcorantes de uso alimentario.",
    color: "#EA580C",
    icono: "linea-alimentos",
  },
  {
    slug: "agro",
    nombre: "Agro & Nutrición Vegetal",
    corto: "Agro",
    tagline: "Fertilizantes solubles, quelatos, bioestimulantes y coadyuvantes.",
    color: "#65A30D",
    icono: "linea-agro",
  },
  {
    slug: "veterinaria",
    nombre: "Veterinaria & Nutrición Animal",
    corto: "Veterinaria",
    tagline: "Vitaminas, minerales traza, aminoácidos y aditivos para premezclas.",
    color: "#D9A50A",
    icono: "linea-veterinaria",
  },
  {
    slug: "extractos",
    nombre: "Extractos & Naturales",
    corto: "Extractos",
    tagline: "Extractos botánicos, aceites vegetales, mantecas y esenciales — con origen LATAM.",
    color: "#10B981",
    icono: "linea-extractos",
  },
  {
    slug: "industrial",
    nombre: "Industrial & Procesos",
    corto: "Industrial",
    tagline: "Tratamiento de aguas, pinturas, solventes y auxiliares de proceso.",
    color: "#64748B",
    icono: "linea-industrial",
  },
];

export const ESPECIALIDADES: Record<string, string> = {
  activos: "Activos funcionales",
  "aceites-vegetales": "Aceites vegetales",
  "mantecas-ceras": "Mantecas & ceras",
  emolientes: "Emolientes",
  emulsificantes: "Emulsificantes",
  tensoactivos: "Tensoactivos",
  humectantes: "Humectantes",
  "espesantes-reologia": "Espesantes & reología",
  conservantes: "Conservantes",
  antioxidantes: "Antioxidantes",
  "filtros-uv": "Filtros UV",
  "pigmentos-colorantes": "Pigmentos & colorantes",
  "nacarantes-efectos": "Nacarantes & efectos",
  acondicionadores: "Acondicionadores",
  "proteinas-aminoacidos": "Proteínas & aminoácidos",
  vitaminas: "Vitaminas",
  exfoliantes: "Exfoliantes",
  "siliconas-alternativas": "Siliconas & alternativas",
  polimeros: "Polímeros funcionales",
  quelantes: "Quelantes",
  solventes: "Solventes & vehículos",
  "acidulantes-ph": "Acidulantes & pH",
  edulcorantes: "Edulcorantes",
  "gomas-hidrocoloides": "Gomas & hidrocoloides",
  enzimas: "Enzimas",
  "biocidas-desinfectantes": "Biocidas & desinfectantes",
  desengrasantes: "Desengrasantes",
  "dispersantes-antiespumantes": "Dispersantes & antiespumantes",
  "nutricion-vegetal": "Nutrición vegetal",
  "adyuvantes-agricolas": "Adyuvantes agrícolas",
  "premezclas-veterinarias": "Premezclas veterinarias",
  "extractos-botanicos": "Extractos botánicos",
};

export const SECTORES: Record<string, string> = {
  "cosmetica-personal": "Cosmética & cuidado personal",
  "maquillaje-color": "Maquillaje & color",
  "aseo-hogar": "Aseo del hogar",
  // El 84 % viene de la línea industrial, no solo de aseo: el nombre lo refleja
  "institucional-industrial": "Institucional & industrial",
  alimentos: "Alimentos",
  bebidas: "Bebidas",
  nutraceutico: "Nutracéutico",
  veterinaria: "Veterinaria & nutrición animal",
  agricola: "Agrícola",
  "pinturas-recubrimientos": "Pinturas & recubrimientos",
  textil: "Textil",
  "tratamiento-aguas": "Tratamiento de aguas",
};

/**
 * Metadatos visuales de cada sector (para las páginas de segmentos de mercado).
 * El copy de las landings vive en src/data/sectores.ts.
 */
export const SECTORES_INFO: Record<string, { color: string; icono: string }> = {
  "cosmetica-personal": { color: "#E4517E", icono: "linea-cosmetica" },
  "maquillaje-color": { color: "#8B5CF6", icono: "linea-maquillaje" },
  "aseo-hogar": { color: "#0E9BD8", icono: "linea-aseo" },
  "institucional-industrial": { color: "#475569", icono: "sector-institucional" },
  alimentos: { color: "#EA580C", icono: "linea-alimentos" },
  bebidas: { color: "#0D9488", icono: "sector-bebidas" },
  nutraceutico: { color: "#6366F1", icono: "sector-nutraceutico" },
  veterinaria: { color: "#D9A50A", icono: "linea-veterinaria" },
  agricola: { color: "#65A30D", icono: "linea-agro" },
  "pinturas-recubrimientos": { color: "#E11D48", icono: "sector-pinturas" },
  textil: { color: "#C026D3", icono: "sector-textil" },
  "tratamiento-aguas": { color: "#0284C7", icono: "sector-aguas" },
};

export const ORIGENES = [
  "Vegetal",
  "Sintético",
  "Mineral",
  "Biotecnológico",
  "Animal",
  "Mixto",
] as const;

export function getLinea(slug: string): Linea | undefined {
  return LINEAS.find((l) => l.slug === slug);
}
