/**
 * 🗂️ TAXONOMÍA DEL PORTAFOLIO
 * ---------------------------
 * Toda materia prima se clasifica por DOS ejes (definidos por Origen Chemical):
 *
 *   1. LÍNEA DE PRODUCTO → qué función cumple en la fórmula (12 líneas).
 *   2. INDUSTRIA         → en qué sectores se usa (8 industrias).
 *
 * Los productos (src/data/products/*.json) referencian estos slugs en sus
 * campos `lineas` e `industrias` (el primero de cada lista es el principal).
 *
 * Para agregar una línea o industria nueva: añade la entrada aquí y ya puede
 * usarse en los JSON del catálogo. `npm run validar` avisa si un producto usa
 * un slug que no existe.
 */

export interface Linea {
  slug: string;
  /** Plural, para títulos de categoría: "Emolientes". */
  nombre: string;
  /** Singular, para la etiqueta de un producto: "Emoliente". */
  corto: string;
  tagline: string;
  icono: string; // nombre del ícono en Icon.astro
}

export interface Industria {
  slug: string;
  nombre: string;
  corto: string;
  tagline: string;
  icono: string;
}

/** Las 12 líneas de producto, en el orden del portafolio. */
export const LINEAS: Linea[] = [
  {
    slug: "ingrediente-activo",
    nombre: "Ingredientes activos",
    corto: "Ingrediente activo",
    tagline: "Vitaminas, aminoácidos, filtros UV y activos funcionales que aportan el beneficio de la fórmula.",
    icono: "linea-activo",
  },
  {
    slug: "tensioactivo",
    nombre: "Tensioactivos",
    corto: "Tensioactivo",
    tagline: "Limpiadores, emulsificantes, espumantes y dispersantes para cosmética, aseo, agro e industria.",
    icono: "linea-tensioactivo",
  },
  {
    slug: "modificador-reologico",
    nombre: "Modificadores reológicos",
    corto: "Modificador reológico",
    tagline: "Espesantes, gomas, hidrocoloides y polímeros que dan cuerpo, textura y estabilidad.",
    icono: "linea-reologico",
  },
  {
    slug: "emoliente",
    nombre: "Emolientes",
    corto: "Emoliente",
    tagline: "Ésteres, mantecas, ceras y alternativas a siliconas que suavizan y dan tacto.",
    icono: "linea-emoliente",
  },
  {
    slug: "hidratante",
    nombre: "Hidratantes",
    corto: "Hidratante",
    tagline: "Humectantes que atraen y retienen agua en la piel, el cabello y la fórmula.",
    icono: "linea-hidratante",
  },
  {
    slug: "agente-preservante",
    nombre: "Agentes preservantes",
    corto: "Agente preservante",
    tagline: "Conservantes, antioxidantes y quelantes que protegen la fórmula durante su vida útil.",
    icono: "linea-preservante",
  },
  {
    slug: "base-formulacion",
    nombre: "Bases listas para formulación",
    corto: "Base lista para formulación",
    tagline: "Bases y premezclas que simplifican el desarrollo y aceleran la producción.",
    icono: "linea-base",
  },
  {
    slug: "colorante",
    nombre: "Colorantes",
    corto: "Colorante",
    tagline: "Pigmentos, óxidos, micas y nacarantes para dar color y efecto.",
    icono: "linea-colorante",
  },
  {
    slug: "fragancia",
    nombre: "Fragancias",
    corto: "Fragancia",
    tagline: "Aceites esenciales y materias aromáticas para cosmética, aseo y hogar.",
    icono: "linea-fragancia",
  },
  {
    slug: "saborizante",
    nombre: "Saborizantes",
    corto: "Saborizante",
    tagline: "Sabores, edulcorantes y acidulantes para alimentos, bebidas y suplementos.",
    icono: "linea-saborizante",
  },
  {
    slug: "extractos",
    nombre: "Extractos",
    corto: "Extracto",
    tagline: "Extractos glicólicos, hidrolatos y concentrados botánicos, con origen LATAM.",
    icono: "linea-extracto",
  },
  {
    slug: "aceites",
    nombre: "Aceites",
    corto: "Aceite",
    tagline: "Aceites vegetales y esenciales para cosmética, alimentos y nutracéutica.",
    icono: "linea-aceite",
  },
];

/**
 * Las 8 industrias atendidas, en el orden del portafolio. Cada una puede
 * llevar una foto en public/img/industrias/<slug>.jpg (ver README).
 */
export const INDUSTRIAS: Industria[] = [
  {
    slug: "cosmetica",
    nombre: "Cosmética & Cuidado Personal",
    corto: "Cosmética",
    tagline: "Activos, emolientes, tensioactivos, colorantes y conservantes para skincare, capilar y maquillaje.",
    icono: "industria-cosmetica",
  },
  {
    slug: "nutraceutica",
    nombre: "Nutracéutica & Suplementos",
    corto: "Nutracéutica",
    tagline: "Vitaminas, aminoácidos, proteínas y extractos para suplementos alimenticios.",
    icono: "industria-nutraceutica",
  },
  {
    slug: "alimentos",
    nombre: "Alimentos & Bebidas",
    corto: "Alimentos",
    tagline: "Hidrocoloides, acidulantes, conservantes y edulcorantes de uso alimentario.",
    icono: "industria-alimentos",
  },
  {
    slug: "agro",
    nombre: "Agro & Nutrición Vegetal",
    corto: "Agro",
    tagline: "Fertilizantes solubles, quelatos, bioestimulantes y coadyuvantes.",
    icono: "industria-agro",
  },
  {
    slug: "veterinaria",
    nombre: "Veterinaria & Nutrición Animal",
    corto: "Veterinaria",
    tagline: "Vitaminas, minerales traza, aminoácidos y aditivos para premezclas.",
    icono: "industria-veterinaria",
  },
  {
    slug: "extractos",
    nombre: "Extractos & Naturales",
    corto: "Extractos",
    tagline: "Extractos botánicos, aceites vegetales, mantecas y esenciales — con origen LATAM.",
    icono: "industria-extractos",
  },
  {
    slug: "industrial",
    nombre: "Industrial & Procesos",
    corto: "Industrial",
    tagline: "Tratamiento de aguas, pinturas, solventes y auxiliares de proceso.",
    icono: "industria-industrial",
  },
  {
    slug: "aseo",
    nombre: "Aseo & Desinfección",
    corto: "Aseo",
    tagline: "Tensioactivos, biocidas, álcalis y enzimas para hogar e institucional.",
    icono: "industria-aseo",
  },
];

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

export function getIndustria(slug: string): Industria | undefined {
  return INDUSTRIAS.find((i) => i.slug === slug);
}
