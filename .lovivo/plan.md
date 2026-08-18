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

## Active Plan — 🚨 FIX CRÍTICO: PayPal manda a una ruta 404 (auditoría 2026-08-18)

### Contexto
El usuario preguntó si una compra por PayPal aterriza bien en `/gracias` con el resumen
de compra. **Respuesta: NO.** Auditoría de código encontró 1 bug crítico + 4 secundarios.

### Estado actual verificado
- `src/App.tsx` líneas 75-76: las rutas de agradecimiento son **`/gracias`** y **`/gracias/:orderId`**.
  **No existe ninguna ruta `/thank-you`.**
- `src/components/PaypalExpressButton.tsx` línea 134: `navigate(`/thank-you/${ordId}`)`
  → cae en `<Route path="*" element={<NotFound />} />`. **El cliente paga y ve un 404.**
- Stripe (`StripePayment.tsx` L336 + L401) y wallets (`ProductExpressCheckout.tsx` L395)
  sí navegan correctamente a `/gracias/${orderId}`. PayPal fue el único que quedó mal.
- `ThankYou.tsx` lee **solo** de `localStorage.completed_order` (L39) y lo borra tras leerlo (L44).
  PayPal sí escribe esa key (L108), así que el resumen existiría — pero nunca se llega a renderizar.
- `PaypalExpressButton` se renderiza en `src/pages/ui/CheckoutUI.tsx` L263-272 con
  `items={logic.orderItems}` (provienen de `useOrderItems`).
- **Shape real de `orderItems`** (ver `CheckoutAdapter.tsx` L170-176): campos
  `product_id`, `product_title` (o `product.title`), `price` / `unit_price` (**en pesos, NO centavos**),
  `variant_id`, `quantity`, imágenes en `product.images`.
  El `fallbackOrder` de PayPal (L97-103) mapea `it.title`, `it.product_name`, `it.images`,
  `it.variant_title` → **todos undefined** ⇒ el resumen mostraría "Producto" sin imagen ni variante.
- `fallbackOrder` **no incluye `checkout_token`** ⇒ el botón "Rastrear mi pedido"
  (`ThankYou.tsx` L226) no aparece en compras PayPal.
- `fallbackOrder` **no incluye `shipping_address`** ⇒ `ThankYou.tsx` L189 cae al `else` y
  muestra **"Método de Entrega: Recoger en Tienda"**, que es FALSO (envío a domicilio).
  Nota: en PayPal Express la dirección la recoge el popup de PayPal, así que la dirección
  buena solo puede venir de `res.order` (servidor).
- `clearCart()` NO se llama tras PayPal (Stripe sí lo hace). Riesgo bajo porque
  `useCheckout.checkout()` L93 ya limpia el carrito al crear la orden, pero se agrega por seguridad.
- No hay toast de "¡Pago exitoso!" en PayPal (Stripe sí).

### Implementation steps

**1. `src/components/PaypalExpressButton.tsx` — arreglar la navegación (CRÍTICO)**
- L134: `navigate(`/thank-you/${ordId}`)` → `navigate(`/gracias/${ordId}`)`.

**2. Mismo archivo — enriquecer `fallbackOrder` (L91-105)**
- Agregar `checkout_token: checkoutToken` al objeto que se guarda en `completed_order`
  (igual que Stripe: `{ checkout_token: checkoutToken, ...order }`). Aplicar TANTO a
  `res.order` como al fallback → cambiar L108 a:
  `localStorage.setItem('completed_order', JSON.stringify({ checkout_token: checkoutToken, ...(res.order ?? fallbackOrder) }))`
- Corregir el mapeo de items al shape real de `orderItems`:
  - `product_name: it.product_title || it.product?.title || it.title || it.product_name || 'Producto'`
  - `price: it.price ?? it.unit_price ?? 0` (ya está en pesos — NO dividir entre 100)
  - `product_images: it.product?.images || it.images || it.product_images || []`
  - `variant_name: it.variant_title || it.variant?.name || it.variant_name || null`
- Añadir `shipping_address: res.order?.shipping_address ?? null` explícito en el fallback
  y marcar `delivery_method: 'shipping'` para que ThankYou no asuma pickup.
