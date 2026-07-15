# 🌐 Cómo administrar los idiomas

El sitio existe en **7 idiomas**: español (principal), inglés, francés, portugués
de Brasil, alemán, ruso y chino simplificado.

```
/                    ← español (idioma principal, sin prefijo)
/en/  /fr/  /pt/  /de/  /ru/  /zh/
```

**El español es la fuente de verdad.** Los demás idiomas son *overlays*: si a
un idioma le falta un texto, ese texto sale en español en vez de romperse.
Corre **`npm run validar:i18n`** para ver qué falta.

## 📁 Dónde vive cada cosa

| Qué | Archivo | Notas |
|---|---|---|
| Idiomas activos | `src/i18n/config.ts` | Añadir/quitar idiomas, banderas, nombres |
| **Textos de la web** | `src/i18n/ui/<lang>.json` | Menú, botones, títulos, párrafos… |
| **Catálogo (maestro)** | `src/data/products/*.json` | Español — ver [CATALOGO.md](./CATALOGO.md) |
| **Catálogo traducido** | `src/data/i18n/products/<lang>/*.json` | Solo campos de texto |
| Sectores (maestro) | `src/data/sectores.ts` | Copy de las 12 landings |
| Sectores traducidos | `src/data/i18n/sectores/<lang>.json` | |
| Taxonomía (maestro) | `src/data/taxonomy.ts` | Líneas, especialidades, sectores |
| Taxonomía traducida | `src/data/i18n/taxonomy/<lang>.json` | Solo las etiquetas |

## ✏️ Cambiar un texto de la web

1. Edítalo en **`src/i18n/ui/es.json`** (español).
2. Edita la misma clave en los otros 6 archivos de `src/i18n/ui/`.
3. `npm run validar:i18n` avisa si a algún idioma le falta la clave.

> **Marcadores:** textos como `"{n} productos"` o `"© {year} Q'mical"` llevan
> variables entre llaves. **Consérvalas** en todos los idiomas (pueden ir en otro
> orden, pero deben estar).
>
> **Claves que terminan en `Html`** llevan `<strong>` dentro: mantén las etiquetas.

## ➕ Traducir un producto nuevo

1. Agrégalo primero al maestro en español (`src/data/products/<linea>.json`).
2. En cada idioma, añade a `src/data/i18n/products/<lang>/<linea>.json`:

```json
{
  "id": "acido-estearico",
  "nombre": "Stearic Acid",
  "sinonimos": ["Octadecanoic acid"],
  "descripcion": "…",
  "funciones": ["…"],
  "aplicaciones": ["…"],
  "formas_referenciales": ["Solid — flakes, beads or powder depending on the manufacturer and batch"]
}
```

- El **`id` es la llave**: debe coincidir con el del maestro. No se traduce.
- Solo van los campos de **texto**. Línea, especialidades, sectores, INCI,
  origen y destacado se heredan del maestro (son datos, no idioma).
- Los arrays deben tener **la misma cantidad de elementos** que el español.
- Si no traduces un producto, ese producto sale en español. Nada se rompe.

## 🔤 Glosario (respétalo en todos los idiomas)

La frase que protege al negocio de reclamos debe traducirse **siempre igual**:

| es | «según fabricante y lote» |
|---|---|
| en | depending on the manufacturer and batch |
| fr | selon le fabricant et le lot |
| pt | conforme o fabricante e o lote |
| de | je nach Hersteller und Charge |
| ru | в зависимости от производителя и партии |
| zh | 视生产商和批次而定 |

Nunca se traducen: **Q'mical, WhatsApp, PSE, INVIMA, ICA, INCI** ni las siglas
técnicas internacionales (TDS, SDS/FDS, CoA, EDTA, LABSA…).

## 🖼️ Imágenes de vista previa (WhatsApp)

`npm run og` genera **105 imágenes**: 15 por idioma (7 de sección + 8 de línea),
tomando los textos de `src/i18n/ui/<lang>.json` → clave `og`.

- Español en `public/og/`, los demás en `public/og/<lang>/`.
- Si cambias el diseño, **sube `ogVersion` en `src/data/site.ts`** (WhatsApp
  cachea por URL).

## ➕ Añadir un idioma nuevo

1. Agrégalo a `LOCALES` y `LOCALE_INFO` en `src/i18n/config.ts`.
2. Copia `src/i18n/ui/es.json` a `src/i18n/ui/<lang>.json` y tradúcelo.
3. Crea `src/data/i18n/products/<lang>/*.json`, `sectores/<lang>.json` y
   `taxonomy/<lang>.json`.
4. Añade el código a `LOCALES` en `scripts/generar-og.mjs` y `scripts/validar-i18n.mjs`.
5. `npm run og && npm run validar:i18n && npm run build`.

Las rutas se generan solas: no hay que crear páginas.

## 🔍 Búsqueda

El buscador difuso (`src/lib/fuzzy.ts`) funciona en los 7 idiomas: normaliza
Unicode (`\p{L}`), así que tolera erratas también en cirílico, y en chino
funciona por prefijo y coincidencia exacta.
