# Rodata.mx — Plan

## Brand & Context
- Marca premium de soporte lumbar para motociclistas mexicanos
- Producto único: Rodata One — soporte lumbar (MX$799, compare_at MX$999, 20% OFF)
- Slug real del producto: `soporte-lumbar-rodata-one` (id `400026a2-c277-407c-abbb-d1683f415120`)
- Tono: directo, técnico-emocional, sin fluff. Habla como rider, no como médico.
- **Avatar 1**: rider de carretera/fin de semana → PDP `/productos/soporte-lumbar-rodata-one`
- **Avatar 2**: **repartidor de plataformas** (Rappi/DiDi/Uber Eats) → `/repartidores` (2026-08-06)
- Store en producción: rodata.store
- **Dos repos hermanos**: Rodata US y Rodata MX. Agente solo tiene acceso a MX.

## Design System
- Dark theme: `brand-carbon` #111315, `brand-graphite` #1D2125, `brand-steel` #5E6670, `brand-smoke` #C7CDD3, `brand-offwhite` #F5F7F8
- Amber: `brand-amber` #C98B2E / `brand-amber-light` #E5A842 — único acento
- Typography: Sora (headings/bold), Inter (body/UI)
- Imágenes Supabase: `render/image/public` + `?width=xxx&quality=75`
- Avatares 36px → `?width=72&height=72&resize=cover&quality=80`

---

## Active Plan — REFACTOR `/repartidores`: de landing standalone → PDP clonada (2026-08-06)

### Decisión estratégica (acordada con el usuario)
La v1 de `/repartidores` se construyó como una **landing standalone** (header propio, sin nav,
sin `EcommerceTemplate`, sin galería, sin CartSidebar). **Es la decisión equivocada.**

Razonamiento a documentar y respetar:
1. **Una variable a la vez.** Lo que cambió es el avatar (copy + imágenes), NO la arquitectura.
   Si cambiamos ambas y el CR baja, no sabemos cuál falló. La arquitectura de
   `ProductPageUI` (v4.7) ya está validada con ventas reales → es el control.
2. **La PDP actual tiene activos de conversión que la landing perdió**: carrusel de galería
   mobile con scroll-snap, badge -20% half-outside, guía de tallas inline, sticky bar,
   express checkout (wallets), trust bar, WhatsApp flotante, CartSidebar.
3. **Bug funcional real**: sin `EcommerceTemplate` no hay CartSidebar → `handleAddToCart`
   no renderiza nada. Se resolvió "quitando el botón", lo cual es amputar, no arreglar.
4. **Quitar el nav es una micro-optimización, no la jugada de apertura.** En una tienda de
   1 producto, la fuga por el logo es marginal. Si el repartidor hace clic en el logo y ve
   la home de carretera, es un caso raro y aceptable. Se puede testear después.
5. **Mantenimiento**: si ambas páginas comparten esqueleto, portar mejoras futuras es un diff
   trivial. Con dos arquitecturas distintas, se duplica el trabajo para siempre.

### Objetivo
`/repartidores` debe ser **la misma PDP** que `/productos/soporte-lumbar-rodata-one`,
con copy, imágenes, reseñas y FAQ del avatar repartidor. Nada más.

### URL — mantener `/repartidores`
Más corta y limpia para los ads que `/productos/...-repartidores`. Sin impacto SEO porque
lleva `noindex, follow` + canonical a la PDP principal.

### Implementation steps (Craft Mode)
1. **Crear `src/pages/ui/DeliveryPDPUI.tsx` como FORK LITERAL de `src/pages/ui/ProductPageUI.tsx`.**
   Copiar el archivo tal cual y luego sustituir SOLO contenido. **NO reordenar secciones,
   NO cambiar clases de layout, NO tocar el sticky bar ni la lógica del IntersectionObserver.**
   El diff contra `ProductPageUI.tsx` debe ser casi 100% strings, imágenes y arrays de datos.
2. **Galería (única modificación estructural permitida en el bloque de producto):**
   `productImages` hoy sale de `logic.displayImages` (imágenes del Dashboard = carretera).
   Para esta página anteponer las imágenes del avatar repartidor:
   ```
   const DLV_GALLERY = [DLV_HERO, DLV_FEAT_3, DLV_FEAT_2]
   const productImages = [...DLV_GALLERY, ...(logic.displayImages ?? [])]
   ```
   Nota: `DLV_HERO` es 1600x1200 (4:3) y la galería usa `aspect-square` con `object-cover`
   → verificar en screenshot mobile que no corte la cabeza del rider. Si corta,
   usar `?width=1200&height=1200&resize=cover` en la URL de Supabase.
3. **Mantener `EcommerceTemplate`** con `layout="full-width" noPadding hideFloatingCartOnMobile`
   y los mismos `navLinks` (`Por qué funciona`, `Opiniones`, `FAQ`). Logo → home. Aceptado.
4. **Recuperar el botón "Agregar al carrito"** igual que en la PDP (el CartSidebar ya existe
   dentro de `EcommerceTemplate`). Esto cierra el Known Issue de la v1.
