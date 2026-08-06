# Rodata.mx — Plan

## Brand & Context
- Marca premium de soporte lumbar para motociclistas mexicanos
- Producto único: Rodata One — soporte lumbar (MX$799, compare_at MX$999, 20% OFF)
- Slug real del producto: `soporte-lumbar-rodata-one` (id `400026a2-c277-407c-abbb-d1683f415120`)
- Tono: directo, técnico-emocional, sin fluff. Habla como rider, no como médico.
- **Avatar 1**: rider de carretera/fin de semana → PDP `/productos/soporte-lumbar-rodata-one`
- **Avatar 2**: **repartidor de plataformas** (Rappi/DiDi/Uber Eats) → `/repartidores`
- Store en producción: rodata.store
- **Dos repos hermanos**: Rodata US y Rodata MX. Agente solo tiene acceso a MX.

## Design System
- Dark theme: `brand-carbon` #111315, `brand-graphite` #1D2125, `brand-steel` #5E6670, `brand-smoke` #C7CDD3, `brand-offwhite` #F5F7F8
- Amber: `brand-amber` #C98B2E / `brand-amber-light` #E5A842 — único acento
- Typography: Sora (headings/bold), Inter (body/UI)
- Imágenes Supabase: `render/image/public` + `?width=xxx&quality=75`
- Avatares 36px → `?width=72&height=72&resize=cover&quality=80`
- **Convención de landings por avatar**: SIEMPRE forkear `ProductPageUI.tsx` (arquitectura
  validada). Cambiar solo copy, imágenes, reviews y FAQ. Nunca reinventar el esqueleto.

---

## Active Plan — VALIDAR `/repartidores` (PDP clonada) — IMPLEMENTADO 2026-08-06

### Qué se hizo
`/repartidores` es ahora un fork literal de `ProductPageUI` v4.7 (`DeliveryPDPUI.tsx`):
misma galería con scroll-snap, badge -20% half-outside, guía de tallas inline, cantidad,
express checkout, **botón Agregar al carrito recuperado** (CartSidebar vuelve a funcionar),
trust row, accordion de envío, social proof, WhatsApp, stats bar, sticky bar, FAQ y CTA final.

