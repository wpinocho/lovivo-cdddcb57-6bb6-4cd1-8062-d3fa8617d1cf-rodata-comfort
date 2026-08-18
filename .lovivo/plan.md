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
- **Convención de landings por avatar**: SIEMPRE forkear `ProductPageUI.tsx` (arquitectura
  validada). Cambiar solo copy, imágenes, reviews y FAQ. Nunca reinventar el esqueleto.

---

## Active Plan — ✅ Fix PayPal → `/gracias` IMPLEMENTADO (2026-08-18). Falta QA real.

### Qué se arregló (código ya en el repo)
**`src/components/PaypalExpressButton.tsx`**
1. `navigate('/thank-you/${ordId}')` → **`navigate('/gracias/${ordId}')`** (era el 404 crítico).
2. `localStorage.completed_order` ahora se guarda como
   `{ checkout_token: checkoutToken, ...(res.order ?? fallbackOrder) }` ⇒ aparece el botón
   "Rastrear mi pedido" en `/gracias`.
3. `fallbackOrder.order_items` remapeado al shape real de `orderItems` (CheckoutAdapter L170-176):
   `product_title || product?.title`, `price ?? unit_price` (en **pesos**, sin dividir /100),
   `product?.images`, `variant_title || variant?.name`.
4. `order_number` prefiere `res.order?.order_number` antes del slice del UUID.
5. `shipping_address: res.order?.shipping_address ?? null` + `delivery_method: 'shipping'`.
6. Paridad con Stripe: `clearCart()` (import `useCart` de `@/contexts/CartContext`) y
   `toast({ title: '¡Pago exitoso!' })` antes de navegar.
7. `trackPurchase` corregido: `title: it.product_title || it.product?.title || ...`,
   `price: it.price ?? it.unit_price ?? 0`.

**`src/pages/ThankYou.tsx`**
8. Interface `OrderDetails` + `delivery_method?`, `pickup_location?`.
9. Lógica de entrega en 3 ramas: (a) dirección → mostrarla, (b) `delivery_method === 'pickup'`
   o `pickup_location` → "Recoger en Tienda", (c) sin datos → "Envío a domicilio. Te enviamos
   los detalles de entrega por correo." **Ya no miente con "Recoger en Tienda".**
10. Resistente a refresh: ya NO borra `completed_order` al leerlo; lo descarta solo si
    `created_at` tiene más de 2 horas. Aplica a todos los métodos de pago.

### QA obligatorio (PENDIENTE — no probado en real)
1. Compra real (o sandbox) con PayPal en `/pagar`.
2. Verificar: aterriza en `/gracias/<id>` (NO 404), nombre real del producto + imagen + talla,
   total correcto en MXN (799, no 79900), número de pedido correcto.
3. Verificar botón "Rastrear mi pedido" → abre `/orders/track/<token>`.
4. Verificar que NO diga "Recoger en Tienda".
5. Verificar carrito vacío y que Meta reciba **1 solo** Purchase con value 799.
6. Refrescar `/gracias/<id>` → el resumen debe seguir ahí (no "Pedido no encontrado").

---

## Recent Changes
- **✅ Fix PayPal → `/gracias` implementado** (2026-08-18) — ruta corregida, `checkout_token`,
  mapeo de items al shape real, `delivery_method`, `clearCart`, toast, tracking corregido.
  `ThankYou` ya no asume pickup y sobrevive un refresh (TTL 2h). **Falta prueba real.**
- **🚨 Auditoría PayPal → `/gracias`** (2026-08-18) — detectado el 404 y 4 bugs secundarios.
- **`/repartidores` refactorizada a PDP clonada** ✅ (2026-08-06) — creado
  `src/pages/ui/DeliveryPDPUI.tsx` (fork de ProductPageUI v4.7), `DeliveryLanding.tsx` apunta
  al nuevo UI, borrado `DeliveryLandingUI.tsx`. Carrito y galería recuperados.
- **Refactor `/repartidores` → clonar arquitectura de la PDP** 📋 (2026-08-06)
- **Landing `/repartidores` v1** (2026-08-06) — descartada; copy e imágenes reciclados.
- **Auditoría Meta Purchase duplicados** ✅ (2026-08-06) — no viene del storefront.
- **PayPal Express portado US→MX — IMPLEMENTADO** ✅ (2026-07-23)
- **Nav + footer: "Rastrear pedido" agregado** ✅ (2026-06-24)
- **Order Tracking — frontend completo** ✅ (2026-06-24)
- **Footer WhatsApp link corregido** ✅ (2026-06-24) — +52 55 3121 5386
- **BUG FIX: Sticky bar no aparece en PDP — RESUELTO ✅** (2026-06-18)
- **Fix conversiones duplicadas Meta** ✅ (2026-06-18)
- **Checkout bottom section v2** ✅ (2026-06-15)
- **Badge descuento half-outside + precio tachado dinámico** ✅ (2026-06-15)
- **PDP MX v4 — 8 mejoras sincronizadas del repo US** ✅ (2026-06-15)

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

