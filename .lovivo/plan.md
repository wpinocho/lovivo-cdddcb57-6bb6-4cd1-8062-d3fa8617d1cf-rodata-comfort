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
- **Avatar rule**: NO usar imágenes generadas para círculos pequeños. Usar círculos de iniciales (igual que review cards) — más confiable, mejor look a 36px.

## Active Plan
**COMPLETADO ✅ — Social proof pill v4 + Trust bar update**

## Recent Changes
- **Trust bar: "+800 riders ya lo usan a diario"** — ahora visible en móvil (reemplazó "30 días de prueba" visible; "30 días" movido a desktop-only slot) (2026-06-15) ✅
- **Social proof pill: avatares → círculos de iniciales** — C (amber), J (blue), A (green). Elimina el problema de imágenes mal cortadas a 36px (2026-06-15) ✅
- **Social proof pill: "+1,000" → "+800 riders"** — número consistente con nuestro stat real (2026-06-15) ✅
- **Avatares v3: regenerados con cara centrada al 55% del frame** — avatar-carlos-v3.webp, avatar-jorge-v3.webp, avatar-andres-v3.webp (2026-06-15) ✅ (DEPRECATED - reemplazados por iniciales)
- **Copy fix: "aman" → "ya lo usan a diario"** — más natural en MX (2026-06-15) ✅
- **Fecha entrega: 3 → 4 días hábiles** + texto ahora dice "En 4 días hábiles · llega el {fecha}" (2026-06-15) ✅
- **PDP MX v4 — 8 mejoras sincronizadas del repo US** (2026-06-15) ✅ COMPLETADO
- **Precio actualizado: MX$699 → MX$799** (compare_at_price: MX$999, badge: 20% OFF) — DB + IndexUI.tsx ✅
- Added urgency/stock signal above CTA on PDP
- Added checkout dark rebrand
- Phone input autofill fix
- Cart Sidebar dark rebrand (DONE ✅)
- **BUG FIX: "Comprar Ahora" → checkout vacío — RESUELTO ✅**
- **BUG FIX: /gracias mostraba "Recoger en Tienda" — RESUELTO ✅**
- **Migración Express Checkout — Pasos 1-5 COMPLETADOS ✅**

## Image Inventory
- LIFESTYLE_CITY: `/pdp-lifestyle-1.jpg`
- LIFESTYLE_HIGHWAY: `render/image/public/message-images/.../1775768374485-uca4dkx21g.webp?width=1200&quality=75` ✅
- FEAT_IMG_1-3: `render/image/public/message-images/.../1775777133671/72-*.webp?width=800&quality=75` ✅
- REVIEW_IMG_1-5: `render/image/public/product-images/.../review-1-5.webp?width=600&quality=75` ✅
- AVATAR_*: DEPRECATED — reemplazados por círculos de iniciales CSS

## Known Issues
- Chrome autofill puede pintar inputs del checkout en blanco (workaround: CSS autofill override ya aplicado en index.css)
- Discount badge en producto: ya está en código MX (top-4 left-4 inside image), verificar que compare_at esté seteado en DB para que aparezca

## Key Files
- `src/pages/ui/ProductPageUI.tsx` — main PDP ✅ v4.4 (iniciales en social proof)
- `src/templates/EcommerceTemplate.tsx` — ✅ trust bar actualizado con +800 riders
- `src/pages/ui/CheckoutUI.tsx` — checkout ✅
- `src/components/StripePayment.tsx` — payment form ✅
- `src/lib/stripe-appearance.ts` — ✅
- `src/components/ProductExpressCheckout.tsx` — ✅
- `src/lib/country-codes.ts` — ✅
- `src/components/CartSidebar.tsx` — ✅
- `src/index.css` — design system
- `src/adapters/CheckoutAdapter.tsx` — ✅ isValidPhone fix
- `src/pages/ui/IndexUI.tsx` — ✅ precio actualizado a MX$799

## PENDING / Future Sessions
- Verificar que compare_at price esté en DB para que el badge "-20%" aparezca en producto
- Add a "También les encantó" section at bottom of cart/checkout (upsell)
- Consider a post-purchase email sequence (set up from Dashboard)
- Video testimonial section if user has video content
- Monitor conversion rate after PDP v4 deploy