Cambios respecto al control (solo contenido):
- Galería: `[DLV_HERO_SQ, DLV_FEAT_3, DLV_FEAT_2, ...logic.displayImages]`
- Eyebrow: "Diseñado para jornadas de 8 a 12 horas sobre la moto" + subtítulo con el gancho del ad
- 3 bullets, FEATURES 01–03, 5 REVIEWS y 7 FAQS en lenguaje de repartidor
- Lifestyle break con `DLV_HERO_WIDE`; quote break con `DLV_FEAT_1`
- **Sección nueva exclusiva**: banda de ángulo económico ("El dolor no solo molesta.
  Te cuesta dinero.") entre stats bar y `#por-que-funciona`
- SEO: `noindex, follow` + canonical a la PDP principal, con cleanup al desmontar
- `ProductPageUI.tsx` NO se tocó (es el control)

### Pendiente de verificación
- Screenshot mobile 390px + desktop tras el deploy. Revisar que `DLV_HERO_SQ`
  (`?width=1200&height=1200&resize=cover`) no corte la cabeza del rider en la galería.
- Probar que el CartSidebar abra al dar "Agregar al carrito".

### Cómo medir (sin A/B split — no hay volumen)
- Swap por campaña con benchmark antes/después: apuntar SOLO el ad set de repartidores a
  `rodata.store/repartidores?utm_source=meta&utm_campaign=repartidores`.
- Antes de lanzar: anotar el CR actual de ese ad set sobre la PDP vieja (últimos 14–21 días).
- Ventana: ~2–3 semanas o ~300–400 clics / ~20–25 compras.
- Regla: si el CR NO cae >20–25% relativo → quedarse con la nueva. Reversible en 1 min.

---

## Recent Changes
- **`/repartidores` refactorizada a PDP clonada** ✅ (2026-08-06) — creado
  `src/pages/ui/DeliveryPDPUI.tsx` (fork de ProductPageUI v4.7), `DeliveryLanding.tsx` apunta
  al nuevo UI, borrado `DeliveryLandingUI.tsx`. Carrito y galería recuperados.
- **Refactor `/repartidores` → clonar arquitectura de la PDP** 📋 (2026-08-06) — decisión:
  no cambiar arquitectura y mensaje al mismo tiempo.
- **Landing `/repartidores` v1** (2026-08-06) — descartada; copy e imágenes reciclados.
- **Auditoría Meta Purchase duplicados** ✅ (2026-08-06) — no viene del storefront.
- **PayPal Express portado US→MX — IMPLEMENTADO** ✅ (2026-07-23) — falta prueba real.
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

### Avatar repartidor — en uso en DeliveryPDPUI
- DLV_HERO: `SB_PROD/dlv-hero.webp` (1600x1200) — usado en galería (crop cuadrado) y lifestyle break
- DLV_FEAT_1: `SB_PROD/dlv-feat-1.webp` (1024²) — feature 01 + quote break
- DLV_FEAT_2: `SB_PROD/dlv-feat-2.webp` (1024²) — feature 02 + galería
- DLV_FEAT_3: `SB_PROD/dlv-feat-3.webp` (1024²) — feature 03 + galería
- Reviews/avatares: reutilizados de la PDP (pendiente generar propios)

### Creativos de ads validados (subidos por el usuario, en Supabase)
- `message-images/0f3c776b-.../1786041572607-zlqbmm6nxp.webp` — "Te subes y bajas 40 veces al día"
- `message-images/0f3c776b-.../1786041572607-2687rjqwf6x.webp` — "Mochila cargada. Postura inclinada."
- `message-images/0f3c776b-.../1786041572607-iufym7bnuz9.webp` — "Acortar tu turno te cuesta entregas."

## Known Issues
- **PayPal MX — falta prueba real (2026-07-23)**: implementación completa pero NO probada.
- **Meta Purchase server duplicados (2026-08-06)**: 75 enviados vs 141 recibidos. No viene del
  storefront. Revisar CAPI Gateway en Business Manager.
- **Order Tracking — view orders_customer**: depende de que exponga checkout_token/tracking_number/
  tracking_url/estimated_delivery_at.
- Chrome autofill puede pintar inputs del checkout en blanco (workaround CSS aplicado)

## Key Files
- `src/App.tsx` — rutas (`/repartidores` incluida)
- `src/components/headless/HeadlessProduct.tsx` — `useProductLogic(slugOverride?)`, prop `slug`
- `src/pages/Product.tsx` — PDP carretera (contenedor)
- `src/pages/ui/ProductPageUI.tsx` — PDP carretera v4.7 — **control del test, tocar con cuidado**
- `src/pages/DeliveryLanding.tsx` — contenedor PDP repartidores
- `src/pages/ui/DeliveryPDPUI.tsx` — PDP repartidores (fork de ProductPageUI)
- `src/templates/EcommerceTemplate.tsx` — nav/trust bar/WhatsApp/CartSidebar
- `src/components/ProductExpressCheckout.tsx` — wallets en PDP
- `src/lib/tracking-utils.ts` — tracking + getAttributionPayload
- `src/index.css` / `tailwind.config.ts` — design system

## PENDING / Future Sessions
- **[ALTA]** Screenshot-preview mobile + desktop de `/repartidores` y ajustar recorte de galería si corta.
- **[ALTA]** Apuntar el ad set de repartidores a `/repartidores` con UTMs y anotar el CR benchmark previo.
- **[ALTA]** PayPal: probar checkout real en producción.
- **[MEDIA]** Generar reviews/avatares propios de repartidores (hoy se reutilizan los de carretera).
- **[MEDIA]** Revisar CAPI Gateway en Business Manager (duplicados Meta).
- **[BAJA]** Test posterior: versión sin nav vs con nav en `/repartidores` (micro-optimización).
- **[BAJA]** Property PostHog `landing_variant: 'repartidores'`.
- **[BAJA]** "También les encantó" upsell en cart/checkout.