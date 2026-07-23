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

## Active Plan — PORTAR PAYPAL DE RODATA US A MX (EN PROGRESO)

### Objetivo
Añadir botón "PayPal Express" en el checkout de Rodata MX, replicando exactamente la implementación ya probada en Rodata US. El botón aparece encima de Stripe (GPay/Link) y NO requiere que el usuario llene el formulario (PayPal recolecta la dirección de envío dentro de su popup).

### Diagnóstico del repo MX (2026-07-23) — qué EXISTE y qué FALTA
- **PACKAGE `@paypal/react-paypal-js`**: ❌ NO instalado en MX. (Ver `package.json` — no aparece). Craft Mode debe instalarlo con lov-add-dependency.
- **`src/components/PaypalExpressButton.tsx`**: ❌ NO existe en MX (cero referencias "paypal" en todo `src/`). Hay que CREARLO copiando el de US, con estos ajustes de copy ES-MX:
  - Divider label `"or pay with"` → `"o paga con"`
  - Toasts `title: 'PayPal error'` → `'Error de PayPal'`; description `'Something went wrong. Please try again.'` → `'Algo salió mal. Intenta de nuevo.'` y `'Payment not completed'` → `'El pago no se completó'`.
  - **currency**: en US se pasa `'usd'`; en MX se pasará `logic.currencyCode.toLowerCase()` = `'mxn'`. PayPal soporta MXN. Verificar que la cuenta PayPal de la tienda acepte MXN (config Dashboard/PayPal). Todo lo demás del componente queda IGUAL.
- **`src/contexts/SettingsContext.tsx`** (MX): ❌ NO expone `paypalEnabled`, `paypalClientId`, `paypalEnvironment`, y el `.select(...)` de `store_settings` NO incluye columnas de PayPal. Hay que:
  1. Añadir las columnas de PayPal al `.select('... , paypal_...')` de `fetchStoreSettings` (⚠️ NOMBRES EXACTOS de columnas los da el SettingsContext de US — ver "Falta recibir" abajo).
  2. Añadir `paypalEnabled: boolean`, `paypalClientId: string | null`, `paypalEnvironment: string | null` a la interface `SettingsContextType` y al value del Provider.
  3. Añadir defaults en el fallback del catch.
  - StoreSettings/PaymentMethods types en `src/lib/supabase.ts` quizá necesiten los campos paypal (opcional, para tipado). Confirmar contra el supabase.ts de US si difiere.
- **`src/pages/ui/CheckoutUI.tsx`** (MX): estructura casi idéntica a US pero SIN PayPal. Hay que:
  1. Añadir import `import { PaypalExpressButton } from "@/components/PaypalExpressButton";` (junto al import de StripePayment, línea ~14).
  2. En el bloque de pago (dentro del IIFE `return (...)` que hoy devuelve solo `<StripePayment .../>` en línea ~260-261), envolver en `<>...</>` e insertar el botón PayPal ANTES de `<StripePayment>`, exactamente así:
     ```
     return (
       <>
       <PaypalExpressButton
         className="mb-2"
         showDivider={false}
         orderId={logic.orderId}
         checkoutToken={logic.checkoutToken}
         amount={logic.finalTotal}
         currency={logic.currencyCode.toLowerCase()}
         items={logic.orderItems}
         shippingCost={logic.shippingCost}
       />
       <StripePayment ... />   // (dejar el StripePayment MX tal cual está)
       </>
     );
     ```
  - NOTA: el `return (<StripePayment .../>)` de MX está en el IIFE de líneas ~260-330. Solo envolver en fragment y anteponer el botón. No tocar props de StripePayment.
- **`src/hooks/useCheckout.ts`** (MX): NO requiere cambios para PayPal. El botón NO depende de useCheckout. (US lo mandó como contexto; su única diferencia real con MX es que US pasa `getAttributionPayload()` a `createCheckoutFromCart` — eso es una mejora de atribución independiente de PayPal, NO portar en esta tarea salvo que se decida aparte.)
- **`src/lib/tracking-utils.ts`** (MX): `trackPurchase` y `tracking` ✅ existen (StripePayment MX ya los importa). ⚠️ `getAttributionPayload` — VERIFICAR que esté exportado en MX (el useCheckout de MX NO lo importa, a diferencia de US). El PaypalExpressButton lo usa. Si NO existe en MX:
  - Opción A: portar `getAttributionPayload` desde tracking-utils de US.
  - Opción B (más simple): quitar las 2 llamadas a `getAttributionPayload()` del botón y no enviar `attribution` (el backend lo trata como opcional). Preferir A si el resto del sitio ya usa atribución; si no, B.
