# Rodata.mx — Plan

## Current State
Premium moto lumbar support PDP. Store is live and looking great.

## Recent Changes
- Fixed ScrollLink to handle hash-only hrefs (`#section`) — now scrolls within current page regardless of pathname
- Fixed navLinks prop wiring in EcommerceTemplate (was ignoring the prop)
- PDP navLinks: "Por qué funciona" → `#por-que-funciona`, "Opiniones" → `#opiniones`, "FAQ" → `#faq`
- WhatsApp number updated to +52 55 3121 5386
- Hero description: "El soporte confiado por los motociclistas mexicanos diseñado para eliminar el dolor de espalda"
- Removed all em-dashes from copy
- Merged "En tres pasos" + "Compra sin riesgo" into "Listo en segundos. Sin riesgo."

## Known Issues
- None currently

## Key Files
- `src/pages/ui/ProductPageUI.tsx` — main PDP
- `src/pages/ui/CheckoutUI.tsx` — checkout (needs brand redesign)
- `src/templates/EcommerceTemplate.tsx` — header/footer/nav
- `src/components/ScrollLink.tsx` — handles anchor scroll logic

---

## PENDING: Pre-Launch CRO Improvements

### Priority 1 — URGENCY on PDP (HIGH IMPACT, easy)
Add a stock scarcity indicator near the CTA buttons in `ProductPageUI.tsx`.

**What to add** — just above the CTA block (the `ref={ctaRef}` div):
```tsx
{/* Urgency / Stock signal */}
{logic.inStock && (
  <div className="flex items-center gap-2 text-xs font-inter text-brand-smoke">
    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
    <span>En stock · Envío en 24–48 hrs</span>
  </div>
)}
```

Also add below the "Comprar ahora" button a subtle urgency line like:
```tsx
<p className="text-brand-steel text-[11px] font-inter text-center">
  🔒 Pago seguro · Envío gratis · 30 días de prueba
</p>
```

### Priority 2 — CHECKOUT REBRAND (HIGH IMPACT, medium work)
The checkout currently uses the default light/white Shadcn theme (`bg-background`, `bg-card`, `bg-muted`). 
After the dark premium PDP, this creates a jarring brand disconnect that kills trust and conversion.

**Goal**: Make checkout feel like the same brand — dark bg, amber accents, Sora headings.

**Changes to `CheckoutUI.tsx`**:

1. Main wrapper: `bg-[#111315]` (replace `bg-background`)
2. Header: `bg-[#111315] border-b border-white/[0.08]`
3. Form card: `bg-[#1D2125] border border-white/[0.08]` (replace `bg-card`)
4. Order summary sidebar: `bg-[#1D2125] border border-white/[0.08]` (replace `bg-muted`)
5. Section titles (`h2`, `h3`): `text-brand-offwhite font-sora`
6. Input fields: dark bg `bg-[#111315] border-white/[0.15] text-brand-offwhite placeholder:text-brand-steel`
7. Select triggers: same dark treatment
8. Order summary items: use `text-brand-smoke`, `text-brand-offwhite`
9. Total row: `text-brand-offwhite font-sora font-bold`
10. Mobile summary button: dark bg treatment
11. Add security badge just above (or around) the payment section:
```tsx
<div className="flex items-center gap-2 text-brand-steel text-[11px] font-inter mb-3">
  <Lock size={11} className="text-brand-amber" />
  Pago 100% seguro · Cifrado SSL · Procesado por Stripe
</div>
```
Import `Lock` from lucide-react.

12. Discount input + button: dark styled
13. Checkbox labels: `text-brand-smoke`

**Mobile summary**: same dark treatment for `MobileOrderSummary`.

### Priority 3 — NICE TO HAVE (post-launch)
- Add a "También les encantó" section at bottom of cart/checkout (upsell) 
- Consider a post-purchase email sequence (set up from Dashboard)
- Video testimonial section if user has video content