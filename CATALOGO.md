# 📦 Cómo administrar el portafolio

Todo el portafolio vive en **`src/data/products/`** — archivos JSON agrupados
por la **industria principal** de cada producto. El sitio los lee
automáticamente: **no hay que tocar ninguna otra parte del código** para
agregar, editar o quitar productos.

```
src/data/products/
├── cosmetica.json
├── alimentos.json
├── agro.json
├── veterinaria.json
├── extractos.json
├── industrial.json
└── aseo.json
```

> El nombre del archivo es solo para ordenar: puedes crear otros (por ejemplo
> `nutraceutica.json`) y el sitio los leerá igual.

## 🗂️ Las dos clasificaciones

Cada producto se clasifica por **línea de producto** (qué función cumple en la
fórmula) y por **industria** (dónde se usa). Los slugs válidos están en
`src/data/taxonomy.ts`:

| Líneas de producto (`lineas`) | Industrias (`industrias`) |
|---|---|
| `ingrediente-activo` · Ingrediente activo | `cosmetica` · Cosmética |
| `tensioactivo` · Tensioactivo | `nutraceutica` · Nutracéutica |
| `modificador-reologico` · Modificador reológico | `alimentos` · Alimentos |
| `emoliente` · Emoliente | `agro` · Agro |
| `hidratante` · Hidratante | `veterinaria` · Veterinaria |
| `agente-preservante` · Agente preservante | `extractos` · Extractos |
| `base-formulacion` · Base lista para formulación | `industrial` · Industrial |
| `colorante` · Colorante | `aseo` · Aseo |
| `fragancia` · Fragancia | |
| `saborizante` · Saborizante | |
| `extractos` · Extractos | |
| `aceites` · Aceites | |

Una línea sin productos publicados (hoy: *Bases listas para formulación*) se
muestra igual en el sitio con el botón «Consultar disponibilidad», que abre
WhatsApp.

> ℹ️ La clasificación actual de los 227 productos se derivó de la información
> técnica que ya tenía el catálogo. Cuando llegue la matriz oficial de
> productos, basta con actualizar `lineas` e `industrias` de cada uno.

## ➕ Agregar un producto

1. Abre el JSON de su industria principal.
2. Copia un producto existente y edítalo (respeta las comas del arreglo).
3. Corre `npm run validar` — te dice en español si algo quedó mal.
4. `npm run build` (o el deploy) y listo.

### Anatomía de un producto

```json
{
  "id": "acido-estearico",
  "nombre": "Ácido Esteárico",
  "inci": "Stearic Acid",
  "sinonimos": ["Estearina"],
  "lineas": ["tensioactivo", "modificador-reologico"],
  "industrias": ["cosmetica", "aseo"],
  "descripcion": "Ácido graso de origen vegetal utilizado como factor de consistencia...",
  "funciones": ["Emulsificante", "Factor de consistencia"],
  "aplicaciones": ["Cremas y lociones", "Barras de jabón"],
  "formas_referenciales": ["Sólido — escamas, perlas o polvo según fabricante y lote"],
  "origen": "Vegetal",
  "destacado": false
}
```

| Campo | Qué es | Reglas |
|---|---|---|
| `id` | Identificador único (es la URL: `/productos/<id>`) | kebab-case, sin tildes, único en TODO el portafolio |
| `nombre` | Nombre comercial genérico | ⚠️ Sin marcas registradas |
| `inci` | Nomenclatura INCI (cosmética) | `null` si no aplica |
| `sinonimos` | Otros nombres con los que lo buscan | Lista, puede ser `[]` |
| `lineas` | Líneas de producto | 1–3 slugs; **la primera es la principal** (define ícono, migas e imagen al compartir) |
| `industrias` | Industrias donde se usa | 1–5 slugs; la primera es la principal |
| `descripcion` | 2–3 frases | ⚠️ Ver «redacción segura» abajo |
| `funciones` | Etiquetas cortas de función | Lista |
| `aplicaciones` | Usos típicos | Lista |
| `formas_referenciales` | Forma física **referencial** | ⚠️ Siempre con «según fabricante y lote» si puede variar |
| `origen` | Vegetal · Sintético · Mineral · Biotecnológico · Animal · Mixto | — |
| `destacado` | `true` lo muestra en la portada | Máximo 3–4 por industria |

## ✍️ Redacción segura (¡importante!)

Este negocio recibe reclamos cuando la web promete una cosa y el lote llega
distinto. Reglas de oro:

- **Nunca** prometas forma física exacta («cristales», «malla 80»). Escribe:
  *«Sólido — escamas o perlas según fabricante y lote»*.
- **Nunca** menciones purezas ni concentraciones («99 %», «70 % activo»).
  Eso se confirma con la ficha técnica del lote.
- **Nada** de claims médicos/terapéuticos («cura», «trata», «elimina el acné»).
  Usa «utilizado en formulaciones para…», «asociado a…».
- **Sin** certificaciones que no puedas respaldar con documento.

`npm run validar` avisa si una descripción menciona porcentajes.

## ➖ Quitar un producto

Borra su objeto `{ ... }` del JSON (cuida las comas) y corre `npm run validar`.

## ⭐ Cambiar los destacados de la portada

Pon `"destacado": true/false`. La portada muestra los primeros 8 en orden alfabético.

## 🗂️ Agregar una línea de producto o una industria nueva

1. Agrega la entrada en `LINEAS` o `INDUSTRIAS` de `src/data/taxonomy.ts`
   (slug, nombre, corto, tagline e ícono de `src/components/Icon.astro`).
2. Tradúcela en `src/data/i18n/taxonomy/<lang>.json` (ver TRADUCCIONES.md).
3. `npm run validar` y `npm run validar:i18n` leen la taxonomía solos: no hay
   listas que actualizar en los scripts. Si es una línea, corre `npm run og`
   para crear su imagen de vista previa.

## ⚙️ Datos de contacto, WhatsApp y PSE

Todo está en **`src/data/site.ts`**: número de WhatsApp, correo, link de pagos
PSE, dirección y redes. Busca los comentarios `// EDITAR`.
