# Rodata.mx — Plan

## Current State
Premium moto lumbar support PDP + Checkout dark-branded. Cart sidebar dark-themed. Store is ready for paid traffic.

## Recent Changes
- Added urgency/stock signal above CTA on PDP
- Added security line below CTA buttons
- Full checkout dark rebrand
- Phone input autofill fix
- Cart Sidebar dark rebrand (DONE ✅)
- **BUG FIX ATTEMPT: "Comprar Ahora" llegaba al checkout con carrito vacío** ← AÚN NO RESUELTO

## 🔴 BUG ACTIVO: "Comprar Ahora" → checkout vacío

### Root Cause (confirmado)
`handleBuyNow` en `HeadlessProduct.tsx`:
1. Llama `addItem()` → dispatch a `useReducer` → actualización de estado ASÍNCRONA
2. Llama `navigate('/pagar')` inmediatamente

Cuando el checkout page monta, `useCheckout.checkout()` lee `cart.items` desde el estado de React que aún no se actualizó → `cartItems.length === 0` → error "El carrito está vacío".

El fix previo en `CheckoutAdapter` (auto-create via useEffect) también falla porque cuando el effect corre, `cart.items` sigue vacío en el closure capturado.

### Fix Correcto

**Principio**: Construir los items del carrito MANUALMENTE desde variables locales (no desde cart state), crear la orden directamente, y guardar el estado completo via `saveCheckoutState` (localStorage).

#### Archivo 1: `src/hooks/useCheckout.ts`

Agregar nueva función `checkoutWithItems` que acepta `CartItem[]` directamente:

```ts
const checkoutWithItems = async (items: CartItem[], options: CheckoutOptions = {}): Promise<CheckoutResponse> => {
  setIsLoading(true)
  try {
    if (items.length === 0) throw new Error('El carrito está vacío')
    
    const order = await createCheckoutFromCart(
      items,
      options.customerInfo,
      options.discountCode,
      options.shippingAddress,
      options.billingAddress,
      options.notes,
      options.currencyCode || currencyCode
    )

    // Save to localStorage so checkout page has orderId/checkoutToken
    saveCheckoutState({
      order_id: order.order_id,
      checkout_token: order.checkout_token,
      store_id: STORE_ID,
      discount_code: options.discountCode,
      order: order.order
    })

    setLastOrder(order)
    
    // Handle unavailable items notification (same as checkout())
    if (order.unavailable_items && order.unavailable_items.length > 0) {
      toast({
        title: "Items out of stock",
        description: `${order.unavailable_items.length} item(s) removed from your order due to insufficient stock`,
        variant: "destructive",
      })
    }

    // Do NOT clearCart() — the item was not added to cart in Buy Now flow
    // (cart items from other products should remain)
    
    return order
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    if (errorMessage.includes("don't exist") || errorMessage.includes("not active")) {
      clearCart()
      toast({ title: "Carrito desactualizado", description: "Los productos ya no están disponibles.", })
    } else {
      toast({ title: "Error al procesar la orden", description: errorMessage, variant: "destructive" })
    }
    throw error
  } finally {
    setIsLoading(false)
  }
}
```

Add `checkoutWithItems` to the return object.

Import needed: `CartItem` from `@/contexts/CartContext` (may already be imported via `cartToApiItems` usage — check the existing imports in useCheckout).

#### Archivo 2: `src/components/headless/HeadlessProduct.tsx`

Changes:
1. Add import: `import { useCheckout } from '@/hooks/useCheckout'`
2. Add import: `import type { CartItem } from '@/contexts/CartContext'`  
3. Inside `useProductLogic()`, add: `const { checkoutWithItems } = useCheckout()`
4. Add state: `const [isBuyingNow, setIsBuyingNow] = useState(false)`
5. Rewrite `handleBuyNow` as async:

