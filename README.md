# Q'mical — Distribución de materias primas

Sitio web B2B para **Q'mical**, distribuidor de materias primas para la industria
en Colombia: cosmética, maquillaje, aseo, alimentos, agro, veterinaria, extractos
e industrial. Construido con **Astro 5 + Tailwind CSS 4**, 100 % estático.

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
| `npm run validar` | Valida el catálogo de productos (JSON, slugs, ids) |
| `npm run test:fuzzy` | Prueba el buscador tolerante a erratas contra el catálogo real |
| `npm run og` | Regenera las imágenes de vista previa (WhatsApp, LinkedIn) en `public/og/` |
| `npm run validar:i18n` | Comprueba que las traducciones estén completas en los 7 idiomas |

## 🌐 Idiomas

El sitio está en **7 idiomas** — español (raíz) + inglés, francés, portugués BR,
alemán, ruso y chino (`/en/`, `/fr/`, `/pt/`, `/de/`, `/ru/`, `/zh/`).
El selector está en el header y salta a **la misma página** en el otro idioma.

**Lee [TRADUCCIONES.md](./TRADUCCIONES.md)** para editar textos o traducir
productos nuevos. `npm run validar:i18n` avisa de lo que falte.

## 📦 Administrar el catálogo

**Lee [CATALOGO.md](./CATALOGO.md).** Resumen: cada línea de producto es un JSON
en `src/data/products/`; se agregan/quitan productos editando esos archivos y el
sitio se actualiza solo. `npm run validar` revisa que todo esté bien.

## ⚙️ Configuración del negocio

`src/data/site.ts` — WhatsApp, correo, link de pagos PSE, dirección, redes y
**dominio** (debe ser el real: la vista previa al compartir exige URL absoluta).
Busca los comentarios `// EDITAR`.

## 🖼️ Vista previa al compartir (WhatsApp)

Las imágenes viven en `public/og/` y se generan con **`npm run og`** (satori +
resvg, con la tipografía de la marca). Hay una por sección y una por línea de
producto — cada ficha usa la de su línea.

- Para cambiar textos o colores: edita `scripts/generar-og.mjs` y corre `npm run og`.
- Si cambias el diseño, **sube `ogVersion` en `src/data/site.ts`**: WhatsApp
  cachea la vista previa por URL y sin eso seguiría mostrando la anterior.

## 🗺️ Estructura

```
src/
├── data/
│   ├── site.ts          ← Config del negocio (WhatsApp, PSE, contacto)
│   ├── taxonomy.ts      ← Líneas, especialidades y sectores (filtros + colores/íconos)
│   ├── sectores.ts      ← Copy de las 12 landings de segmentos de mercado
│   ├── products/*.json  ← EL CATÁLOGO en español (un JSON por línea)
│   └── i18n/            ← Traducciones del catálogo, sectores y taxonomía
├── i18n/
│   ├── config.ts        ← Idiomas activos y rutas localizadas
│   ├── index.ts         ← Cargadores con fallback al español
│   └── ui/*.json        ← TEXTOS DE LA WEB (uno por idioma)
├── lib/
│   ├── catalog.ts       ← Carga y consulta el catálogo
│   └── fuzzy.ts         ← Búsqueda tolerante a erratas (npm run test:fuzzy)
├── layouts/Base.astro   ← Layout general (SEO, header, footer, animaciones)
├── components/          ← Header, Footer, ProductCard, Icon, CTA…
├── paginas/             ← Las páginas reales (reciben `lang`)
├── pages/               ← Rutas: raíz = español · [lang]/ = los otros 6
│   ├── index.astro            ← Portada (es)
│   ├── productos/index.astro  ← Catálogo con filtros (búsqueda difusa, mercado, especialidad)
│   ├── productos/[slug].astro ← Ficha de producto (una página por producto)
│   ├── sectores/index.astro   ← Segmentos de mercado (estilo Caldic/Brenntag)
│   ├── sectores/[slug].astro  ← Landing por sector (12 páginas)
│   ├── cotizacion.astro       ← Formulario de cotización B2B → WhatsApp
│   ├── servicio-tecnico.astro ← Documentación, muestras, regulatorio, FAQ
│   ├── nosotros.astro
│   └── pagos.astro            ← Flujo de pago PSE
└── styles/global.css    ← Sistema de diseño (colores, animaciones)
docs/research/           ← Investigación de la industria usada para el contenido
```

## 🧭 Decisiones de contenido

- **Presentaciones referenciales:** ninguna descripción promete forma física,
  pureza ni desempeño. Todo dice «según fabricante y lote» — la política
  anti-reclamos del sector está explicada en `CATALOGO.md`.
- **Sin marcas registradas:** el catálogo usa nombres genéricos/INCI.
- **Canal comercial:** WhatsApp (cotización y documentos); pagos por PSE.
- El sitio es estático: el formulario de cotización arma el mensaje y lo abre
  en WhatsApp/correo del cliente — no almacena datos.
