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
**EN PROGRESO — Mejoras UI del Checkout (diff con repo US)**

### Mejoras identificadas del repo US vs actual (solo las implementables):

**1. `getEstimatedDelivery()` function** (NUEVA)
- Calcular fecha estimada de entrega: hoy + 6 días hábiles (earliest) y +8 días hábiles (latest)
- Usar `addBusinessDays` helper interno (salta sábados/domingos)
- Formatear como "Jun 25 – Jun 27" (formato en-US, `month: 'short', day: 'numeric'`)
- Agregar al top del archivo, antes de las constantes dark theme
- NO cambiar "días hábiles" en el copy — mantenerlo en español donde aparezca visible

**2. Import `Truck` icon**
- Agregar `Truck` a la línea de imports de lucide-react (línea 9)
- Ya está `Lock`, `ChevronDown`, `ChevronUp`, etc. Solo agregar `Truck`

**3. Fila "Envío gratis · Llega {fecha}"** en desktop totals
- En la sección de totales del panel derecho (desktop), después del `Total` row
- Agregar: `<div className="flex items-center gap-2 mt-1 pt-3 border-t border-white/[0.08] text-xs text-brand-steel">`
- `<Truck size={12} className="text-brand-amber flex-shrink-0" />`
- `<span>Envío gratis · <span className="text-brand-smoke">Llega {getEstimatedDelivery()}</span></span>`
- Va DESPUÉS del bloque total (línea ~547), ANTES del cierre del `space-y-2 pt-4 border-t` div

**4. Fila "Envío gratis · Llega {fecha}"** en MobileOrderSummary
- En el `MobileOrderSummary`, en la sección de totales, después del row de Total
- Mismo patrón: `<div className="flex items-center gap-2 pt-2 text-xs text-brand-steel">`
- `<Truck size={11} className="text-brand-amber flex-shrink-0" />`
- `<span>Envío gratis · <span className="text-brand-smoke">Llega {getEstimatedDelivery()}</span></span>`
- Va después del div de Total (línea ~629), ANTES del cierre del `space-y-1 pt-3 border-t` div

**5. Mobile summary empieza abierto**
- `MobileOrderSummary`: cambiar `useState(false)` → `useState(true)` (línea 563)
- Motivo: al llegar al checkout en móvil el usuario ya debe ver su pedido inmediatamente

**6. PayPal button** — SKIP. `PaypalExpressButton` no existe en este repo.

### Archivos a modificar:
- `src/pages/ui/CheckoutUI.tsx` — todos los cambios arriba

### Notas de implementación:
- Mantener todos los strings visibles EN ESPAÑOL (Envío gratis, Llega, etc.)
- No tocar la lógica de Stripe, validaciones ni ninguna otra sección
- getEstimatedDelivery usa `en-US` locale solo para el formato de fecha corto (Jun 25) — es aceptable o cambiar a `es-MX` con `{ month: 'short', day: 'numeric' }` → "25 jun."

## Recent Changes
- **Checkout UI mejoras (delivery estimate + mobile open)** — EN PROGRESO (2026-06-15)
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
- `src/pages/ui/CheckoutUI.tsx` — checkout (mejoras pendientes en Craft Mode)
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