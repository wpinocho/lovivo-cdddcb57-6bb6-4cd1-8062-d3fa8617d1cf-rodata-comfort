# Rodata.mx — Plan

## Brand & Context
- Marca premium de soporte lumbar para motociclistas mexicanos
- Producto único: Rodata One — soporte lumbar (MX$799, compare_at MX$999, 20% OFF)
- Slug real del producto: `soporte-lumbar-rodata-one` (id `400026a2-c277-407c-abbb-d1683f415120`)
- Tono: directo, técnico-emocional, sin fluff. Habla como rider, no como médico.
- **Avatar 1**: rider de carretera/fin de semana → PDP `/productos/soporte-lumbar-rodata-one`
- **Avatar 2**: **repartidor de plataformas** (Rappi/DiDi/Uber Eats) → `/repartidores`
- Store en producción: rodata.store
- **Dos repos hermanos**: Rodata US y Rodata MX. Agente solo tiene acceso a MX.

## Design System
- Dark theme: `brand-carbon` #111315, `brand-graphite` #1D2125, `brand-steel` #5E6670, `brand-smoke` #C7CDD3, `brand-offwhite` #F5F7F8
- Amber: `brand-amber` #C98B2E / `brand-amber-light` #E5A842 — único acento
- Typography: Sora (headings/bold), Inter (body/UI)
- Imágenes Supabase: `render/image/public` + `?width=xxx&quality=75`
- Avatares 36px → `?width=72&height=72&resize=cover&quality=80`
- **Cards de reseña con foto**: `aspect-square`. Fuente a `width=700`.
- **Convención de landings por avatar**: SIEMPRE forkear `ProductPageUI.tsx`. Cambiar solo copy,
  imágenes, reviews y FAQ. Nunca reinventar el esqueleto.
- **Regla del cliente (2026-08-20)**: en `/repartidores` SOLO fotos reales del cliente.
- **Errores de pago (2026-09-03)**: nunca culpar al cliente, nunca mostrar el string crudo de
  Stripe. Banner persistente (no toast) + siguiente paso concreto + alternativa de pago.

---

## Active Plan — 📋 Recuperación de pagos rechazados y cancelaciones (2026-09-03)

### Objetivo de negocio
El tracking ya mide `checkout_payment_failed` y `checkout_paypal_cancelled`, pero el storefront
**no hace nada para recuperar** a ese usuario. Cada rechazo hoy = venta perdida silenciosa.
Meta: convertir el rechazo en un segundo intento con un método alternativo.

### AUDITORÍA — estado actual (verificado en código, 2026-09-03)

**1. Rechazo de tarjeta (Stripe) — `StripePayment.tsx`**
- 4 puntos de fallo: `elements.submit()` (L306), `confirmPayment` (L386), excepción genérica
  `handlePaymentError` (L505), y express checkout / wallets (L542, L665).
- **Todos terminan en un `toast({ variant: 'destructive' })` y nada más.**
- Problemas concretos:
  - El toast es **efímero** (se va en ~4s). Si el usuario está mirando el teclado, no lo ve.
  - Muestra `result.error.message` **crudo de Stripe** → texto genérico y a veces en inglés
    ("Your card was declined."). No hay `locale` configurado en `<Elements>`.
  - **No sugiere ninguna alternativa** (PayPal / OXXO / SPEI / otra tarjeta).
  - `handlePaymentError` genérico dice literal: "No se pudo procesar el pago. Intenta de nuevo."
    → cero información accionable.
  - Fuga grave de UX: el mensaje "Ve al dashboard de Lovivo para conectar Stripe" (L527)
    es texto interno de plataforma visible al **cliente final**. Hay que cambiarlo.
  - No hay contador de intentos → no se puede escalar el mensaje tras 2 fallos.

**2. Cancelación de PayPal — `PaypalExpressButton.tsx` L213-216**
- `onCancel` **solo** dispara `trackPH('checkout_paypal_cancelled')`. **Cero feedback visual.**
  El usuario cierra el popup y vuelve a una página que parece congelada.
- Lo bueno: `clearCart()` solo corre en éxito → **el carrito NO se pierde**.
- Lo bueno: contacto/dirección se autoguardan server-side vía `clients-upsert`
  (`CheckoutAdapter` L227-278, debounce 600ms) y la orden vive en
  `localStorage['checkout:${STORE_ID}']` con TTL de 7 días (`useCheckoutState`).
  → **Los datos SÍ se conservan**; lo que falta es devolver al usuario al punto de pago
  y decirle qué hacer.