- Preferir `res.order.order_number` cuando exista (el slice del UUID no coincide con el
  número real que ve el usuario en el correo / dashboard).

**3. Mismo archivo — paridad con Stripe en el success path**
- Importar `useCart` y llamar `clearCart()` antes de navegar.
- Mostrar `toast({ title: "¡Pago exitoso!", description: "Tu compra ha sido procesada correctamente." })`.
- Corregir el título en `trackPurchase` (L120-126): usar
  `title: it.product_title || it.product?.title` y `price: it.price ?? it.unit_price ?? 0`
  (hoy usa `it.title` → undefined). `value: amount` ya es correcto.

**4. `src/pages/ThankYou.tsx` — no mentir con "Recoger en Tienda"**
- L189: la condición actual es `order.shipping_address && (line1 || address1)`.
  Cambiar el `else` para distinguir 3 casos:
  a) hay dirección → mostrarla (como hoy)
  b) `order.delivery_method === 'pickup'` o existe `pickup_location` → "Recoger en Tienda"
  c) no hay datos → mostrar "Te enviamos los detalles de entrega por correo"
     (NO decir "Recoger en Tienda").

**5. Robustez opcional (prioridad media, hacer si es fácil)**
- `ThankYou.tsx` borra `completed_order` al leerlo (L44) ⇒ si el cliente recarga `/gracias/:id`
  ve "Pedido no encontrado". Considerar NO borrar la key inmediatamente (dejarla ~30 min o
  borrarla al montar la home) o hidratar desde el backend por `checkout_token` como fallback,
  igual que hace `OrderTrack`.

### Files to modify
- `src/components/PaypalExpressButton.tsx` — ruta `/gracias`, checkout_token, mapeo de items,
  shipping_address, clearCart, toast, fix de tracking.
- `src/pages/ThankYou.tsx` — lógica de entrega (no asumir pickup cuando falta la dirección).

### QA obligatorio tras el fix
1. Compra real (o sandbox) con PayPal en `/pagar`.
2. Verificar: aterriza en `/gracias/<id>` (NO 404), muestra nombre real del producto + imagen,
   total correcto en MXN (799, no 79900), número de pedido correcto.
3. Verificar que aparece el botón "Rastrear mi pedido" y que abre `/orders/track/<token>`.
4. Verificar que NO diga "Recoger en Tienda".
5. Verificar que el carrito quedó vacío y que Meta recibe 1 solo Purchase con value 799.

---

## Recent Changes
- **🚨 Auditoría PayPal → `/gracias`** (2026-08-18) — encontrado bug crítico: PayPal navega a
  `/thank-you/:id` que NO existe como ruta ⇒ 404 tras pagar. Plan de fix guardado. NO implementado aún.
- **`/repartidores` refactorizada a PDP clonada** ✅ (2026-08-06) — creado
  `src/pages/ui/DeliveryPDPUI.tsx` (fork de ProductPageUI v4.7), `DeliveryLanding.tsx` apunta
  al nuevo UI, borrado `DeliveryLandingUI.tsx`. Carrito y galería recuperados.
- **Refactor `/repartidores` → clonar arquitectura de la PDP** 📋 (2026-08-06) — decisión:
  no cambiar arquitectura y mensaje al mismo tiempo.
- **Landing `/repartidores` v1** (2026-08-06) — descartada; copy e imágenes reciclados.
- **Auditoría Meta Purchase duplicados** ✅ (2026-08-06) — no viene del storefront.
- **PayPal Express portado US→MX — IMPLEMENTADO** ✅ (2026-07-23) — falta prueba real.
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
- DLV_HERO: `SB_PROD/dlv-hero.webp` (1600x1200) — usado en galería (crop cuadrado) y lifestyle break
- DLV_FEAT_1: `SB_PROD/dlv-feat-1.webp` (1024²) — feature 01 + quote break
- DLV_FEAT_2: `SB_PROD/dlv-feat-2.webp` (1024²) — feature 02 + galería
- DLV_FEAT_3: `SB_PROD/dlv-feat-3.webp` (1024²) — feature 03 + galería
- Reviews/avatares: reutilizados de la PDP (pendiente generar propios)

