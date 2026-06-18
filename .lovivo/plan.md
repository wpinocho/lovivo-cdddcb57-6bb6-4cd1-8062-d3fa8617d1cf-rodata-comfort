# Rodata.mx — Plan

## Brand & Context
- Marca premium de soporte lumbar para motociclistas mexicanos
- Producto único: Rodata One — soporte lumbar para motociclistas
- Precio: MX$799 (compare_at: MX$999, 20% OFF)
- Tono: directo, técnico-emocional, sin fluff. Habla como rider, no como médico.
- Audiencia: motociclistas MX que hacen trayectos medios/largos y sufren dolor lumbar
- Store en producción: rodata.store

## Design System
- Dark theme: #111315 (fondo), #1D2125 (secciones alternas), #2A2E34 (graphite)
- Amber: #C98B2E (brand-amber) — único acento
- Typography: Sora (headings/bold), Inter (body/UI)
- Botones: btn-amber-lg (primario), btn-outline-light (secundario)
- Imágenes Supabase: usar `render/image/public` path + `?width=xxx&quality=75`
- **Avatar rule**: Para círculos de 36px (w-9 h-9), usar Supabase `?width=72&height=72&resize=cover&quality=80`

## Active Plan
Ningún plan activo — todos los items urgentes implementados.

## Recent Changes
- **Fix conversiones duplicadas Meta** — COMPLETADO ✅ (2026-06-18)
  - `tracking-utils.ts`: `generateEventId()` ahora acepta `(eventName, stableId?)` → ID determinístico por orden/producto. Purchase usa `order_id`, AddToCart/ViewContent/InitiateCheckout usan `product_id`, Search usa el término buscado. PageView no se toca.
  - `StripePayment.tsx`: sessionStorage guard `purchase_tracked_${orderId}` en 2 call sites (handlePayment + handleExpressCheckoutConfirm)
  - `ProductExpressCheckout.tsx`: sessionStorage guard `purchase_tracked_${orderId}` en 1 call site (handlePaymentMethod)
  - Todos con try/catch para compatibilidad con Safari privado y otros edge cases
- **Checkout bottom section v2** — COMPLETADO ✅ (2026-06-15)
  - Envío: "Pendiente" → "Gratis" en resumen móvil
  - `getEstimatedDelivery()`: ahora 4 días hábiles (un solo día, no rango) — coincide con PDP
  - Display: "Llega el {fecha}" (con "el" agregado)
  - Social proof arriba del botón: ★★★★★ 4.9 · +800 riders satisfechos
  - Botón dos líneas: "Completar Compra" / "{monto}" — fondo amber sólido, h-14
  - Trust badges: Envío gratis · Pago Seguro · Garantía 30 Días (con íconos amber)
  - Métodos de pago: VISA | MC | AMEX | Apple Pay | G Pay | OXXO (badges borde)
  - Links legales: Términos | Privacidad (style mejorado)
- **Checkout UI mejoras** — COMPLETADO ✅ (2026-06-15)
- **Badge descuento half-outside + precio tachado dinámico** — COMPLETADO ✅ (2026-06-15)
- **Trust bar: 2 mensajes en móvil** — COMPLETADO ✅
- **Avatar fix: resize=cover server-side** ✅ (2026-06-15)
- **PDP MX v4 — 8 mejoras sincronizadas del repo US** ✅ (2026-06-15)
- **Precio actualizado: MX$699 → MX$799** ✅
- Cart Sidebar dark rebrand ✅
- **BUG FIX: "Comprar Ahora" → checkout vacío — RESUELTO ✅**

## Image Inventory
- LIFESTYLE_CITY: `/pdp-lifestyle-1.jpg`
- LIFESTYLE_HIGHWAY: `render/image/public/message-images/.../1775768374485-uca4dkx21g.webp?width=1200&quality=75` ✅
- FEAT_IMG_1-3: `render/image/public/message-images/.../1775777133671/72-*.webp?width=800&quality=75` ✅
- REVIEW_IMG_1-5: `render/image/public/product-images/.../review-1-5.webp?width=600&quality=75` ✅
- AVATAR_*: `product-images/.../avatar-carlos-v3.webp?width=72&height=72&resize=cover&quality=80` ✅

## Known Issues
- Chrome autofill puede pintar inputs del checkout en blanco (workaround: CSS autofill override ya aplicado en index.css)
- Avatares: si `avatar-carlos-v3.webp` no existe en `product-images` bucket, buscar en `message-images` o regenerar

## Key Files
- `src/pages/ui/ProductPageUI.tsx` — main PDP ✅ v4.6
- `src/templates/EcommerceTemplate.tsx` — ✅ trust bar 2 mensajes
- `src/pages/ui/CheckoutUI.tsx` — ✅ v3 (4 días hábiles, Gratis, "Llega el")
- `src/components/StripePayment.tsx` — ✅ v3 | sessionStorage guard en 2 trackPurchase
- `src/lib/tracking-utils.ts` — ✅ v2 | generateEventId determinístico
- `src/components/ProductExpressCheckout.tsx` — ✅ v2 | sessionStorage guard en 1 trackPurchase
- `src/lib/stripe-appearance.ts` — ✅
- `src/lib/country-codes.ts` — ✅
- `src/components/CartSidebar.tsx` — ✅
- `src/index.css` — design system
- `src/adapters/CheckoutAdapter.tsx` — ✅ isValidPhone fix
- `src/pages/ui/IndexUI.tsx` — ✅ precio actualizado a MX$799

## PENDING / Future Sessions
- Add a "También les encantó" section at bottom of cart/checkout (upsell)
- Consider a post-purchase email sequence (set up from Dashboard)
- Video testimonial section if user has video content
- Monitor conversion rate after checkout v2 deploy
- Monitorear en Meta Ads Manager si las conversiones duplicadas desaparecen tras deploy