- `onError` de PayPal muestra `err.message` crudo del SDK → poco útil.

**3. Arquitectura relevante**
- El checkout es **una sola página** (no hay stepper: 0 matches de `currentStep|setStep`).
  Por lo tanto "volver a la sección de pagos" = **scroll + foco**, no cambio de paso.
- `StripePayment` (CheckoutUI L300) y `PaypalExpressButton` (CheckoutUI L319) son **hermanos
  adyacentes** en `CheckoutUI` → un provider que envuelva a ambos resuelve el estado compartido.

### Comparación con Shopify (mejores prácticas)
| Práctica Shopify | Rodata hoy |
|---|---|
| Banner de error **persistente** arriba del bloque de pago | ❌ solo toast efímero |
| Mensajes por `decline_code` en el idioma de la tienda | ❌ string crudo de Stripe |
| Carrito + dirección intactos tras el fallo | ✅ ya funciona |
| Métodos alternativos visibles tras el fallo | ❌ no se destacan |
| Regreso al bloque de pago tras cancelar wallet/PayPal | ❌ no pasa nada |
| Email de checkout abandonado | ⚠️ se configura en el Dashboard, no aquí |

### IMPLEMENTACIÓN

**Paso 1 — `src/lib/payment-errors.ts` (nuevo)**
Mapa `decline_code` / `error_code` → copy en español accionable. Firma:
```ts
export type PaymentFailureKind = 'declined' | 'funds' | 'card_data' | 'auth' | 'network' | 'unknown' | 'cancelled'
export interface FriendlyPaymentError { kind, title, body, suggestAlternatives: boolean }
export function mapPaymentError(input: { code?, declineCode?, type?, message? }): FriendlyPaymentError
```
Copy (tono Rodata: directo, tú, sin culpar, siguiente paso concreto):
- `insufficient_funds` → **"Tu tarjeta no tenía fondos suficientes"** /
  "Prueba con otra tarjeta, o paga en efectivo en OXXO o por transferencia SPEI."
- `card_declined` (genérico) / `do_not_honor` / `generic_decline` →
  **"Tu banco rechazó el cargo"** / "No es un error tuyo: pasa seguido con compras en línea.
  Prueba otra tarjeta o paga con PayPal — tarda lo mismo."
- `incorrect_cvc` / `invalid_cvc` → **"Revisa el código de 3 dígitos"** /
  "Está al reverso de tu tarjeta, junto a la firma."
- `expired_card` → **"Esa tarjeta ya venció"** / "Usa otra tarjeta o paga con PayPal."
- `incorrect_number` / `invalid_number` → **"El número de tarjeta no cuadra"** /
  "Revísalo y vuelve a intentar."
- `authentication_required` → **"Tu banco pidió confirmar la compra"** /
  "Completa la verificación que te mandó tu banco y vuelve a darle a pagar."
- `processing_error` / `api_connection_error` → **"Se cayó la conexión con el banco"** /
  "No se te cobró nada. Vuelve a intentar en unos segundos."
- fallback → **"No pudimos completar tu pago"** /
  "No se te cobró nada. Tus datos y tu carrito siguen guardados. Prueba con otra tarjeta,
  con PayPal, o paga en OXXO o por SPEI."
- `cancelled` (PayPal) → **"Cancelaste el pago con PayPal"** /
  "Tu carrito y tus datos siguen aquí. Puedes pagar con tarjeta o volver a intentar con PayPal."
Regla: NUNCA mostrar `error.message` crudo al usuario; solo va a PostHog.

**Paso 2 — `src/contexts/PaymentRecoveryContext.tsx` (nuevo)**
Provider ligero (sin dependencias nuevas) con:
- `failure: FriendlyPaymentError | null`
- `attempts: number` (se incrementa en cada fallo; ≥2 → forzar `suggestAlternatives`)
- `reportFailure(err)`, `clearFailure()`
- `paymentSectionRef: RefObject<HTMLDivElement>` + `focusPaymentSection()` →
  `scrollIntoView({ behavior:'smooth', block:'center' })` (con guard de `prefers-reduced-motion`)
- `clearFailure()` se llama automáticamente cuando el usuario vuelve a darle a pagar.

**Paso 3 — `src/components/PaymentRecoveryBanner.tsx` (nuevo)**
Banner **persistente** (no toast), dismissible, renderizado arriba del bloque de pago:
- Fondo `bg-red-500/10`, borde `border-red-500/30`, ícono `AlertCircle` (lucide, ya instalado).
  Para `kind === 'cancelled'` usar tono neutro/amber en lugar de rojo (no es un error).
