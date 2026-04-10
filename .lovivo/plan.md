# Rodata.mx — Plan

## Current State
Premium moto lumbar support PDP + Checkout. Store is ready for paid traffic.

## Recent Changes
- Added urgency/stock signal above CTA on PDP: pulsing green dot + "En stock · Envío en 24–48 hrs"
- Added security line below CTA buttons: "🔒 Pago seguro · Envío gratis · 30 días de prueba"
- Full checkout dark rebrand: bg `#111315`, form panels `#1D2125`, inputs dark, font-sora headings, amber accents, security badge with Lock icon before Stripe, amber quantity badges, dark mobile summary
- Checkout INP/SEL_T/SEL_C/SEL_I utility constants for consistent dark styling

## Known Issues
- None currently

## Key Files
- `src/pages/ui/ProductPageUI.tsx` — main PDP (urgency signal added)
- `src/pages/ui/CheckoutUI.tsx` — checkout (dark brand rebrand done ✅)
- `src/templates/EcommerceTemplate.tsx` — header/footer/nav
- `src/components/ScrollLink.tsx` — handles anchor scroll logic

---

## PENDING: Post-Launch (nice to have)
- Add a "También les encantó" section at bottom of cart/checkout (upsell)
- Consider a post-purchase email sequence (set up from Dashboard)
- Video testimonial section if user has video content