5. **Contenido a portar desde `DeliveryLandingUI.tsx`** (ya está escrito y aprobado):
   - Eyebrow: `DISEÑADO PARA JORNADAS DE 8 A 12 HORAS SOBRE LA MOTO`
   - H1: mantener `logic.product.title` (es la PDP) pero el eyebrow + bullets hacen el match.
     Añadir subtítulo bajo el título con el gancho del ad: "Acortar tu turno te cuesta entregas."
   - 3 bullets del panel de info → versión repartidor (turno completo / subir-bajar 40 veces /
     no estorba con la mochila).
   - `FEATURES` 01–03 → copiar los 3 objetos de `DeliveryLandingUI.tsx` con `DLV_FEAT_1..3`.
   - `REVIEWS` → 5 reseñas con lenguaje de repartidor (turnos, pedidos, plataformas),
     reutilizando `review-1..5.webp` y los avatares existentes. Ciudades: CDMX, Edomex,
     Guadalajara, Monterrey, Puebla.
   - `FAQS` → las 7 de la landing (mochila térmica, calor, subir/bajar, talla, envío, cambio,
     garantía).
6. **Única sección NUEVA permitida — ángulo económico** ("El dolor no solo molesta. Te cuesta
   dinero."). Es el diferenciador más fuerte del avatar y la PDP de carretera no lo tiene.
   Insertarla como banda compacta justo DESPUÉS de la trust bar / antes de `#por-que-funciona`.
   Copy: parar antes = menos entregas = menos dinero; "si te ahorra un turno cortado, ya se pagó".
7. **SEO**: mover el `useEffect` de `noindex, follow` + `<link rel=canonical>` apuntando a
   `https://rodata.store/productos/soporte-lumbar-rodata-one`, con cleanup al desmontar.
8. **`src/pages/DeliveryLanding.tsx`**: cambiar el render a `DeliveryPDPUI`. La inyección de slug
   (`<HeadlessProduct slug="soporte-lumbar-rodata-one">`) ya funciona, no tocar.
9. **Borrar `src/pages/ui/DeliveryLandingUI.tsx`** (recuperable en git si algún día se quiere
   testear la versión sin nav).
10. **Ruta `/repartidores` en `App.tsx`**: sin cambios.
11. **Verificación**: screenshot-preview mobile (390px) + desktop de `/repartidores`;
    comprobar galería, sticky bar, guía de tallas, express checkout y que el CartSidebar abra.

### Archivos
- CREAR: `src/pages/ui/DeliveryPDPUI.tsx` (fork de ProductPageUI v4.7)
- EDITAR: `src/pages/DeliveryLanding.tsx`
- BORRAR: `src/pages/ui/DeliveryLandingUI.tsx`
- NO TOCAR: `src/pages/ui/ProductPageUI.tsx`, `HeadlessProduct.tsx`, `App.tsx`

### Cómo medir (sin A/B split — no hay volumen)
- Swap por campaña con benchmark antes/después: apuntar SOLO el ad set de repartidores a
  `rodata.store/repartidores?utm_source=meta&utm_campaign=repartidores`.
- Antes de lanzar: anotar el CR actual de ese ad set sobre la PDP vieja (últimos 14–21 días).
- Ventana: ~2–3 semanas o ~300–400 clics / ~20–25 compras.
- Regla: si el CR NO cae >20–25% relativo → quedarse con la nueva. Reversible en 1 min.

---

## Recent Changes
- **Refactor `/repartidores` → clonar arquitectura de la PDP** 📋 (2026-08-06) — decisión: la v1
  standalone se descarta; se forkea `ProductPageUI` y solo se cambia copy + imágenes. Motivo:
  no cambiar arquitectura y mensaje al mismo tiempo; recuperar galería, carrito y sticky bar.
- **Landing `/repartidores` v1 IMPLEMENTADA** ✅ (2026-08-06) — slug inyectable en HeadlessProduct,
  ruta nueva, `DeliveryLandingUI` standalone, 4 imágenes del avatar repartidor, copy con message
  match a los 3 ads, SEO noindex+canonical. (Copy e imágenes se reciclan; el esqueleto se descarta.)
- **Auditoría Meta Purchase duplicados** ✅ (2026-08-06) — el storefront NO manda nada directo a
  graph.facebook.com. La duplicación ocurre fuera de este repo.
- **PayPal Express portado US→MX — IMPLEMENTADO** ✅ (2026-07-23) — falta prueba real de checkout.
- **Nav + footer: "Rastrear pedido" agregado** ✅ (2026-06-24)
- **Order Tracking — frontend completo** ✅ (2026-06-24)
- **Footer WhatsApp link corregido** ✅ (2026-06-24) — +52 55 3121 5386
- **BUG FIX: Sticky bar no aparece en PDP — RESUELTO ✅** (2026-06-18)
- **Fix conversiones duplicadas Meta** ✅ (2026-06-18)
- **Checkout bottom section v2** ✅ (2026-06-15)
- **Badge descuento half-outside + precio tachado dinámico** ✅ (2026-06-15)
- **PDP MX v4 — 8 mejoras sincronizadas del repo US** ✅ (2026-06-15)
- **Precio actualizado: MX$699 → MX$799** ✅

## Image Inventory
Base URLs:
- `SB_PROD` = `https://ptgmltivisbtvmoxwnhd.supabase.co/storage/v1/render/image/public/product-images/cdddcb57-6bb6-4cd1-8062-d3fa8617d1cf`
- `SB_MSG` = `.../render/image/public/message-images/0f3c776b-9309-4486-bd63-fd732b7d8db1`

### PDP carretera (avatar 1) — vigentes
- LIFESTYLE_CITY: `/pdp-lifestyle-1.jpg`
- LIFESTYLE_HIGHWAY: `SB_MSG/1775768374485-uca4dkx21g.webp`
- PRODUCT_FLAT: `SB_MSG/1775767354281-gqxi2j4hklp.webp`
- FEAT_IMG_1-3: `SB_MSG/1775777133671-80hvv9dmxa.webp`, `1775777133672-xhxki05535d.webp`, `1775777133672-dzkdrl1lt2.webp`
- REVIEW_IMG_1-5: `SB_PROD/review-1..5.webp`
- AVATAR_CARLOS/JORGE/ANDRES: `SB_PROD/avatar-carlos-v3.webp`, `avatar-jorge-v3.webp`, `avatar-andres-v3.webp`

### Avatar repartidor — generadas 2026-08-06 ✅ (se reutilizan en el refactor)
- DLV_HERO: `SB_PROD/dlv-hero.webp` (1600x1200) — repartidor en scooter, noche lluviosa CDMX
- DLV_FEAT_1: `SB_PROD/dlv-feat-1.webp` (1024²) — estirando la espalda al final del turno
- DLV_FEAT_2: `SB_PROD/dlv-feat-2.webp` (1024²) — close-up ajustando correas en la calle
- DLV_FEAT_3: `SB_PROD/dlv-feat-3.webp` (1024²) — espalda con mochila térmica + soporte debajo
- Reviews/avatares: reutilizados de la PDP (pendiente generar propios)

### Creativos de ads validados (subidos por el usuario, en Supabase)
- `message-images/0f3c776b-.../1786041572607-zlqbmm6nxp.webp` — "Te subes y bajas 40 veces al día"
- `message-images/0f3c776b-.../1786041572607-2687rjqwf6x.webp` — "Mochila cargada. Postura inclinada."
- `message-images/0f3c776b-.../1786041572607-iufym7bnuz9.webp` — "Acortar tu turno te cuesta entregas."

## Known Issues
- **`/repartidores` sin CartSidebar (2026-08-06)** — se resuelve con el refactor a `EcommerceTemplate`.
  Cerrar este issue cuando esté implementado.
- **PayPal MX — falta prueba real (2026-07-23)**: implementación completa pero NO probada en checkout real.
- **Meta Purchase server duplicados (2026-08-06)**: 75 enviados vs 141 recibidos. No viene del
  storefront. Revisar CAPI Gateway en Business Manager.
- **Order Tracking — view orders_customer**: depende de que exponga checkout_token/tracking_number/
  tracking_url/estimated_delivery_at.
- Chrome autofill puede pintar inputs del checkout en blanco (workaround CSS aplicado)

## Key Files
- `src/App.tsx` — rutas (`/repartidores` incluida)
- `src/components/headless/HeadlessProduct.tsx` — `useProductLogic(slugOverride?)`, prop `slug`
- `src/pages/Product.tsx` — PDP carretera (contenedor)
- `src/pages/ui/ProductPageUI.tsx` — PDP carretera v4.7 — **NO TOCAR** (es el control del test)
- `src/pages/DeliveryLanding.tsx` — contenedor PDP repartidores
- `src/pages/ui/DeliveryPDPUI.tsx` — (a crear) PDP repartidores, fork de ProductPageUI
- `src/templates/EcommerceTemplate.tsx` — nav/trust bar/WhatsApp/CartSidebar
- `src/components/ProductExpressCheckout.tsx` — wallets en PDP
- `src/lib/tracking-utils.ts` — tracking + getAttributionPayload
- `src/index.css` / `tailwind.config.ts` — design system

## PENDING / Future Sessions
- **[ALTA]** Ejecutar el refactor de `/repartidores` a PDP clonada (ver Active Plan).
- **[ALTA]** Screenshot-preview mobile + desktop tras el refactor y ajustar recortes de galería.
- **[ALTA]** Apuntar el ad set de repartidores a `/repartidores` con UTMs y anotar el CR benchmark previo.
- **[ALTA]** PayPal: probar checkout real en producción.
- **[MEDIA]** Generar reviews/avatares propios de repartidores.
- **[MEDIA]** Revisar CAPI Gateway en Business Manager (duplicados Meta).
- **[BAJA]** Test posterior: versión sin nav vs con nav en `/repartidores` (micro-optimización).
- **[BAJA]** Property PostHog `landing_variant: 'repartidores'`.
- **[BAJA]** "También les encantó" upsell en cart/checkout.