- Título Sora bold + body en `text-brand-smoke`, máx 2 líneas.
- Si `suggestAlternatives || attempts >= 2`: fila de chips con las alternativas **realmente
  activas** (leer `paymentMethods` de `useSettings`: PayPal, OXXO, SPEI) que hacen scroll
  al método correspondiente. No inventar métodos que la tienda no tenga prendidos.
- `role="alert"` + `aria-live="polite"`.

**Paso 4 — `StripePayment.tsx`**
- Consumir `usePaymentRecovery()`. En los 5 puntos de fallo, además del `trackPH` existente
  (no tocar los eventos), llamar `reportFailure(mapPaymentError({...}))`.
- **Quitar los toasts destructivos de error de pago** (el banner los reemplaza; mantener el
  toast de éxito y el de productos agotados).
- `clearFailure()` al inicio de `handlePayment` y `handleExpressCheckoutConfirm`.
- Renderizar `<PaymentRecoveryBanner />` justo arriba del `<PaymentElement>`.
- Cambiar el mensaje de `stripe_not_connected`: el cliente final debe ver
  "Los pagos con tarjeta están temporalmente fuera de servicio. Puedes pagar con PayPal."
  El detalle técnico se queda en `console.error` + PostHog.
- Agregar `locale: 'es-419'` a las options de `<Elements>` para que Stripe localice sus
  propios mensajes inline (validación de campos).

**Paso 5 — `PaypalExpressButton.tsx`**
- `onCancel`: mantener `trackPH('checkout_paypal_cancelled')` **igual** (no romper el funnel),
  y agregar `reportFailure(mapPaymentError({ code:'paypal_cancelled' }))` +
  `focusPaymentSection()` → el usuario vuelve a ver el bloque de tarjeta con el banner puesto.
- `onError` y `onApprove` catch: usar `mapPaymentError` en vez de `err.message` crudo.
  El mensaje técnico sigue yendo a PostHog en `error_message`.

**Paso 6 — `CheckoutUI.tsx`**
- Envolver el bloque de pago (StripePayment L300 + PaypalExpressButton L319) con
  `<PaymentRecoveryProvider>` y colgar `paymentSectionRef` del contenedor.

### Eventos nuevos de PostHog (2, aditivos)
- `payment_recovery_shown` — `{ kind, error_code, decline_code, attempts, alternatives_shown }`
- `payment_recovery_alternative_clicked` — `{ from_kind, alternative }` (paypal | oxxo | spei | card)
Solo PostHog (`trackPH`). **No tocar Meta ni Google Ads** — decisión del cliente.

### Fuera de alcance (Dashboard, no este repo)
- Email de checkout abandonado / recuperación de pago fallido → automatización del Dashboard.
- Insight en PostHog: `checkout_payment_failed` → `checkout_payment_succeeded` en la misma
  sesión = tasa de recuperación. Es la métrica que valida todo este trabajo.

### Criterios de aceptación
1. Tarjeta de prueba `4000000000000002` (declined) → banner rojo persistente, sin toast,
   carrito intacto, campos intactos, alternativas visibles.
2. Tarjeta `4000000000009995` (insufficient_funds) → copy específico de fondos.
3. Abrir PayPal y cerrar el popup → banner neutro + scroll al bloque de pago + datos intactos.
4. Segundo fallo consecutivo → chips de alternativas visibles aunque el código no lo pida.
5. Ningún string crudo de Stripe ni mención a "dashboard de Lovivo" visible al cliente.
6. Los eventos existentes de checkout siguen disparándose idénticos.

---

## Recent Changes
- **📋 Plan: recuperación de pagos rechazados y cancelación de PayPal** (2026-09-03) — auditoría:
  hoy solo hay toasts efímeros con texto crudo de Stripe y `onCancel` de PayPal sin feedback.
  Carrito y datos SÍ se conservan. Plan de 6 pasos + 3 archivos nuevos.
- **✅ Google Ads (gtag.js) implementado** (2026-09-01) — 2 archivos nuevos + 4 modificados.
  Multitenant, no inyecta nada sin conversion ID. Falta validar con Tag Assistant.
- **✅ Instrumentación completa de checkout en PostHog** (2026-08-25) — 14 eventos nuevos +
  `trackPH`/`identifyCustomer` en `tracking-utils.ts`. Falta armar los insights en PostHog.
- **📋 Plan: instrumentación de eventos de checkout en PostHog** (2026-08-25) — auditoría previa.
- **✅ Ajustes finos `/repartidores`** (2026-08-20, tanda 3) — swap Beneficio 01↔03, reseñas a
  `aspect-square` (+`width=700`), copy de "Se paga solo" a horizonte semanal.
