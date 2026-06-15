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
Optimización continua del storefront. No hay cambios pendientes críticos.

## Recent Changes
- **Checkout UI mejoras** — COMPLETADO ✅ (2026-06-15)
  - `getEstimatedDelivery()`: calcula rango 6–8 días hábiles desde hoy, formato es-MX
  - `addBusinessDays()` helper (salta sábados y domingos)
  - Fila "Envío gratis · Llega {fecha}" con ícono Truck en desktop (debajo del Total)
  - Fila "Envío gratis · Llega {fecha}" con ícono Truck en MobileOrderSummary
  - Mobile summary ahora abre por defecto `useState(true)`
  - Import `Truck` agregado a lucide-react
- **Badge descuento half-outside + precio tachado dinámico** — COMPLETADO ✅ (2026-06-15)
  - Desktop: wrapper externo sin overflow-hidden, badge con `absolute top-0 left-5 -translate-y-1/2 z-10`
  - Mobile: mismo posicionamiento half-outside
  - Precio tachado: `text-2xl line-through text-brand-steel/70` + badge `bg-brand-amber text-brand-carbon` (sólido, no transparente) — igual que referencia US
- **Trust bar: 2 mensajes en móvil** — "Envío gratis a México | +800 riders felices" ✅ (2026-06-15)
- **Avatar fix: resize=cover server-side** — `?width=72&height=72&resize=cover&quality=80` en Supabase ✅ (2026-06-15)
- **Trust bar: "+800 riders ya lo usan a diario"** — ahora visible en móvil ✅ (2026-06-15)
- **Avatares v3: regenerados con cara centrada al 55% del frame** ✅ (2026-06-15)
- **Fecha entrega: 3 → 4 días hábiles** ✅ (2026-06-15)
- **PDP MX v4 — 8 mejoras sincronizadas del repo US** ✅ (2026-06-15)
- **Precio actualizado: MX$699 → MX$799** (compare_at_price: MX$999, badge: 20% OFF) ✅
- Added urgency/stock signal above CTA on PDP
- Added checkout dark rebrand
- Phone input autofill fix
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
- `src/pages/ui/ProductPageUI.tsx` — main PDP ✅ v4.6 (badge half-outside + precio tachado dinámico)
- `src/templates/EcommerceTemplate.tsx` — ✅ trust bar 2 mensajes
- `src/pages/ui/CheckoutUI.tsx` — ✅ v2 (delivery estimate + mobile open by default)
- `src/components/StripePayment.tsx` — payment form ✅
- `src/lib/stripe-appearance.ts` — ✅
- `src/components/ProductExpressCheckout.tsx` — ✅
- `src/lib/country-codes.ts` — ✅
- `src/components/CartSidebar.tsx` — ✅
- `src/index.css` — design system
- `src/adapters/CheckoutAdapter.tsx` — ✅ isValidPhone fix
- `src/pages/ui/IndexUI.tsx` — ✅ precio actualizado a MX$799

## PENDING / Future Sessions
- Add a "También les encantó" section at bottom of cart/checkout (upsell)
- Consider a post-purchase email sequence (set up from Dashboard)
- Video testimonial section if user has video content
- Monitor conversion rate after PDP v4 deploy