- **Backend / Edge functions** `paypal-create-order` y `paypal-capture-order`: son funciones del backend compartido de Lovivo. El botón las llama vía `callEdge`. ⚠️ REQUISITO EXTERNO: la tienda Rodata MX debe tener PayPal CONFIGURADO y ACTIVADO en el Dashboard (client_id + secret + enabled en `store_settings`). Si `paypalEnabled` o `paypalClientId` vienen vacíos, el botón simplemente NO se renderiza (el componente hace `if (!paypalEnabled || !paypalClientId || !checkoutToken) return null`). Esto es un paso de configuración en el Dashboard, no de código.

### Falta recibir del usuario (Rodata US) ANTES de implementar
1. **`src/contexts/SettingsContext.tsx` de Rodata US** — CRÍTICO. Necesito los NOMBRES EXACTOS de las columnas de `store_settings` (o `platform_stores`) donde se leen `paypalEnabled` / `paypalClientId` / `paypalEnvironment`, y la lógica exacta de fetch. Sin esto no puedo replicar el SettingsContext con seguridad.
2. (Opcional) `src/lib/supabase.ts` de US si añadieron campos paypal a los types `StoreSettings` / `PaymentMethods`.

### Confirmaciones de configuración (Dashboard, no código)
- ¿PayPal ya está activado/configurado (client_id + secret) para Rodata MX en el Dashboard? Sin esto el botón no aparecerá aunque el código esté perfecto.
- ¿La cuenta PayPal acepta cobros en MXN?

### Pasos de implementación (Craft Mode) — orden sugerido
1. `lov-add-dependency @paypal/react-paypal-js`.
2. Actualizar `SettingsContext.tsx` (select + interface + provider + fallback) según el US recibido.
3. (Si aplica) actualizar types en `src/lib/supabase.ts`.
4. Verificar/portar `getAttributionPayload` en tracking-utils.
5. Crear `src/components/PaypalExpressButton.tsx` (copia de US con copy ES-MX + currency mxn).
6. Editar `CheckoutUI.tsx`: import + insertar botón antes de StripePayment en fragment.
7. Probar con checkout real: el botón debe aparecer solo si PayPal está activo en Dashboard; completar un pago sandbox y validar redirect a `/thank-you/{id}` + Purchase tracking sin duplicar.

### Archivos a tocar
- `package.json` (vía lov-add-dependency) — add @paypal/react-paypal-js
- `src/contexts/SettingsContext.tsx` — exponer paypal config
- `src/lib/supabase.ts` — (posible) types paypal
- `src/lib/tracking-utils.ts` — (verificar) getAttributionPayload
- `src/components/PaypalExpressButton.tsx` — CREAR
- `src/pages/ui/CheckoutUI.tsx` — import + insertar botón

## Recent Changes
- **PayPal port US→MX — plan creado, esperando SettingsContext de US** ⏳ (2026-07-23) — diagnóstico: falta package, PaypalExpressButton, config en SettingsContext, verificar getAttributionPayload; backend requiere PayPal activado en Dashboard MX
- **Nav + footer: "Rastrear pedido" agregado** ✅ (2026-06-24) — link a /orders/track en desktop, mobile y footer
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
- **PayPal MX — dependencias del port (2026-07-23)**: (1) `getAttributionPayload` puede no existir en tracking-utils de MX — verificar antes de crear el botón. (2) El botón solo aparece si el Dashboard de MX tiene PayPal configurado (client_id/secret/enabled). (3) Confirmar que la cuenta PayPal acepta MXN.
- **Order Tracking — view orders_customer**: el CTA "Rastrear pedido" + entrega estimada en /mis-pedidos dependen de que la VIEW `orders_customer` exponga `checkout_token`, `tracking_number`, `tracking_url`, `estimated_delivery_at`. Guards condicionales protegen. La página /orders/track/:token NO depende de esto.
- Chrome autofill puede pintar inputs del checkout en blanco (workaround CSS aplicado)

## Key Files
- `src/contexts/SettingsContext.tsx` — settings store; ⚠️ falta exponer paypal config
- `src/pages/ui/CheckoutUI.tsx` — checkout; insertar PaypalExpressButton antes de StripePayment
- `src/components/StripePayment.tsx` — pago Stripe (ya usa trackPurchase/tracking)
- `src/lib/tracking-utils.ts` — trackPurchase/tracking ✅; getAttributionPayload ⚠️ verificar
- `src/lib/edge.ts` — helper callEdge (usado por el botón para paypal-create/capture-order)
- `src/pages/OrderTrack.tsx` / `src/pages/ui/OrderTrackUI.tsx` — rastreo pedidos ✅
- `src/pages/ui/ProductPageUI.tsx` — main PDP ✅ v4.7
- `src/templates/EcommerceTemplate.tsx` — trust bar + WhatsApp + nav "Rastrear pedido"
- `src/index.css` — design system

## PENDING / Future Sessions
- **PayPal**: recibir SettingsContext de US → implementar en Craft Mode
- Confirmar PayPal activado en Dashboard MX + soporte MXN
- Verificar response real de order-track con token de producción
- "También les encantó" upsell en cart/checkout
- Post-purchase email sequence (Dashboard)