- **✅ Reasignación de fotos `/repartidores`** (2026-08-20, tanda 2) — lifestyle, 3 beneficios,
  quote break y 5 reseñas remapeados; se agregó reseña "Marco V." (Querétaro).
- **✅ Fotografía real en `/repartidores`** (2026-08-20, tanda 1) — galería del producto (5 fotos).
- **✅ Fix PayPal → `/gracias` implementado** (2026-08-18). **Falta prueba real.**
- **🚨 Auditoría PayPal → `/gracias`** (2026-08-18) — detectado el 404 y 4 bugs secundarios.
- **`/repartidores` refactorizada a PDP clonada** ✅ (2026-08-06) — `src/pages/ui/DeliveryPDPUI.tsx`.
- **Auditoría Meta Purchase duplicados** ✅ (2026-08-06) — no viene del storefront.
- **PayPal Express portado US→MX — IMPLEMENTADO** ✅ (2026-07-23)
- **Nav + footer: "Rastrear pedido" agregado** ✅ (2026-06-24)
- **Order Tracking — frontend completo** ✅ (2026-06-24)
- **BUG FIX: Sticky bar no aparece en PDP — RESUELTO ✅** (2026-06-18)

## Image Inventory
Base URLs:
- `SB_PROD` = `https://ptgmltivisbtvmoxwnhd.supabase.co/storage/v1/render/image/public/product-images/cdddcb57-6bb6-4cd1-8062-d3fa8617d1cf`
- `SB_MSG` = `.../render/image/public/message-images/0f3c776b-9309-4486-bd63-fd732b7d8db1`

### PDP carretera (avatar 1) — vigentes
- LIFESTYLE_CITY: `/pdp-lifestyle-1.jpg`
- LIFESTYLE_HIGHWAY: `SB_MSG/1775768374485-uca4dkx21g.webp`
- PRODUCT_FLAT: `SB_MSG/1775767354281-gqxi2j4hklp.webp`
- FEAT_IMG_1-3: `SB_MSG/1775777133671-80hvv9dmxa.webp`, `1775777133672-xhxki05535d.webp`, `1775777133672-dzkdrl1lt2.webp`
- REVIEW_IMG_1-5: `SB_PROD/review-1..5.webp`
- AVATAR_CARLOS/JORGE/ANDRES: `SB_PROD/avatar-carlos-v3.webp`, `avatar-jorge-v3.webp`, `avatar-andres-v3.webp`

### Avatar repartidor — fotografía REAL vigente
Bucket `SB_MSG`. Galería producto (prefijo `1787249204164-`): `ifubpmh955s`, `h4pa1xnbjw`,
`5rlwxy193t3`, `r9dtbwqmwaa`, `7ws595nt61i`.
Resto (prefijo `1787251752010-`): lifestyle `uvy9yh7965f`; Beneficio 01 `mf34bj94nqm`,
02 `h6de90gdd6`, 03 `dxk60x3zg28`; quote `2b6138nc4z9`; reseñas `jotniqhksrb`, `13eliul1j8io`,
`jos9p0cz468`, `wdpx2luqeyp`, `muvx1aec14`, + `SB_PROD/review-5.webp`.
- **DEPRECADAS (IA, rechazadas)**: `SB_PROD/dlv-hero.webp`, `dlv-feat-1/2/3.webp`
- **SIN USO (tanda 1)**: `SB_MSG/1787249204164-0fhnu1sec2e`, `-v5k7gqoh4rq`, `-w8rmrhw4b6k`, `-sobj1wnq3sg`

### Creativos de ads validados
- `SB_MSG/1786041572607-zlqbmm6nxp.webp` — "Te subes y bajas 40 veces al día"
- `SB_MSG/1786041572607-2687rjqwf6x.webp` — "Mochila cargada. Postura inclinada."
- `SB_MSG/1786041572607-iufym7bnuz9.webp` — "Acortar tu turno te cuesta entregas."

## Known Issues
- **UX de pago rechazado (2026-09-03)**: solo toast efímero con texto crudo de Stripe; PayPal
  `onCancel` sin feedback; mensaje interno "dashboard de Lovivo" visible al cliente final.
  → cubierto por el Active Plan.
- **`<Elements>` sin `locale` (2026-09-03)**: Stripe puede devolver mensajes en inglés.
- **Google Ads sin validar (2026-09-01)**: código listo, falta confirmar que el conversion ID
  esté guardado en `store_settings` y ver el tag en vivo con Tag Assistant.
