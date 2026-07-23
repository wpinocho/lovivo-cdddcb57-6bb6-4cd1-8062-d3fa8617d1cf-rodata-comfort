# Rodata.mx — Plan

## Brand & Context
- Marca premium de soporte lumbar para motociclistas mexicanos
- Producto único: Rodata One — soporte lumbar para motociclistas
- Precio: MX$799 (compare_at: MX$999, 20% OFF)
- Tono: directo, técnico-emocional, sin fluff. Habla como rider, no como médico.
- Audiencia: motociclistas MX que hacen trayectos medios/largos y sufren dolor lumbar
- Store en producción: rodata.store
- **Dos repos hermanos**: Rodata US y Rodata MX. Agente solo tiene acceso a MX. Features probadas en US se portan a MX.

## Design System
- Dark theme: #111315 (fondo), #1D2125 (secciones alternas), #2A2E34 (graphite)
- Amber: #C98B2E (brand-amber) — único acento
- Typography: Sora (headings/bold), Inter (body/UI)
- Botones: btn-amber-lg (primario), btn-outline-light (secundario)
- Imágenes Supabase: usar `render/image/public` path + `?width=xxx&quality=75`
- **Avatar rule**: círculos de 36px → Supabase `?width=72&height=72&resize=cover&quality=80`

## Active Plan — PAYPAL PORTADO A MX ✅ (2026-07-23) — falta prueba real de checkout
El port US→MX quedó IMPLEMENTADO. Pendiente: probar un checkout real con PayPal en producción (botón aparece → completar pago → validar redirect `/thank-you/{id}` + Purchase sin duplicar).

### Confirmado por el usuario
- PayPal YA activado/configurado para Rodata MX en Dashboard.
- Cuenta PayPal acepta MXN.
- Eligió **Opción A**: portar `getAttributionPayload` (hecho).

### Cómo lee MX la config PayPal (igual que US)
RPC `supabase.rpc('get_public_paypal_account', { p_store_id: STORE_ID }).maybeSingle()` → fila con `client_id` + `environment`.
- `paypalEnabled = !!paypalRow`
- `paypalClientId = paypalRow?.client_id ?? null`
- `paypalEnvironment = paypalRow?.environment ?? 'live'`
NO se tocó `store_settings` ni `supabase.ts` (types casteados a any).

### Cambios aplicados (todos hechos)
- `package.json`: + `@paypal/react-paypal-js`
- `SettingsContext.tsx`: interface (paypalEnabled/ClientId/Environment) + 3er useQuery RPC + isLoading + derivados + provider value ✅
- `tracking-utils.ts`: `getAttributionPayload` añadido al final (export nombrado) ✅
- `PaypalExpressButton.tsx`: CREADO. Copy ES-MX (divider "o paga con", toasts "Error de PayPal"/"Algo salió mal…"/"El pago no se completó"). Usa currency en minúsculas ('mxn'). Quitados los console.log de debug de US. ✅
- `CheckoutUI.tsx`: import + botón insertado ANTES de `<StripePayment>` dentro de fragment `<>...</>`. Props: className="mb-3", showDivider={false}, orderId, checkoutToken, amount=logic.finalTotal, currency=logic.currencyCode.toLowerCase(), items=logic.orderItems, shippingCost=logic.shippingFromCheckout||logic.shippingCost ✅

## Recent Changes
- **PayPal Express portado US→MX — IMPLEMENTADO** ✅ (2026-07-23) — dep instalada; SettingsContext con RPC get_public_paypal_account; getAttributionPayload portado (Opción A); PaypalExpressButton.tsx creado con copy ES-MX + currency mxn; botón insertado en CheckoutUI antes de Stripe. FALTA prueba real de checkout.
- **Nav + footer: "Rastrear pedido" agregado** ✅ (2026-06-24)
- **Order Tracking — frontend completo** ✅ (2026-06-24)
- **Footer WhatsApp link corregido** ✅ (2026-06-24) — +52 55 3121 5386
- **BUG FIX: Sticky bar no aparece en PDP — RESUELTO ✅** (2026-06-18)
- **Fix conversiones duplicadas Meta** ✅ (2026-06-18)
- **Checkout bottom section v2** ✅ (2026-06-15)
- **Badge descuento half-outside + precio tachado dinámico** ✅ (2026-06-15)
- **PDP MX v4 — 8 mejoras sincronizadas del repo US** ✅ (2026-06-15)
- **Precio actualizado: MX$699 → MX$799** ✅

## Image Inventory
- LIFESTYLE_CITY: `/pdp-lifestyle-1.jpg`
- LIFESTYLE_HIGHWAY: `render/image/public/message-images/.../1775768374485-uca4dkx21g.webp?width=1200&quality=75` ✅
- FEAT_IMG_1-3: `render/image/public/message-images/.../1775777133671/72-*.webp?width=800&quality=75` ✅
- REVIEW_IMG_1-5: `render/image/public/product-images/.../review-1-5.webp?width=600&quality=75` ✅
- AVATAR_*: `product-images/.../avatar-carlos-v3.webp?width=72&height=72&resize=cover&quality=80` ✅

## Known Issues
- **PayPal MX — falta prueba real (2026-07-23)**: implementación completa pero NO probada en checkout real. Verificar: (1) el botón PayPal aparece encima de Stripe cuando hay checkoutToken; (2) el pago completa y redirige a /thank-you/{id}; (3) Purchase no se duplica (guard sessionStorage purchase_tracked_{ordId}); (4) las edge functions paypal-create-order/paypal-capture-order existen y responden en el backend MX.
- **Order Tracking — view orders_customer**: CTA "Rastrear pedido" + entrega estimada dependen de que la VIEW `orders_customer` exponga checkout_token/tracking_number/tracking_url/estimated_delivery_at. Guards condicionales protegen.
- Chrome autofill puede pintar inputs del checkout en blanco (workaround CSS aplicado)

## Key Files
- `src/contexts/SettingsContext.tsx` — settings store + RPC paypal ✅
- `src/pages/ui/CheckoutUI.tsx` — checkout; PaypalExpressButton insertado antes de StripePayment ✅
- `src/components/PaypalExpressButton.tsx` — botón PayPal Express ✅ (copy ES-MX)
- `src/components/StripePayment.tsx` — pago Stripe
- `src/lib/tracking-utils.ts` — trackPurchase/tracking + getAttributionPayload ✅
- `src/lib/edge.ts` — helper callEdge (paypal-create/capture-order)
- `src/pages/ui/ProductPageUI.tsx` — main PDP ✅ v4.7
- `src/templates/EcommerceTemplate.tsx` — trust bar + WhatsApp + nav "Rastrear pedido"
- `src/index.css` — design system

## PENDING / Future Sessions
- **PayPal**: probar checkout real en producción (ver Known Issues). Confirmar que las edge functions paypal-* estén desplegadas para el store MX.
- Verificar response real de order-track con token de producción
- "También les encantó" upsell en cart/checkout
- Post-purchase email sequence (Dashboard)