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

## Active Plan
**COMPLETADO ✅ — Sync PDP MX con repo US**

Todos los cambios aplicados en `src/pages/ui/ProductPageUI.tsx` (v4):

### ✅ Bugs resueltos:
1. **Sticky bar fix** — `hasCTABeenVisible` ref + IntersectionObserver nativo (reemplaza useInView)
2. **getSizeKey** — maneja valores como "S (60-75 cm)" → extrae "S" para lookup correcto

### ✅ Conversión:
3. **Badge "Oferta de Lanzamiento · Envío gratis incluido"** — debajo del precio
4. **Social proof block** — 3 avatares iniciales + "+1,000 riders aman el Rodata One"
5. **Acordeón Envío y Devoluciones** — fecha de entrega dinámica, política de cambio

### ✅ Performance:
6. **Image URLs optimizadas** — `render/image/public` + `?width=xxx&quality=75` en todas las remotas
7. **Mobile gallery** — scroll-snap nativo con fetchPriority="high" en primera imagen
8. **Eliminado react-intersection-observer** — solo IntersectionObserver nativo

### ✅ UX:
9. **Botón "Volver" eliminado** — padding ajustado a pt-3

## Recent Changes
- **PDP MX v4 — 8 mejoras sincronizadas del repo US** (2026-06-15) ✅ COMPLETADO
- **PDP MX vs US diff analizado** — 8 mejoras identificadas (2 bugs, 3 conversión, 3 performance) (2026-06-15)
- **Precio actualizado: MX$699 → MX$799** (compare_at_price: MX$999, badge: 20% OFF) — DB + IndexUI.tsx (4 ocurrencias) ✅
- Added urgency/stock signal above CTA on PDP
- Added checkout dark rebrand
- Phone input autofill fix
- Cart Sidebar dark rebrand (DONE ✅)
- **BUG FIX: "Comprar Ahora" → checkout vacío — RESUELTO ✅**
- **BUG FIX: /gracias mostraba "Recoger en Tienda" — RESUELTO ✅**
- **Migración Express Checkout — Pasos 1-5 COMPLETADOS ✅**
- **Stripe Elements dark theme — RESUELTO ✅** (`src/lib/stripe-appearance.ts` + `StripePayment.tsx`)
- **ExpressCheckoutElement: paymentMethodOrder + maxRows + buttonHeight ✅**
- **BUG FIX: validateCheckoutFields bloqueaba pago con AddressElement — RESUELTO ✅**
- **trackPurchase en Express Checkout handler — RESUELTO ✅**
- **BUG FIX: isValidPhone rechazaba E.164 sin espacio (+525531245632) — RESUELTO ✅**

## Image Inventory
- LIFESTYLE_CITY: `/pdp-lifestyle-1.jpg`
- LIFESTYLE_HIGHWAY: `render/image/public/message-images/.../1775768374485-uca4dkx21g.webp?width=1200&quality=75` ✅
- FEAT_IMG_1-3: `render/image/public/message-images/.../1775777133671/72-*.webp?width=800&quality=75` ✅
- REVIEW_IMG_1-5: `render/image/public/product-images/.../review-1-5.webp?width=600&quality=75` ✅

## Known Issues
- Chrome autofill puede pintar inputs del checkout en blanco (workaround: CSS autofill override ya aplicado en index.css)

## Key Files
- `src/pages/ui/ProductPageUI.tsx` — main PDP ✅ v4 (sincronizado con repo US)
- `src/pages/ui/CheckoutUI.tsx` — checkout ✅
- `src/templates/EcommerceTemplate.tsx` — header/footer/nav
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
- Monitor conversion rate after PDP v4 deploy (comparar vs baseline)