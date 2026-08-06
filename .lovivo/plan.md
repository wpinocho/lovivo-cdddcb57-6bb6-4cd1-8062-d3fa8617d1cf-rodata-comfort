# Rodata.mx — Plan

## Brand & Context
- Marca premium de soporte lumbar para motociclistas mexicanos
- Producto único: Rodata One — soporte lumbar (MX$799, compare_at MX$999, 20% OFF)
- Slug real del producto: `soporte-lumbar-rodata-one` (id `400026a2-c277-407c-abbb-d1683f415120`)
- Tono: directo, técnico-emocional, sin fluff. Habla como rider, no como médico.
- **Avatar 1**: rider de carretera/fin de semana → PDP `/productos/soporte-lumbar-rodata-one`
- **Avatar 2**: **repartidor de plataformas** (Rappi/DiDi/Uber Eats) → landing `/repartidores` (2026-08-06)
- Store en producción: rodata.store
- **Dos repos hermanos**: Rodata US y Rodata MX. Agente solo tiene acceso a MX.

## Design System
- Dark theme: `brand-carbon` #111315, `brand-graphite` #1D2125, `brand-steel` #5E6670, `brand-smoke` #C7CDD3, `brand-offwhite` #F5F7F8
- Amber: `brand-amber` #C98B2E / `brand-amber-light` #E5A842 — único acento
- Typography: Sora (headings/bold), Inter (body/UI)
- Imágenes Supabase: `render/image/public` + `?width=xxx&quality=75`
- Avatares 36px → `?width=72&height=72&resize=cover&quality=80`

---

## Active Plan — LANDING `/repartidores` ✅ v1 LANZADA (2026-08-06)

### Qué se implementó
1. **Slug inyectable** — `useProductLogic(slugOverride?)` + `<HeadlessProduct slug="...">`. Retrocompatible: `/productos/:slug` intacto.
2. **Ruta** `/repartidores` (lazy) en `App.tsx`.
3. **`src/pages/DeliveryLanding.tsx`** → `HeadlessProduct slug="soporte-lumbar-rodata-one"` + `DeliveryLandingUI`.
4. **`src/pages/ui/DeliveryLandingUI.tsx`** — landing standalone (NO usa `EcommerceTemplate`):
   - Header minimal: logo + "Envío gratis". Sin links de salida (tráfico pagado).
   - **CTA único = `handleBuyNow`** (va directo a `/pagar`, sin carrito). Decisión deliberada: sin CartSidebar en esta página, así que NO agregar botones "Agregar al carrito" aquí.
   - Secciones: hero → trust bar → ángulo económico → 3 features → bloque de compra (tallas + guía + express checkout) → 3 reviews → FAQ (7) → cierre → footer minimal → sticky bar.
   - `ProductExpressCheckout` incluido (Apple Pay / GPay / Link).
   - SEO: `noindex, follow` + canonical a la PDP principal, vía `useEffect` con cleanup.
5. **Imágenes generadas** (Gemini + reference del producto real) — ver Image Inventory.
6. **Reviews/avatares reutilizados** de la PDP (mismos assets, copy reescrito a lenguaje de repartidor) para no quemar créditos.

