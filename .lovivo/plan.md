# Rodata.mx — Plan

## Brand & Context
- Marca premium de soporte lumbar para motociclistas mexicanos
- Producto único: Rodata One — soporte lumbar para motociclistas
- Precio: MX$799 (compare_at: MX$999, 20% OFF)
- Tono: directo, técnico-emocional, sin fluff. Habla como rider, no como médico.
- Audiencia: motociclistas MX que hacen trayectos medios/largos y sufren dolor lumbar
- Store en producción: rodata.store
- **Dos repos hermanos**: Rodata US y Rodata MX. Agente solo tiene acceso a MX. Features probadas en US se portan a MX. PayPal ya vive en US, ahora toca portarlo a MX.

## Design System
- Dark theme: #111315 (fondo), #1D2125 (secciones alternas), #2A2E34 (graphite)
- Amber: #C98B2E (brand-amber) — único acento
- Typography: Sora (headings/bold), Inter (body/UI)
- Botones: btn-amber-lg (primario), btn-outline-light (secundario)
- Imágenes Supabase: usar `render/image/public` path + `?width=xxx&quality=75`
- **Avatar rule**: círculos de 36px → Supabase `?width=72&height=72&resize=cover&quality=80`

## Active Plan — PORTAR PAYPAL DE RODATA US A MX (EN PROGRESO — enfoque CORREGIDO)

### Objetivo
Añadir botón "PayPal Express" en el checkout de Rodata MX, replicando la implementación probada en Rodata US. Aparece encima de Stripe y NO requiere llenar el formulario (PayPal recolecta el envío en su popup).

### ✅ CONFIRMADO por el usuario (2026-07-23)
- PayPal YA está activado/configurado para Rodata MX en el Dashboard.
- La cuenta PayPal acepta cobros en MXN.

### 🔑 CORRECCIÓN CLAVE — cómo lee US la config de PayPal
Mi plan anterior asumía columnas paypal en `store_settings`. **FALSO.** US usa un **RPC**:
```
supabase.rpc('get_public_paypal_account', { p_store_id: STORE_ID }).maybeSingle()
```
Devuelve una fila con `client_id` y `environment`. Derivados:
- `paypalEnabled = !!paypalRow`
- `paypalClientId = (paypalRow as any)?.client_id ?? null`
- `paypalEnvironment = ((paypalRow as any)?.environment ?? 'live') as 'live' | 'sandbox'`
→ NO se toca el `.select()` de `store_settings`. NO se tocan columnas.

### Estado archivo por archivo (verificado 2026-07-23)
- **`src/lib/supabase.ts`**: ✅ IDÉNTICO al de US. US **no** agregó campos paypal a los types (castea a `any`). **CERO cambios necesarios.**
- **`src/contexts/SettingsContext.tsx`** (MX): idéntico a US salvo PayPal. Cambios EXACTOS a aplicar:
  1. Interface `SettingsContextType`: añadir tras `chargeType`:
     ```
     paypalEnabled: boolean
     paypalClientId: string | null
     paypalEnvironment: 'sandbox' | 'live' | null
     ```
  2. Añadir 3er useQuery (después del de `platform_stores`):
     ```
     const { data: paypalRow, isLoading: isLoadingPaypal } = useQuery({
       queryKey: ['paypal-account', STORE_ID],
       queryFn: async () => {
         const { data, error } = await (supabase
           .rpc('get_public_paypal_account', { p_store_id: STORE_ID }) as any)
           .maybeSingle()
         if (error) { console.warn('[PayPal RPC] Error:', error); return null }
         return data
       },
       staleTime: 60000, retry: 1
     })
     ```
  3. `const isLoading = isLoadingSettings || isLoadingPlatform || isLoadingPaypal`
  4. Derivados (tras `chargeType`):
     ```
     const paypalEnabled = !!paypalRow
     const paypalClientId = (paypalRow as any)?.client_id ?? null
     const paypalEnvironment = ((paypalRow as any)?.environment ?? 'live') as 'live' | 'sandbox'
     ```
  5. Añadir `paypalEnabled, paypalClientId, paypalEnvironment` al value del Provider.
  (Los console.log de debug de US son opcionales; omitir en prod o dejar 1 mínimo.)
- **`src/lib/tracking-utils.ts`** (MX): ❌ `getAttributionPayload` NO existe (verificado: 0 coincidencias). El PaypalExpressButton de US lo usa. Decisión pendiente:
  - **Opción A**: portar `getAttributionPayload` desde tracking-utils de US (requiere que el usuario mande esa función).
  - **Opción B (más simple, preferida si no usan atribución en el resto)**: quitar las llamadas a `getAttributionPayload()` del botón y no enviar `attribution` (backend lo trata como opcional).
