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
| **Portafolio (maestro)** | `src/data/products/*.json` | Español — ver [CATALOGO.md](./CATALOGO.md) |
| **Portafolio traducido** | `src/data/i18n/products/<lang>/*.json` | Solo campos de texto |
| Taxonomía (maestro) | `src/data/taxonomy.ts` | 12 líneas de producto y 8 industrias |
| Taxonomía traducida | `src/data/i18n/taxonomy/<lang>.json` | `lineas` e `industrias` (nombre, corto, tagline) + `origenes` |
| Noticias de la portada | `src/i18n/ui/<lang>.json` → `home.noticias` | `enlace`, `imagen` e `icono` no se traducen |

## ✏️ Cambiar un texto de la web

1. Edítalo en **`src/i18n/ui/es.json`** (español).
2. Edita la misma clave en los otros 6 archivos de `src/i18n/ui/`.
3. `npm run validar:i18n` avisa si a algún idioma le falta la clave.

> **Marcadores:** textos como `"{n} productos"` o `"© {year} {empresa}"` llevan
> variables entre llaves. **Consérvalas** en todos los idiomas (pueden ir en otro
> orden, pero deben estar).
>
> **Claves que terminan en `Html`** llevan `<strong>` dentro: mantén las etiquetas.

## ➕ Traducir un producto nuevo

1. Agrégalo primero al maestro en español (`src/data/products/<industria>.json`).
2. En cada idioma, añade a `src/data/i18n/products/<lang>/<industria>.json`:

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
- Solo van los campos de **texto**. Líneas, industrias, INCI, origen y
  destacado se heredan del maestro (son datos, no idioma).
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

Nunca se traducen: **Origen Chemical, WhatsApp, PSE, Bre-B, INVIMA, ICA, INCI**,
la dirección ni las siglas técnicas internacionales (TDS, SDS/FDS, CoA, EDTA, LABSA…).

En alemán los sustantivos van con mayúscula: el código no pasa a minúsculas los
nombres de línea dentro de frases (`nombreEnFrase` en `src/i18n/config.ts`).

## 🖼️ Imágenes de vista previa (WhatsApp)

`npm run og` genera **126 imágenes**: 18 por idioma (6 de sección + 12 de línea),
tomando los textos de `src/i18n/ui/<lang>.json` → clave `og`. Usa Montserrat y
Open Sans (con cirílico) y, para el chino, Noto Sans SC (`@fontsource/noto-sans-sc`).
`npm run og -- es ru` regenera solo esos idiomas.

- Español en `public/og/`, los demás en `public/og/<lang>/`.
- Si cambias el diseño, **sube `ogVersion` en `src/data/site.ts`** (WhatsApp
  cachea por URL).

## ➕ Añadir un idioma nuevo

1. Agrégalo a `LOCALES` y `LOCALE_INFO` en `src/i18n/config.ts`.
2. Copia `src/i18n/ui/es.json` a `src/i18n/ui/<lang>.json` y tradúcelo.
3. Crea `src/data/i18n/products/<lang>/*.json` y `taxonomy/<lang>.json`.
4. Añade el código a `LOCALES` en `scripts/generar-og.mjs` y `scripts/validar-i18n.mjs`.
5. `npm run og && npm run validar:i18n && npm run build`.

Las rutas se generan solas: no hay que crear páginas.

## 🔍 Búsqueda

El buscador difuso (`src/lib/fuzzy.ts`) funciona en los 7 idiomas: normaliza
Unicode (`\p{L}`), así que tolera erratas también en cirílico, y en chino
funciona por prefijo y coincidencia exacta.
