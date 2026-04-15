# Rodata.mx — Plan

## Current State
Premium moto lumbar support PDP + Checkout dark-branded. Cart sidebar now dark-themed. Store is ready for paid traffic.

## Recent Changes
- Added urgency/stock signal above CTA on PDP
- Added security line below CTA buttons
- Full checkout dark rebrand
- Phone input autofill fix
- Cart Sidebar dark rebrand (DONE ✅)

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
- `src/adapters/CheckoutAdapter.tsx` — checkout logic
- `src/hooks/useCheckout.ts` — checkout hook with `checkout()` fn

---

## 🐛 BUG FIX: "Comprar Ahora" llega al checkout con carrito vacío

### Root Cause
- **CartSidebar flow** (working): calls `checkout()` → creates backend order → saves to sessionStorage → navigates to `/pagar`
- **Buy Now flow** (broken): `handleBuyNow` in `HeadlessProduct.tsx` calls `addItem()` + `navigate('/pagar')` directly — never calls `checkout()` to create the backend order
- When CheckoutUI mounts, `hasActiveCheckout` is false → `useOrderItems` has no order to read from → shows empty

### Fix: Auto-create checkout in CheckoutAdapter
File: `src/adapters/CheckoutAdapter.tsx`

1. Add `checkout` and `hasItems` to the destructure from `useCheckout()` (line ~29-39):
   ```
   const {
     hasActiveCheckout,
     isInitialized,
     orderId,
     checkoutToken,
     checkout,        // ← ADD THIS
     hasItems,        // ← ADD THIS
     updateShippingAddress,
     ...
   } = useCheckout();
   ```

2. Add a new `useEffect` (place it right after the isInitialized tracking useEffect, around line 168):
   ```javascript
   const hasAutoCreated = useRef(false);
   
   useEffect(() => {
     if (!isInitialized) return;
     if (hasActiveCheckout) return;
     if (!hasItems) return;
     if (hasAutoCreated.current) return;
     hasAutoCreated.current = true;
     
     checkout({ currencyCode }).then((order) => {
       try {
         sessionStorage.setItem('checkout_order', JSON.stringify(order));
         sessionStorage.setItem('checkout_order_id', String(order.order_id));
       } catch {}
     }).catch((err) => {
       console.error('Auto-checkout creation failed:', err);
     });
   }, [isInitialized, hasActiveCheckout, hasItems]);
   ```

This mirrors exactly what CartSidebar does but triggered automatically when the checkout page loads with cart items but no active order.

Note: `currencyCode` is already available via `useSettings()` destructure at the top of `useCheckoutLogic`.

---

## PENDING: Post-Launch (nice to have)
- Add a "También les encantó" section at bottom of cart/checkout (upsell)
- Consider a post-purchase email sequence (set up from Dashboard)
- Video testimonial section if user has video content