```ts
const handleBuyNow = async () => {
  if (!product) return
  
  const variants = (product as any).variants
  const hasVars = Array.isArray(variants) && variants.length > 0
  const variantToAdd = hasVars ? getMatchingVariant() : undefined
  
  if (hasVars && !variantToAdd) {
    toast({ title: "Selecciona opciones", description: "Elige una variante disponible." })
    return
  }
  
  const currentP = getCurrentPrice()
  
  // Track AddToCart
  trackAddToCart({
    products: [tracking.createTrackingProduct({
      id: product.id,
      title: product.title,
      price: currentP,
      category: 'product',
      variant: variantToAdd
    })],
    value: currentP * quantity,
    currency: tracking.getCurrencyFromSettings(currencyCode),
    num_items: quantity
  })
  
  setIsBuyingNow(true)
  try {
    // Build items manually from local variables — NO dependency on React cart state
    // This avoids the race condition where addItem() dispatch hasn't settled yet
    const buyNowItems: CartItem[] = [{
      key: `${product.id}${variantToAdd ? `:${variantToAdd.id}` : ''}${selectedPlan ? `:${selectedPlan.id}` : ''}`,
      type: 'product' as const,
      product,
      variant: variantToAdd,
      sellingPlan: selectedPlan || undefined,
      quantity,
    }]
    
    // Create order directly with explicit items + save state to localStorage
    await checkoutWithItems(buyNowItems, { currencyCode })
    navigate('/pagar')
  } catch (error) {
    // error already toasted in checkoutWithItems
    console.error('Buy Now error:', error)
  } finally {
    setIsBuyingNow(false)
  }
}
```

6. Add `isBuyingNow` to the return object (so UI can disable/show loading on "Comprar Ahora" button)

#### Archivo 3: `src/adapters/CheckoutAdapter.tsx` (minor cleanup)

The auto-create useEffect is now a safety net (handles edge cases). No changes strictly required, but optionally add a guard to check sessionStorage or hasActiveCheckout properly. The current code should work correctly because:
- After `checkoutWithItems` saves via `saveCheckoutState`, when checkout page loads `hasActiveCheckout = true`
- Auto-create effect: `if (hasActiveCheckout) return` → won't fire → no duplicate orders ✓

### Why This Works
- `handleBuyNow` is now async
- Items are built from LOCAL variables (product, variantToAdd, selectedPlan, quantity) — no React state reading
- `checkoutWithItems` calls `createCheckoutFromCart` immediately with those items
- `saveCheckoutState` writes to `localStorage[checkout:${STORE_ID}]` — when checkout page mounts, `useCheckoutState` reads this and `hasActiveCheckout = true`, `orderId` and `checkoutToken` are available
- Checkout page can then load order items from backend and process payment normally

## Known Issues
- Other checkout inputs (email, name, address, etc.) may also show autofill in white if Chrome autofills them.

## Key Files
- `src/pages/ui/ProductPageUI.tsx` — main PDP (urgency signal added)
- `src/pages/ui/CheckoutUI.tsx` — checkout (dark brand rebrand done ✅)
- `src/templates/EcommerceTemplate.tsx` — header/footer/nav
- `src/components/StripePayment.tsx` — payment form ✅
- `src/components/CountryPhoneSelect.tsx` — phone input ✅
- `src/components/CartSidebar.tsx` — cart lateral ✅ dark theme complete
- `src/index.css` — design system
- `src/adapters/CheckoutAdapter.tsx` — checkout logic
- `src/hooks/useCheckout.ts` — ← ADD checkoutWithItems HERE
- `src/hooks/useCheckoutState.ts` — manages localStorage state
- `src/components/headless/HeadlessProduct.tsx` — ← FIX handleBuyNow HERE

---

## PENDING: Post-Launch (nice to have)
- Add a "También les encantó" section at bottom of cart/checkout (upsell)
- Consider a post-purchase email sequence (set up from Dashboard)
- Video testimonial section if user has video content