### Avatar repartidor — en uso en DeliveryPDPUI
- DLV_HERO: `SB_PROD/dlv-hero.webp` (1600x1200) — galería (crop cuadrado) y lifestyle break
- DLV_FEAT_1: `SB_PROD/dlv-feat-1.webp` (1024²) — feature 01 + quote break
- DLV_FEAT_2: `SB_PROD/dlv-feat-2.webp` (1024²) — feature 02 + galería
- DLV_FEAT_3: `SB_PROD/dlv-feat-3.webp` (1024²) — feature 03 + galería
- Reviews/avatares: reutilizados de la PDP (pendiente generar propios)

### Creativos de ads validados (subidos por el usuario, en Supabase)
- `message-images/0f3c776b-.../1786041572607-zlqbmm6nxp.webp` — "Te subes y bajas 40 veces al día"
- `message-images/0f3c776b-.../1786041572607-2687rjqwf6x.webp` — "Mochila cargada. Postura inclinada."
- `message-images/0f3c776b-.../1786041572607-iufym7bnuz9.webp` — "Acortar tu turno te cuesta entregas."

## Known Issues
- **PayPal MX — falta prueba real (2026-08-18)**: el fix del 404 y del resumen está
  implementado pero NUNCA se ha completado una compra real por PayPal de punta a punta.
- **PayPal — dirección de envío**: en PayPal Express la dirección la recoge el popup de
  PayPal, así que solo llega si `paypal-capture-order` devuelve `res.order.shipping_address`.
  Si el servidor no la devuelve, `/gracias` muestra "Envío a domicilio + detalles por correo"
  (correcto, pero sin la dirección impresa). Verificar en el QA.
- **Meta Purchase server duplicados (2026-08-06)**: 75 enviados vs 141 recibidos. No viene del
  storefront. Revisar CAPI Gateway en Business Manager.
- **Order Tracking — view orders_customer**: depende de que exponga checkout_token/tracking_number/
  tracking_url/estimated_delivery_at.
- **`lov-search-files` devuelve resultados inconsistentes / líneas equivocadas (2026-08-18)** —
  índice desactualizado; usar `lov-view` directo cuando pase.
- Chrome autofill puede pintar inputs del checkout en blanco (workaround CSS aplicado)

## Key Files
- `src/App.tsx` — rutas (`/gracias`, `/gracias/:orderId`, `/repartidores`)
- `src/components/PaypalExpressButton.tsx` — PayPal Express (✅ arreglado 2026-08-18)
- `src/components/StripePayment.tsx` — pago con tarjeta/OXXO (referencia de flujo correcto)
- `src/components/ProductExpressCheckout.tsx` — wallets en PDP (referencia de flujo correcto)
- `src/pages/ThankYou.tsx` — resumen post-compra (lee `localStorage.completed_order`, TTL 2h)
- `src/pages/ui/CheckoutUI.tsx` — checkout; PayPal en L263, Stripe en L273
- `src/adapters/CheckoutAdapter.tsx` — `orderItems` (shape: product_title, price en pesos)
- `src/contexts/CartContext.tsx` — `useCart()` expone `clearCart`
- `src/components/headless/HeadlessProduct.tsx` — `useProductLogic(slugOverride?)`
- `src/pages/ui/ProductPageUI.tsx` — PDP carretera v4.7 — **control del test**
- `src/pages/ui/DeliveryPDPUI.tsx` — PDP repartidores (fork de ProductPageUI)
- `src/lib/tracking-utils.ts` — tracking + getAttributionPayload
- `src/index.css` / `tailwind.config.ts` — design system

## PENDING / Future Sessions
- **[CRÍTICA]** Probar compra real con PayPal en producción de punta a punta (checklist arriba).
- **[ALTA]** Screenshot-preview mobile + desktop de `/repartidores` y ajustar recorte de galería si corta.
- **[ALTA]** Apuntar el ad set de repartidores a `/repartidores` con UTMs y anotar el CR benchmark previo.
- **[MEDIA]** Considerar hidratar `/gracias/:id` desde el backend por `checkout_token`
  (como `OrderTrack`) para no depender de localStorage.
- **[MEDIA]** Generar reviews/avatares propios de repartidores (hoy se reutilizan los de carretera).
- **[MEDIA]** Revisar CAPI Gateway en Business Manager (duplicados Meta).
- **[BAJA]** Test posterior: versión sin nav vs con nav en `/repartidores`.
- **[BAJA]** Property PostHog `landing_variant: 'repartidores'`.
- **[BAJA]** "También les encantó" upsell en cart/checkout.