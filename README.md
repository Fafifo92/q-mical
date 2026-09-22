# Origen Chemical — Distribución de materias primas

Sitio web B2B para **Origen Chemical S.A.S.**, distribuidor de materias primas
para la industria en Colombia: cosmética, farmacéutica, nutracéutica, alimentos,
agro, veterinaria, extractos, industrial y aseo. Construido con **Astro 5 +
Tailwind CSS 4**, 100 % estático.

La identidad visual sigue el **Manual de Marca Origen Chemical v1.0** (sep. 2026):
azul turquesa `#14A8A8` y azul marino profundo `#0B3B5E` como primarios, verde
pera `#C4D92C` y gris medio `#BDBDBD` de apoyo, tipografías **Montserrat**
(títulos) y **Open Sans** (textos) con Arial de respaldo.

## 🚀 Correr en local

```bash
npm install
npm run dev        # http://localhost:4321
```

## 🏗️ Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Sirve el build localmente |
| `npm run validar` | Valida el portafolio de productos (JSON, slugs, ids) |
| `npm run test:fuzzy` | Prueba el buscador tolerante a erratas contra el portafolio real |
| `npm run og` | Regenera las imágenes de vista previa (WhatsApp, LinkedIn) en `public/og/` |
| `npm run validar:i18n` | Comprueba que las traducciones estén completas en los 7 idiomas |

## 🧭 Pestañas del sitio

**Inicio · Portafolio · Nosotros · Contáctanos · Pagos** (en ese orden, ver
`src/components/Header.astro`). Además existe `/cotizacion` (botón «Cotizar»).

| Página | Qué tiene |
|---|---|
| Inicio | Noticias rotativas, cifras, las 9 industrias (con foto) y las 12 líneas de producto |
| Portafolio (`/productos`) | Héroe con buscador + listado con filtros por **industria** y **línea de producto** |
| Nosotros | Misión, visión, valores, principios, cobertura y «Nuestras líneas de producto» |
| Contáctanos (`/contacto`) | Formulario (abre WhatsApp o correo), mapa y preguntas frecuentes |
| Pagos | Flujo de pago PSE (pendiente de confirmar con el banco) |

## 🗂️ Clasificación del portafolio

Toda materia prima se clasifica por **dos ejes** (`src/data/taxonomy.ts`):

- **Línea de producto** (función en la fórmula): Ingrediente activo, Tensioactivo,
  Modificador reológico, Emoliente, Hidratante, Agente preservante, Base lista para
  formulación, Colorante, Fragancia, Saborizante, Extractos y Aceites.
- **Industria**: Cosmética, Farmacéutica, Nutracéutica, Alimentos, Agro, Veterinaria,
  Extractos, Industrial y Aseo.

## 📦 Administrar el portafolio

**Lee [CATALOGO.md](./CATALOGO.md).** Resumen: los productos viven en JSON en
`src/data/products/`; se agregan/quitan editando esos archivos y el sitio se
actualiza solo. `npm run validar` revisa que todo esté bien.

## 📰 Noticias rotativas de la portada

Se editan en `src/i18n/ui/es.json` → `home.noticias` (y en los otros idiomas).
Cada noticia tiene `etiqueta`, `titulo`, `texto`, `boton`, `enlace` (ruta del
sitio o URL externa), `imagen` e `icono` (opcional).

## 🖼️ Fotos

Las fotos son opcionales: si un archivo no existe, se muestra un arte de marca
en su lugar (nunca una imagen rota).

| Dónde | Archivo | Tamaño recomendado |
|---|---|---|
| Tarjetas de industria (Inicio) | `public/img/industrias/<slug>.jpg` (ej. `cosmetica.jpg`, `nutraceutica.jpg`) | 1200×750 px, < 250 KB |
| Noticias rotativas | la ruta de `imagen` de cada noticia (ej. `public/img/noticias/apg.jpg`) | 2000×1000 px, < 400 KB |

