# 📦 Cómo administrar el catálogo

Todo el catálogo vive en **`src/data/products/`** — un archivo JSON por línea de
producto. El sitio los lee automáticamente: **no hay que tocar ninguna otra parte
del código** para agregar, editar o quitar productos.

```
src/data/products/
├── cosmetica.json
├── maquillaje.json
├── aseo.json
├── alimentos.json
├── agro.json
├── veterinaria.json
├── extractos.json
└── industrial.json
```

## ➕ Agregar un producto

1. Abre el JSON de la línea correspondiente.
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
  "linea": "cosmetica",
  "lineas_secundarias": ["aseo"],
  "especialidades": ["emulsificantes"],
  "sectores": ["cosmetica-personal", "aseo-hogar"],
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
| `id` | Identificador único (es la URL: `/productos/<id>`) | kebab-case, sin tildes, único en TODO el catálogo |
| `nombre` | Nombre comercial genérico | ⚠️ Sin marcas registradas |
| `inci` | Nomenclatura INCI (cosmética) | `null` si no aplica |
| `sinonimos` | Otros nombres con los que lo buscan | Lista, puede ser `[]` |
| `linea` | Línea principal | Un slug de `src/data/taxonomy.ts` |
| `lineas_secundarias` | Otras líneas donde aplica | Lista, puede ser `[]` |
| `especialidades` | Función/familia (alimenta el filtro) | 1–3 slugs de la taxonomía |
| `sectores` | Industrias donde se usa (filtro) | 1–4 slugs de la taxonomía |
| `descripcion` | 2–3 frases | ⚠️ Ver «redacción segura» abajo |
| `funciones` | Etiquetas cortas de función | Lista |
| `aplicaciones` | Usos típicos | Lista |
| `formas_referenciales` | Forma física **referencial** | ⚠️ Siempre con «según fabricante y lote» si puede variar |
| `origen` | Vegetal · Sintético · Mineral · Biotecnológico · Animal · Mixto | — |
| `destacado` | `true` lo muestra en la portada | Máximo 3–4 por línea |

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

## 🗂️ Agregar una especialidad, sector o línea nueva

1. Agrega la entrada en `src/data/taxonomy.ts` (y su etiqueta legible).
2. Si es una **línea** nueva: crea también su `src/data/products/<slug>.json` y
   añade el slug a la lista `LINEAS` de `scripts/validar-catalogo.mjs`.
3. Para especialidades/sectores nuevos: añádelos también a las listas del validador.

## ⚙️ Datos de contacto, WhatsApp y PSE

Todo está en **`src/data/site.ts`**: número de WhatsApp, correo, link de pagos
PSE, dirección y redes. Busca los comentarios `// EDITAR`.
