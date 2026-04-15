# Rodata.mx — Plan

## Current State
Premium moto lumbar support PDP + Checkout dark-branded. Cart sidebar now dark-themed. Store is ready for paid traffic. Bug "Comprar Ahora → checkout vacío" corregido ✅

## Recent Changes
- Added urgency/stock signal above CTA on PDP
- Added security line below CTA buttons
- Full checkout dark rebrand
- Phone input autofill fix
- Cart Sidebar dark rebrand (DONE ✅)
- **BUG FIX: "Comprar Ahora" llegaba al checkout con carrito vacío** ✅
  - Fix en `src/adapters/CheckoutAdapter.tsx`
  - Agregado `checkout` y `hasItems` al destructure de `useCheckout()`
  - Nuevo `useEffect` con `hasAutoCreated` ref que auto-crea la orden backend cuando:
    - `isInitialized = true`, `hasActiveCheckout = false`, `hasItems = true`
  - Espeja exactamente lo que hace CartSidebar antes de navegar a `/pagar`

## Known Issues
- Other checkout inputs (email, name, address, etc.) may also show autofill in white if Chrome autofills them. Apply same pattern (inline style + dark-autofill class on raw `<input>`) if it becomes a problem.

## Key Files
- `src/pages/ui/ProductPageUI.tsx` — main PDP (urgency signal added)
- `src/pages/ui/CheckoutUI.tsx` — checkout (dark brand rebrand done ✅)
- `src/templates/EcommerceTemplate.tsx` — header/footer/nav
- `src/components/StripePayment.tsx` — payment form ✅
- `src/components/CountryPhoneSelect.tsx` — phone input ✅
- `src/components/CartSidebar.tsx` — cart lateral ✅ dark theme complete
- `src/index.css` — design system
- `src/adapters/CheckoutAdapter.tsx` — checkout logic ✅ auto-create fix applied
- `src/hooks/useCheckout.ts` — checkout hook with `checkout()` fn

---

## PENDING: Post-Launch (nice to have)
- Add a "También les encantó" section at bottom of cart/checkout (upsell)
- Consider a post-purchase email sequence (set up from Dashboard)
- Video testimonial section if user has video content