Los slugs de industria son: `cosmetica`, `farmaceutica`, `nutraceutica`, `alimentos`,
`agro`, `veterinaria`, `extractos`, `industrial`, `aseo`.

## 🌐 Idiomas

El sitio está en **7 idiomas** — español (raíz) + inglés, francés, portugués BR,
alemán, ruso y chino (`/en/`, `/fr/`, `/pt/`, `/de/`, `/ru/`, `/zh/`).
**Lee [TRADUCCIONES.md](./TRADUCCIONES.md)** para editar textos o traducir
productos nuevos. `npm run validar:i18n` avisa de lo que falte.

## ⚙️ Configuración del negocio

`src/data/site.ts` — WhatsApp, correo, teléfono, link de pagos PSE, dirección
(la del mapa de Contáctanos), redes y **dominio** (debe ser el real: la vista
previa al compartir exige URL absoluta). Busca los comentarios `// EDITAR`.

## 🎨 Marca

- Paleta y tipografías: `src/styles/global.css` (bloque `@theme`).
- Logo: `src/components/Logo.astro` (isotipo `public/brand/isotipo.*` + logotipo en
  Montserrat, con versión a color y negativa). Favicons en `public/`.

## 🖼️ Vista previa al compartir (WhatsApp)

Las imágenes viven en `public/og/` y se generan con **`npm run og`** (satori +
resvg, con las tipografías de la marca). Hay una por sección y una por línea de
producto — cada ficha usa la de su línea principal.

- Para cambiar textos: edita la clave `og` de `src/i18n/ui/<lang>.json` y corre `npm run og`.
- Si cambias el diseño, **sube `ogVersion` en `src/data/site.ts`**: WhatsApp
  cachea la vista previa por URL y sin eso seguiría mostrando la anterior.

## 🗺️ Estructura

```
src/
├── data/
│   ├── site.ts          ← Config del negocio (WhatsApp, PSE, contacto, mapa)
│   ├── taxonomy.ts      ← Líneas de producto e industrias
│   ├── products/*.json  ← EL PORTAFOLIO en español (matriz-2026.json = productos de la matriz de sep. 2026)
│   └── i18n/            ← Traducciones del portafolio y la taxonomía
├── i18n/
│   ├── config.ts        ← Idiomas activos y rutas localizadas
│   ├── index.ts         ← Cargadores con fallback al español
│   └── ui/*.json        ← TEXTOS DE LA WEB (uno por idioma)
├── lib/
│   ├── catalog.ts       ← Carga y consulta el portafolio
│   ├── fuzzy.ts         ← Búsqueda tolerante a erratas (npm run test:fuzzy)
│   └── imagenes.ts      ← Fotos opcionales con arte de respaldo
├── layouts/Base.astro   ← Layout general (SEO, header, footer, animaciones)
├── components/          ← Header, Footer, Logo, CarruselNoticias, ProductCard, Icon…
├── paginas/             ← Las páginas reales (reciben `lang`)
├── pages/               ← Rutas: raíz = español · [lang]/ = los otros 6
└── styles/global.css    ← Sistema de diseño (colores del manual, animaciones)
public/_redirects        ← Redirige las páginas retiradas (Sectores, Servicio técnico) en Netlify
docs/matriz/             ← Matriz de productos entregada por la empresa (sep. 2026) y su revisión
docs/research/           ← Investigación de la industria usada para el contenido
```

## 🧭 Decisiones de contenido

- **Presentaciones referenciales:** ninguna descripción promete forma física,
  pureza ni desempeño. Todo dice «según fabricante y lote» — la política
  anti-reclamos del sector está explicada en `CATALOGO.md`.
- **Sin marcas registradas:** el portafolio usa nombres genéricos/INCI.
- **Canal comercial:** WhatsApp (cotización, contacto y documentos).
- El sitio es estático: los formularios de cotización y contacto arman el
  mensaje y lo abren en WhatsApp/correo del cliente — no almacenan datos.
