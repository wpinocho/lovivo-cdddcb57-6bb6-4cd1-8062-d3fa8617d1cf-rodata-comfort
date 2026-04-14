# Rodata.mx — Plan

## Current State
Premium moto lumbar support PDP + Checkout dark-branded. Store is ready for paid traffic.

## Recent Changes
- Added urgency/stock signal above CTA on PDP: pulsing green dot + "En stock · Envío en 24–48 hrs"
- Added security line below CTA buttons: "🔒 Pago seguro · Envío gratis · 30 días de prueba"
- Full checkout dark rebrand: bg `#111315`, form panels `#1D2125`, inputs oscuros, font-sora headings, amber accents, security badge with Lock icon before Stripe, amber quantity badges, dark mobile summary
- **Checkout dark polish (DONE ✅):**
  - `PaymentMethodSelector` badges: border `brand-amber`/`white/12%`, labels `text-brand-offwhite`, descriptions `text-brand-steel`, radio `accent-amber-400`, bg `#111315`
  - Security text: `text-brand-steel`
  - Card panel `bg-[#111315]`: circle `brand-amber`, cardholder input dark (`#0d0f11`), CardElement dark (`color: #e8eaed`, placeholder `#6b7280`)
  - OXXO panel `bg-[#111315]`: icon `text-brand-amber`, title `text-brand-offwhite`, text `text-brand-steel`
  - SPEI panel: same treatment as OXXO
  - Submit button: `bg-brand-amber text-brand-carbon`
  - Footer legal text: `text-brand-steel`
  - `CountryPhoneSelect`: button trigger AND phone input BOTH `bg-[#0d0f11] border-white/[0.15] text-brand-offwhite`, placeholder `text-brand-steel`, focus `border-brand-amber/50` ✅ FIXED
- **Browser autofill fix (DONE ✅):**
  - Root cause: Chrome autofill ignores `background-color` CSS, only respects `box-shadow inset`
  - Fix: Added `.dark-autofill` CSS utility class in `index.css` using `-webkit-box-shadow: 0 0 0 1000px #0d0f11 inset !important` + `-webkit-text-fill-color: #F5F7F8`
  - Applied `.dark-autofill` to phone number Input in `CountryPhoneSelect.tsx` (both loading and normal state)

## Known Issues
- Other checkout inputs (email, name, address, etc.) could also show autofill in white if Chrome autofills them — apply `.dark-autofill` class to those inputs too if it becomes a problem

## Key Files
- `src/pages/ui/ProductPageUI.tsx` — main PDP (urgency signal added)
- `src/pages/ui/CheckoutUI.tsx` — checkout (dark brand rebrand done ✅)
- `src/templates/EcommerceTemplate.tsx` — header/footer/nav
- `src/components/ScrollLink.tsx` — handles anchor scroll logic
- `src/components/StripePayment.tsx` — payment form ✅ dark theme complete
- `src/components/CountryPhoneSelect.tsx` — phone input ✅ dark theme + autofill fix complete
- `src/index.css` — design system + `.dark-autofill` utility class

---

## PENDING: Post-Launch (nice to have)
- Add a "También les encantó" section at bottom of cart/checkout (upsell)
- Consider a post-purchase email sequence (set up from Dashboard)
- Video testimonial section if user has video content