# Rodata.mx — Plan

## Current State
Premium moto lumbar support PDP + Checkout dark-branded. Store is ready for paid traffic.

## Recent Changes
- Added urgency/stock signal above CTA on PDP: pulsing green dot + "En stock · Envío en 24–48 hrs"
- Added security line below CTA buttons: "🔒 Pago seguro · Envío gratis · 30 días de prueba"
- Full checkout dark rebrand: bg `#111315`, form panels `#1D2125`, inputs oscuros, font-sora headings, amber accents, security badge with Lock icon before Stripe, amber quantity badges, dark mobile summary
- **Checkout dark polish (DONE ✅):** all panels, badges, OXXO/SPEI, card panel fully dark
- **Phone input autofill definitive fix (DONE ✅):**
  - Root cause 1: `Input` shadcn component has `bg-background` (light cream) that can conflict with `bg-[#0d0f11]` via class merging
  - Root cause 2: `.dark-autofill` inside `@layer utilities` — in CSS cascade layers, `!important` inside a layer has LOWER priority than `!important` in global (unlayered) CSS, including browser UA autofill styles
  - Fix 1: Replaced shadcn `<Input>` with raw `<input>` tag + `style={{ backgroundColor: '#0d0f11', color: '#F5F7F8' }}` — inline styles always win for non-autofill state
  - Fix 2: Moved `input.dark-autofill:-webkit-autofill` CSS rule OUTSIDE of `@layer utilities` to global scope, with higher specificity selector `input.dark-autofill`
  - Added `autoComplete="tel"` for proper browser autofill UX

## Known Issues
- Other checkout inputs (email, name, address, etc.) may also show autofill in white if Chrome autofills them. Apply same pattern (inline style + dark-autofill class on raw `<input>`) if it becomes a problem.

## Key Files
- `src/pages/ui/ProductPageUI.tsx` — main PDP (urgency signal added)
- `src/pages/ui/CheckoutUI.tsx` — checkout (dark brand rebrand done ✅)
- `src/templates/EcommerceTemplate.tsx` — header/footer/nav
- `src/components/ScrollLink.tsx` — handles anchor scroll logic
- `src/components/StripePayment.tsx` — payment form ✅ dark theme complete
- `src/components/CountryPhoneSelect.tsx` — phone input ✅ raw `<input>` + inline style + global dark-autofill rule
- `src/index.css` — design system; `input.dark-autofill` rule is GLOBAL (outside @layer)

---

## PENDING: Post-Launch (nice to have)
- Add a "También les encantó" section at bottom of cart/checkout (upsell)
- Consider a post-purchase email sequence (set up from Dashboard)
- Video testimonial section if user has video content