### Creativos de ads validados (subidos por el usuario, en Supabase)
- `message-images/0f3c776b-.../1786041572607-zlqbmm6nxp.webp` — "Te subes y bajas 40 veces al día"
- `message-images/0f3c776b-.../1786041572607-2687rjqwf6x.webp` — "Mochila cargada. Postura inclinada."
- `message-images/0f3c776b-.../1786041572607-iufym7bnuz9.webp` — "Acortar tu turno te cuesta entregas."

## Known Issues
- **🚨 PayPal → 404 tras pagar (2026-08-18)**: `PaypalExpressButton.tsx` L134 navega a
  `/thank-you/:id`, ruta inexistente (las reales son `/gracias` y `/gracias/:orderId`).
  Toda compra por PayPal termina en "Página no encontrada". Fix pendiente en Craft Mode.
- **PayPal — resumen de compra incompleto (2026-08-18)**: sin `checkout_token` (no aparece
  "Rastrear mi pedido"), mapeo de items con campos equivocados ("Producto", sin imagen),
  y sin `shipping_address` ⇒ ThankYou muestra "Recoger en Tienda" falsamente.
- **PayPal MX — falta prueba real (2026-07-23)**: implementación completa pero NO probada.
- **Meta Purchase server duplicados (2026-08-06)**: 75 enviados vs 141 recibidos. No viene del
  storefront. Revisar CAPI Gateway en Business Manager.
- **Order Tracking — view orders_customer**: depende de que exponga checkout_token/tracking_number/
  tracking_url/estimated_delivery_at.
- **`ThankYou` es frágil**: borra `completed_order` al leerlo, así que un refresh de
  `/gracias/:id` muestra "Pedido no encontrado". Aplica a todos los métodos de pago.
- **`lov-search-files` devolvió 0 resultados para strings que sí existen (2026-08-18)** —
  índice desactualizado; usar `lov-view` directo cuando pase.
- Chrome autofill puede pintar inputs del checkout en blanco (workaround CSS aplicado)

## Key Files
- `src/App.tsx` — rutas (`/gracias`, `/gracias/:orderId`, `/repartidores`)
- `src/components/PaypalExpressButton.tsx` — PayPal Express (⚠️ bug de ruta)
- `src/components/StripePayment.tsx` — pago con tarjeta/OXXO (referencia de flujo correcto)
- `src/components/ProductExpressCheckout.tsx` — wallets en PDP (referencia de flujo correcto)
- `src/pages/ThankYou.tsx` — resumen post-compra (lee `localStorage.completed_order`)
- `src/pages/ui/CheckoutUI.tsx` — checkout; renderiza PayPal en L263 y Stripe en L273
- `src/adapters/CheckoutAdapter.tsx` — `orderItems` (shape: product_title, price en pesos)
- `src/components/headless/HeadlessProduct.tsx` — `useProductLogic(slugOverride?)`
- `src/pages/ui/ProductPageUI.tsx` — PDP carretera v4.7 — **control del test**
- `src/pages/ui/DeliveryPDPUI.tsx` — PDP repartidores (fork de ProductPageUI)
- `src/lib/tracking-utils.ts` — tracking + getAttributionPayload
- `src/index.css` / `tailwind.config.ts` — design system

## PENDING / Future Sessions
- **[CRÍTICA]** Fix ruta PayPal `/thank-you` → `/gracias` + resumen completo (ver Active Plan).
- **[ALTA]** Probar compra real con PayPal en producción de punta a punta.
- **[ALTA]** Screenshot-preview mobile + desktop de `/repartidores` y ajustar recorte de galería si corta.
- **[ALTA]** Apuntar el ad set de repartidores a `/repartidores` con UTMs y anotar el CR benchmark previo.
- **[MEDIA]** Hacer `ThankYou` resistente a refresh (no borrar `completed_order` de inmediato).
- **[MEDIA]** Generar reviews/avatares propios de repartidores (hoy se reutilizan los de carretera).
- **[MEDIA]** Revisar CAPI Gateway en Business Manager (duplicados Meta).
- **[BAJA]** Test posterior: versión sin nav vs con nav en `/repartidores`.
- **[BAJA]** Property PostHog `landing_variant: 'repartidores'`.
- **[BAJA]** "También les encantó" upsell en cart/checkout.