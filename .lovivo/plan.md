# Rodata.mx — Plan

## Current State
Premium moto lumbar support PDP + Checkout dark-branded. Store is ready for paid traffic.

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
- `src/components/StripePayment.tsx` — payment form (needs dark theme fixes)
- `src/components/CountryPhoneSelect.tsx` — phone input (needs dark theme fixes)

---

## PENDING: Checkout Dark Theme Polish (NEXT TASK)

### Problem 1: Payment method badges — text invisible
In `StripePayment.tsx`, `PaymentMethodSelector` uses default light theme classes:
- `border-border hover:border-muted-foreground/30` for non-selected
- `border-primary bg-primary/5` for selected
- `text-muted-foreground` for description (invisible on dark)
- Icon has no explicit color

**Fix in `PaymentMethodSelector` component (StripePayment.tsx ~line 63-94):**
- Selected: `border-brand-amber bg-brand-amber/5`
- Non-selected: `border-white/[0.12] hover:border-white/[0.25]`
- Label text: add `text-brand-offwhite`
- Description text: `text-brand-steel`
- Icon: add `text-brand-offwhite`
- Radio `accent-primary` → `accent-amber-400`
- Whole label bg: add `bg-[#111315]`

### Problem 2: CountryPhoneSelect — white background
In `CountryPhoneSelect.tsx`, the phone flag/code trigger button uses `bg-muted hover:bg-muted/80` and the Input uses default bg. Both appear white on the dark checkout.

**Fix in `CountryPhoneSelect.tsx`:**
- Button trigger: `bg-[#0d0f11] hover:bg-white/[0.06] border-white/[0.15] text-brand-offwhite` (remove `bg-muted hover:bg-muted/80`)
- ChevronDown icon: `text-brand-steel`
- Phone code span: `text-brand-offwhite`
- Input (phone number): add dark theme classes: `bg-[#0d0f11] border-white/[0.15] text-brand-offwhite placeholder:text-brand-steel`
- Loading state: `bg-[#0d0f11]` instead of `bg-muted`
- Keep validation error border-red-500 for errors

### Problem 3: Stripe card / OXXO / SPEI panels — white card background
In `StripePayment.tsx`, the payment detail panels use `bg-background` (white).

**Fix Card form panel (~line 498-536):**
- `Card` component: add `bg-[#111315] border-white/[0.12]`
- Selected circle indicator: `border-primary bg-primary` → `border-brand-amber bg-brand-amber`
- "Tarjeta de crédito" span: add `text-brand-offwhite`
- Cardholder label: `text-muted-foreground` → `text-brand-steel`
- Cardholder `<input>`: `bg-background` → `bg-[#0d0f11] border border-white/[0.15] text-brand-offwhite placeholder:text-brand-steel focus:ring-brand-amber/20 focus:border-brand-amber/40`
- CardElement container div: `bg-background border` → `bg-[#0d0f11] border border-white/[0.15]`
- `CardElement` style options: `color: '#e8eaed'`, `::placeholder.color: '#6b7280'`, `iconColor: '#9ca3af'`

**Fix OXXO panel (~line 539-556):**
- `Card`: add `bg-[#111315] border-white/[0.12]`
- `Store` icon: `text-primary` → `text-brand-amber`
- Title "Pago en efectivo en OXXO": add `text-brand-offwhite`
- Description `text-muted-foreground` → `text-brand-steel`
- `strong` inside: `text-brand-offwhite`

**Fix SPEI panel (~line 558-576):**
- Same as OXXO: `Card` dark bg, `Building2` icon `text-brand-amber`, title `text-brand-offwhite`, descriptions `text-brand-steel`

### Problem 4: Security text and footer text
- Top security line (~line 486): `text-muted-foreground` → `text-brand-steel`
- Footer legal text (~line 596): `text-muted-foreground` → `text-brand-steel`, link `hover:text-foreground` → `hover:text-brand-offwhite`

### Problem 5: Submit button
Currently: `w-full h-12 text-lg font-semibold` (inherits default/white bg)
Fix: add `bg-brand-amber text-brand-carbon hover:bg-brand-amber/90 font-sora`

---

## PENDING: Post-Launch (nice to have)
- Add a "También les encantó" section at bottom of cart/checkout (upsell)
- Consider a post-purchase email sequence (set up from Dashboard)
- Video testimonial section if user has video content