- **`src/components/PaypalExpressButton.tsx`** (MX): ❌ NO existe. Hay que CREARLO. ⚠️ **El código que mandó el usuario vino TRUNCADO** ("[...contenido intermedio omitido...]"). FALTA recibir el archivo COMPLETO. Ajustes ES-MX al portar: divider "or pay with"→"o paga con"; toasts "PayPal error"→"Error de PayPal", "Something went wrong..."→"Algo salió mal. Intenta de nuevo.", "Payment not completed"→"El pago no se completó". Currency: pasar `logic.currencyCode.toLowerCase()` (= 'mxn').
- **`src/pages/ui/CheckoutUI.tsx`** (MX): añadir import de PaypalExpressButton e insertarlo ANTES de `<StripePayment>` (envolver en fragment `<>...</>`), con props: className="mb-2", showDivider={false}, orderId, checkoutToken, amount=finalTotal, currency=currencyCode.toLowerCase(), items=orderItems, shippingCost. (Confirmar nombres exactos de estas vars en el logic de CheckoutUI MX al implementar.)

### FALTA RECIBIR del usuario ANTES de crear el botón
1. **`src/components/PaypalExpressButton.tsx` de US — COMPLETO** (el anterior vino cortado). CRÍTICO.
2. (Solo si eligen Opción A) la función `getAttributionPayload` del tracking-utils de US.

### Pasos de implementación (Craft Mode) — orden
1. `lov-add-dependency @paypal/react-paypal-js`.
2. Editar `SettingsContext.tsx` (interface + 3er useQuery RPC + isLoading + derivados + provider value).
3. Decidir A/B para getAttributionPayload.
4. Crear `PaypalExpressButton.tsx` (copia US completa + copy ES-MX + currency mxn).
5. Editar `CheckoutUI.tsx`: import + insertar botón antes de StripePayment en fragment.
6. Probar checkout real: botón aparece (PayPal ya activo en Dashboard) → completar pago → validar redirect `/thank-you/{id}` + Purchase sin duplicar.

### Archivos a tocar
- `package.json` (vía lov-add-dependency) — @paypal/react-paypal-js
- `src/contexts/SettingsContext.tsx` — RPC paypal + exponer config
- `src/components/PaypalExpressButton.tsx` — CREAR (falta código completo de US)
- `src/pages/ui/CheckoutUI.tsx` — import + insertar botón
- (posible) `src/lib/tracking-utils.ts` — solo si Opción A para getAttributionPayload
- `src/lib/supabase.ts` — SIN cambios

## Recent Changes
- **PayPal port US→MX — enfoque corregido (RPC), esperando botón completo** ⏳ (2026-07-23) — recibido SettingsContext+supabase.ts de US; descubierto que PayPal se lee vía RPC `get_public_paypal_account` (no columnas); supabase.ts sin cambios; getAttributionPayload NO existe en MX (decidir A/B); FALTA PaypalExpressButton.tsx completo (vino truncado); PayPal ya activo en Dashboard MX + acepta MXN
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
- **PayPal MX — pendientes del port (2026-07-23)**: (1) FALTA el PaypalExpressButton.tsx completo de US (llegó truncado). (2) `getAttributionPayload` no existe en MX — decidir portarlo (A) o quitarlo del botón (B). (3) Config Dashboard ya OK (PayPal activo + MXN confirmado por usuario).
- **Order Tracking — view orders_customer**: CTA "Rastrear pedido" + entrega estimada en /mis-pedidos dependen de que la VIEW `orders_customer` exponga checkout_token/tracking_number/tracking_url/estimated_delivery_at. Guards condicionales protegen. /orders/track/:token NO depende de esto.
- Chrome autofill puede pintar inputs del checkout en blanco (workaround CSS aplicado)

## Key Files
- `src/contexts/SettingsContext.tsx` — settings store; añadir RPC paypal
- `src/pages/ui/CheckoutUI.tsx` — checkout; insertar PaypalExpressButton antes de StripePayment
- `src/components/StripePayment.tsx` — pago Stripe (ya usa trackPurchase/tracking)
- `src/lib/tracking-utils.ts` — trackPurchase/tracking ✅; getAttributionPayload ❌ no existe
- `src/lib/edge.ts` — helper callEdge (paypal-create/capture-order)
- `src/lib/supabase.ts` — types; SIN cambios para paypal
- `src/pages/OrderTrack.tsx` / `src/pages/ui/OrderTrackUI.tsx` — rastreo pedidos ✅
- `src/pages/ui/ProductPageUI.tsx` — main PDP ✅ v4.7
- `src/templates/EcommerceTemplate.tsx` — trust bar + WhatsApp + nav "Rastrear pedido"
- `src/index.css` — design system

## PENDING / Future Sessions
- **PayPal**: recibir PaypalExpressButton.tsx completo de US → implementar en Craft Mode (SettingsContext ya listo para replicar)
- Verificar response real de order-track con token de producción
- "También les encantó" upsell en cart/checkout
- Post-purchase email sequence (Dashboard)