### Copy — message match con los ads validados
- H1: **"Acortar tu turno te cuesta entregas."** (literal del ad #3)
- Eyebrow: "Diseñado para jornadas de 8 a 12 horas sobre la moto"
- Feature 02 toma el ad #1: "Te subes y bajas 40 veces al día. No se mueve"
- Feature 03 + hero toman el ad #2: mochila cargada / postura inclinada
- Sección de ROI: parar = menos entregas = menos dinero; "si te ahorra un turno cortado, ya se pagó"

### Cómo medir (sin A/B split — no hay volumen)
- **Swap por campaña con benchmark antes/después**: apuntar SOLO el ad set de repartidores a `rodata.store/repartidores?utm_source=meta&utm_campaign=repartidores`.
- Antes de lanzar: anotar CR actual de ese ad set sobre la PDP vieja (últimos 14–21 días en Meta Ads Manager).
- Ventana: ~2–3 semanas o ~300–400 clics / ~20–25 compras.
- **Regla de decisión**: si el CR NO cae >20–25% relativo → quedarse con la landing nueva. Downside reversible en 1 min (cambiar URL del ad).

### Pendiente de esta landing (v2)
- Screenshot-preview mobile + desktop de `/repartidores` tras el deploy (95% del tráfico es mobile).
- Considerar generar 3 review photos + 3 avatares propios de repartidores (hoy se reutilizan los de carretera).
- Evaluar galería de producto propia (hoy no se muestra galería del Dashboard; el hero lifestyle hace ese trabajo).
- Property PostHog `landing_variant: 'repartidores'`.

---

## Recent Changes
- **Landing `/repartidores` v1 IMPLEMENTADA** ✅ (2026-08-06) — slug inyectable en HeadlessProduct, ruta nueva, `DeliveryLandingUI` standalone mobile-first, 4 imágenes nuevas del avatar repartidor, copy con message match a los 3 ads, SEO noindex+canonical.
- **Decisión: landing dedicada para avatar repartidor** 📋 (2026-08-06) — mismo producto + URL nueva; sin duplicar producto en Dashboard; sin A/B split.
- **Auditoría Meta Purchase duplicados** ✅ (2026-08-06) — el storefront NO manda nada directo a graph.facebook.com. La duplicación ocurre fuera de este repo.
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

### Landing repartidores (avatar 2) — generadas 2026-08-06 ✅
- DLV_HERO: `SB_PROD/dlv-hero.webp` (1600x1200) — repartidor en scooter, noche lluviosa CDMX, soporte visible
- DLV_FEAT_1: `SB_PROD/dlv-feat-1.webp` (1024²) — repartidor estirando la espalda al final del turno
- DLV_FEAT_2: `SB_PROD/dlv-feat-2.webp` (1024²) — close-up ajustando correas en la calle
- DLV_FEAT_3: `SB_PROD/dlv-feat-3.webp` (1024²) — espalda con mochila térmica + soporte debajo
- Reviews/avatares: reutilizados de la PDP (pendiente generar propios)

### Creativos de ads validados (subidos por el usuario, en Supabase)
- `message-images/0f3c776b-.../1786041572607-zlqbmm6nxp.webp` — "Te subes y bajas 40 veces al día"
- `message-images/0f3c776b-.../1786041572607-2687rjqwf6x.webp` — "Mochila cargada. Postura inclinada."
- `message-images/0f3c776b-.../1786041572607-iufym7bnuz9.webp` — "Acortar tu turno te cuesta entregas."

## Known Issues
- **`/repartidores` sin CartSidebar (2026-08-06)**: la landing no usa `EcommerceTemplate`, así que `openCart()` no renderiza nada. NO agregar "Agregar al carrito" ahí — usar solo `handleBuyNow`.
- **PayPal MX — falta prueba real (2026-07-23)**: implementación completa pero NO probada en checkout real.
- **Meta Purchase server duplicados (2026-08-06)**: 75 enviados vs 141 recibidos. No viene del storefront. Revisar CAPI Gateway en Business Manager.
- **Order Tracking — view orders_customer**: depende de que exponga checkout_token/tracking_number/tracking_url/estimated_delivery_at.
- Chrome autofill puede pintar inputs del checkout en blanco (workaround CSS aplicado)

## Key Files
- `src/App.tsx` — rutas (`/repartidores` agregada)
- `src/components/headless/HeadlessProduct.tsx` — `useProductLogic(slugOverride?)`, prop `slug` en `HeadlessProduct`
- `src/pages/Product.tsx` — PDP carretera (contenedor)
- `src/pages/ui/ProductPageUI.tsx` — PDP carretera v4.7 — NO TOCAR
- `src/pages/DeliveryLanding.tsx` — contenedor landing repartidores
- `src/pages/ui/DeliveryLandingUI.tsx` — UI landing repartidores
- `src/templates/EcommerceTemplate.tsx` — nav/trust bar/WhatsApp (NO usado en /repartidores)
- `src/components/ProductExpressCheckout.tsx` — wallets en PDP/landing
- `src/lib/tracking-utils.ts` — tracking + getAttributionPayload
- `src/index.css` / `tailwind.config.ts` — design system

## PENDING / Future Sessions
- **[ALTA]** Screenshot-preview de `/repartidores` (mobile + desktop) tras el deploy y ajustar espaciados.
- **[ALTA]** Apuntar el ad set de repartidores a `/repartidores` con UTMs y anotar el CR benchmark previo.
- **[ALTA]** PayPal: probar checkout real en producción.
- **[MEDIA]** Generar reviews/avatares propios de repartidores para la landing.
- **[MEDIA]** Revisar CAPI Gateway en Business Manager (duplicados Meta).
- **[BAJA]** "También les encantó" upsell en cart/checkout.
- **[BAJA]** Post-purchase email sequence (Dashboard).