- **Tipo `StoreSettings` (2026-09-01)**: no incluye las columnas de Google Ads; se leen con
  `as any` en `SettingsContext`. Si algún día se puede editar `src/lib/supabase.ts`, tiparlas.
- **Insights de PostHog sin armar (2026-08-25)**: los eventos ya se emiten pero el funnel de
  6 pasos y el desglose de `error_code` aún no existen en el dashboard.
- **PayPal MX — falta prueba real (2026-08-18)**: fix implementado pero nunca probado punta a punta.
- **PayPal — dirección de envío**: solo llega si `paypal-capture-order` devuelve `res.order.shipping_address`.
- **Meta Purchase server duplicados (2026-08-06)**: 75 enviados vs 141 recibidos. Revisar CAPI Gateway.
- **Order Tracking — view orders_customer**: depende de que exponga checkout_token/tracking_number/
  tracking_url/estimated_delivery_at.
- Chrome autofill puede pintar inputs del checkout en blanco (workaround CSS aplicado)

## Key Files
- `src/lib/payment-errors.ts` — **(pendiente)** mapa decline_code → copy en español
- `src/contexts/PaymentRecoveryContext.tsx` — **(pendiente)** estado de fallo + scroll a pago
- `src/components/PaymentRecoveryBanner.tsx` — **(pendiente)** banner persistente de recuperación
- `src/lib/google-ads.ts` — loader gtag.js multitenant + purchase/event/setUserData
- `src/contexts/GoogleAdsContext.tsx` — init + page_view por ruta (dentro de BrowserRouter)
- `src/contexts/PostHogContext.tsx` — init PostHog (autocapture off, identified_only)
- `src/lib/tracking-utils.ts` — `trackHybrid` (Pixel + CAPI + PostHog), `gaItems`, `getAttributionPayload`,
  `trackPH` y `identifyCustomer` (PostHog-only, al final del archivo)
- `src/adapters/CheckoutAdapter.tsx` — `initiatecheckout` + autosave de cliente (`clients-upsert`)
- `src/pages/ui/CheckoutUI.tsx` — checkout de una sola página; StripePayment L300, PayPal L319
- `src/components/StripePayment.tsx` — `phBase()`, `handlePayment`, `handlePaymentError` (L505),
  `handleExpressCheckoutConfirm`
- `src/components/PaypalExpressButton.tsx` — `phBase()`, createOrder/onApprove/onError/onCancel (L213)
- `src/hooks/useCheckoutState.ts` — orden en localStorage, TTL 7 días
- `src/components/headless/HeadlessProduct.tsx` — viewcontent, addtocart
- `src/pages/ThankYou.tsx` — resumen post-compra (localStorage `completed_order`, TTL 2h)
- `src/pages/PendingPayment.tsx` — OXXO / SPEI + `pending_payment_viewed`
- `src/pages/ui/ProductPageUI.tsx` — PDP carretera v4.7
- `src/pages/ui/DeliveryPDPUI.tsx` — PDP repartidores (fotografía real, 6 reseñas)
- `src/index.css` / `tailwind.config.ts` — design system

## PENDING / Future Sessions
- **[CRÍTICA]** Implementar el Active Plan de recuperación de pagos (6 pasos).
- **[CRÍTICA]** Validar Google Ads con Tag Assistant + compra de prueba (transaction_id).
- **[CRÍTICA]** Verificar en PostHog Activity que los 14 eventos de checkout lleguen.
- **[CRÍTICA]** Probar compra real con PayPal en producción de punta a punta.
- **[ALTA]** Insight PostHog: tasa de recuperación (failed → succeeded en la misma sesión).
- **[ALTA]** Automatización de email de checkout abandonado / pago fallido (Dashboard).
- **[ALTA]** Confirmar claves de `google_ads_labels` (view_item, add_to_cart, begin_checkout, search).
- **[ALTA]** Armar en PostHog el funnel de 6 pasos y el insight de `error_code` / `decline_code`.
- **[ALTA]** Apuntar el ad set de repartidores a `/repartidores` con UTMs y anotar CR benchmark.
- **[MEDIA]** Enhanced conversions con teléfono/dirección además del email.
- **[MEDIA]** Hidratar `/gracias/:id` desde el backend por `checkout_token`.
- **[MEDIA]** Revisar CAPI Gateway en Business Manager (duplicados Meta).
- **[BAJA]** Test posterior: versión sin nav vs con nav en `/repartidores`.