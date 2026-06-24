# Rodata.mx — Plan

## Brand & Context
- Marca premium de soporte lumbar para motociclistas mexicanos
- Producto único: Rodata One — soporte lumbar para motociclistas
- Precio: MX$799 (compare_at: MX$999, 20% OFF)
- Tono: directo, técnico-emocional, sin fluff. Habla como rider, no como médico.
- Audiencia: motociclistas MX que hacen trayectos medios/largos y sufren dolor lumbar
- Store en producción: rodata.store

## Design System
- Dark theme: #111315 (fondo), #1D2125 (secciones alternas), #2A2E34 (graphite)
- Amber: #C98B2E (brand-amber) — único acento
- Typography: Sora (headings/bold), Inter (body/UI)
- Botones: btn-amber-lg (primario), btn-outline-light (secundario)
- Imágenes Supabase: usar `render/image/public` path + `?width=xxx&quality=75`
- **Avatar rule**: Para círculos de 36px (w-9 h-9), usar Supabase `?width=72&height=72&resize=cover&quality=80`

## Active Plan — Página pública de rastreo de pedidos (Order Tracking)

### Objetivo de negocio
Dar al cliente un link permanente para rastrear su pedido (estilo Shopify). Reduce mensajes de "¿dónde está mi paquete?", da confianza post-compra y mejora la experiencia. Backend YA desplegado: edge function `order-track` acepta `{ token }` o `{ store_id, order_number, email }` y devuelve `timeline + carrier + tracking + estimated_delivery_at + eventos + steps[] + current_step + cancelled + display_mode`. Los emails de envío ya enlazan a `https://{dominio}/orders/track/{checkout_token}`. Falta SOLO el frontend del template.

### Estado actual del código (verificado)
- `src/lib/edge.ts`: helper `callEdge(functionName, body)` listo (líneas 7-51). NO requiere auth (público). Úsalo tal cual.
- `src/App.tsx`: rutas en español (`/mis-pedidos`, `/gracias`, etc.), patrón lazy + `<Suspense>`. Fácil agregar 2 rutas nuevas.
- `src/adapters/MyOrdersAdapter.tsx`: **⚠️ TIPO C — FORBIDDEN ("NO EDITAR")**. Hace `.from('orders_customer').select('*', ...)` sobre una **VIEW** `orders_customer` (NO sobre la tabla `orders`). Como usa `select('*')`, si la view expone `checkout_token`, `tracking_number`, `tracking_url`, `shipping_carrier`, `estimated_delivery_at`, `shipped_at`, `paid_at`, ya vienen disponibles SIN tocar el adapter. ⚠️ El plan original asume editar el `select` — **NO aplica**, porque ya es `*`. Lo que hay que hacer es VERIFICAR que la view `orders_customer` exponga esos campos. Si no los expone, es un cambio de la view (backend/Supabase), no del template.
- `src/pages/ThankYou.tsx`: es página completa editable (no tiene archivo UI separado). Carga la orden desde `localStorage('completed_order')`, route param es `:orderId` (no token). Para el CTA "Rastrear mi pedido" necesitamos que el objeto `completed_order` guardado incluya `checkout_token`. ⚠️ Verificar que StripePayment/ProductExpressCheckout guarden `checkout_token` en ese objeto; si no, el CTA solo aparece cuando exista.
- `src/pages/ui/MyOrdersUI.tsx`: TIPO B editable. `OrderCard` (líneas 72-224) tiene sección expandida (CollapsibleContent) con dirección al final (línea 207-218) — ahí va el CTA nuevo.

### Implementation steps

**1. Crear página pública de tracking (Tipo B)**
- `src/pages/OrderTrack.tsx`: wrapper delgado. Lee `:token` con `useParams`. SEO **noindex** (meta robots noindex — seguir convención SEO del template; cargar skill `workflow.seo` antes de tocar head). Monta `<OrderTrackUI token={token} />` dentro de `EcommerceTemplate`.
- `src/pages/ui/OrderTrackUI.tsx`: UI editable con 2 modos:
  - **Modo token** (`/orders/track/:token`): al montar → `callEdge('order-track', { token })`.
  - **Modo lookup** (`/orders/track` sin token): formulario `order_number` + `email` → `callEdge('order-track', { store_id: STORE_ID, order_number, email })`. Importar `STORE_ID` de `@/lib/config`.
- `src/pages/ui/OrderTrackLookupForm.tsx` (opcional): subcomponente del formulario de búsqueda.

**2. UI del timeline (estilo Shopify)**
- 4 pasos desde `steps[]`, `current_step` pinta el progreso (línea horizontal con nodos ● llenos / ○ vacíos + ✓ en completados). En móvil considerar layout vertical para legibilidad.
- Si `cancelled: true` → banner rojo "Pedido cancelado" arriba del timeline.
- Bloque destacado "Entrega estimada" con `estimated_delivery_at` (formato `d MMM yyyy` con `date-fns` + locale `es`).
- Bloque carrier (SOLO si `display_mode === 'detailed'`): nombre/logo carrier, `tracking_number` copiable (botón copiar al clipboard + toast), botón "Rastrear con la paquetería" → abre `tracking_url` en nueva pestaña.
- Lista `events[]` colapsable (usar Collapsible de shadcn): `occurred_at` + `status_detail` + `location`.
- Si `display_mode === 'masked'`: ocultar carrier/tracking/eventos; mostrar SOLO timeline + entrega estimada (marca blanca).
- Estados: loading skeleton (usar Skeleton de shadcn como en MyOrdersUI), error 404 ("No encontramos tu pedido" + CTA a inicio), error genérico ("Algo salió mal, intenta de nuevo").
- Estilos: seguir `EcommerceTemplate` + componentes shadcn (Card, Badge, Button, Skeleton, Collapsible) para consistencia con MyOrdersUI. Strings en español.

**3. Registrar rutas en `src/App.tsx`**
- `const OrderTrack = lazy(() => import('./pages/OrderTrack'));`
- Dentro de `<Routes>`:
  - `<Route path="/orders/track" element={<OrderTrack />} />`
  - `<Route path="/orders/track/:token" element={<OrderTrack />} />`
- ⚠️ Usar `/orders/track/...` (NO `/pedidos/rastrear/...`) porque es la URL exacta que arma Lovivo en los emails (`buildTrackingUrl`).

**4. Conectar `MyOrdersUI.tsx` con la página nueva**
- En `OrderCard`, dentro de `CollapsibleContent`, DESPUÉS del bloque de dirección (línea ~218):
  - Si `order.checkout_token` existe → botón primario "Rastrear pedido" → `navigate('/orders/track/' + order.checkout_token)`. Importar `useNavigate` (ya está importado en el componente padre; pasarlo o usar el hook dentro de OrderCard).
  - Si además `order.tracking_number` → chip secundario con el número; si hay `order.tracking_url`, link externo "Ver en la paquetería".
  - Si `order.estimated_delivery_at` → línea "Entrega estimada: {fecha}" (formato `d MMM yyyy`, locale es).
- ⚠️ Estos campos dependen de que la view `orders_customer` los exponga (ver Known Issues). Renderizar condicionalmente con guards para que no rompa si vienen undefined.

**5. ThankYou CTA (opcional, recomendado)**
- En `src/pages/ThankYou.tsx`, en la sección de Action Buttons (línea ~224), agregar CTA "Rastrear mi pedido" → `/orders/track/{order.checkout_token}` SOLO si `order.checkout_token` existe.
- ⚠️ Verificar que el objeto guardado en `localStorage('completed_order')` incluya `checkout_token`. Si no, hay que agregarlo donde se guarda (StripePayment.tsx / ProductExpressCheckout.tsx) — revisar antes.

### Files to modify
- `src/pages/OrderTrack.tsx` — CREAR (wrapper + noindex)
- `src/pages/ui/OrderTrackUI.tsx` — CREAR (UI timeline + 2 modos)
- `src/pages/ui/OrderTrackLookupForm.tsx` — CREAR (opcional, form lookup)
- `src/App.tsx` — agregar 2 rutas lazy `/orders/track` y `/orders/track/:token`
- `src/pages/ui/MyOrdersUI.tsx` — CTA "Rastrear pedido" + chip tracking + entrega estimada en OrderCard
- `src/pages/ThankYou.tsx` — (opcional) CTA "Rastrear mi pedido" si hay checkout_token
- `src/adapters/MyOrdersAdapter.tsx` — **NO EDITAR** (Tipo C, ya usa `select('*')`). Solo verificar que la view `orders_customer` exponga los campos.

### Verificación end-to-end
1. Generar etiqueta de Envia en dashboard → confirmar email `order_shipped` con link `https://{dominio}/orders/track/{token}`.
2. Abrir link → timeline en paso "Enviado", carrier, tracking, entrega estimada.
3. Simular/esperar webhook de Envia → recargar → ver eventos nuevos y avance de paso.
4. `/mis-pedidos` autenticado → card muestra "Rastrear pedido" + entrega estimada.
5. `/orders/track` sin token con `order_number` + email → lookup funciona.
6. Cambiar `store_settings.tracking_display_mode` a `'masked'` → recargar → carrier/tracking/eventos ocultos.

### Cargar skills antes de ejecutar (Craft Mode)
- `workflow.seo` (para el noindex de OrderTrack)
- `pages.checkout` si se toca ThankYou/flujo
- `craft.copywriting` para los strings en español

## Recent Changes
- **Footer WhatsApp link corregido** ✅ (2026-06-24) — número actualizado a +52 55 3121 5386 en `EcommerceTemplate.tsx`
- **BUG FIX: Sticky bar no aparece en PDP — RESUELTO ✅** (2026-06-18)
  - `ProductPageUI.tsx`: `useEffect` del IntersectionObserver cambiado de `[]` a `[logic.product]`
  - Root cause: el observer se montaba cuando el producto aún no cargaba (ctaRef.current era null). Al agregar `logic.product` como dependencia, el effect se reconecta una vez que el producto llega y ctaRef apunta al CTA real.
- **Fix conversiones duplicadas Meta** — COMPLETADO ✅ (2026-06-18)
  - `tracking-utils.ts`: `generateEventId()` ahora acepta `(eventName, stableId?)` → ID determinístico por orden/producto. Purchase usa `order_id`, AddToCart/ViewContent/InitiateCheckout usan `product_id`, Search usa el término buscado. PageView no se toca.
  - `StripePayment.tsx`: sessionStorage guard `purchase_tracked_${orderId}` en 2 call sites (handlePayment + handleExpressCheckoutConfirm)
  - `ProductExpressCheckout.tsx`: sessionStorage guard `purchase_tracked_${orderId}` en 1 call site (handlePaymentMethod)
- **Checkout bottom section v2** — COMPLETADO ✅ (2026-06-15)
- **Checkout UI mejoras** — COMPLETADO ✅ (2026-06-15)
- **Badge descuento half-outside + precio tachado dinámico** — COMPLETADO ✅ (2026-06-15)
- **Trust bar: 2 mensajes en móvil** — COMPLETADO ✅
- **Avatar fix: resize=cover server-side** ✅ (2026-06-15)
- **PDP MX v4 — 8 mejoras sincronizadas del repo US** ✅ (2026-06-15)
- **Precio actualizado: MX$699 → MX$799** ✅
- Cart Sidebar dark rebrand ✅

## Image Inventory
- LIFESTYLE_CITY: `/pdp-lifestyle-1.jpg`
- LIFESTYLE_HIGHWAY: `render/image/public/message-images/.../1775768374485-uca4dkx21g.webp?width=1200&quality=75` ✅
- FEAT_IMG_1-3: `render/image/public/message-images/.../1775777133671/72-*.webp?width=800&quality=75` ✅
- REVIEW_IMG_1-5: `render/image/public/product-images/.../review-1-5.webp?width=600&quality=75` ✅
- AVATAR_*: `product-images/.../avatar-carlos-v3.webp?width=72&height=72&resize=cover&quality=80` ✅

## Known Issues
- **Order Tracking — VERIFICAR (2026-06-24)**: La view `orders_customer` debe exponer `checkout_token`, `tracking_number`, `tracking_url`, `shipping_carrier`, `estimated_delivery_at`, `shipped_at`, `paid_at`. El adapter usa `select('*')` sobre la VIEW (no tabla `orders`), así que si la view los excluye NO basta editar el template — requiere ajustar la view. Confirmar en Craft Mode antes de asumir que MyOrders mostrará tracking.
- **Order Tracking — ThankYou checkout_token (2026-06-24)**: `localStorage('completed_order')` debe incluir `checkout_token` para el CTA del ThankYou. Verificar dónde se guarda (StripePayment.tsx / ProductExpressCheckout.tsx).
- Chrome autofill puede pintar inputs del checkout en blanco (workaround: CSS autofill override ya aplicado en index.css)
- Avatares: si `avatar-carlos-v3.webp` no existe en `product-images` bucket, buscar en `message-images` o regenerar

## Key Files
- `src/pages/ui/ProductPageUI.tsx` — main PDP ✅ v4.7 (sticky bar bug resuelto)
- `src/templates/EcommerceTemplate.tsx` — ✅ trust bar 2 mensajes + WhatsApp link corregido
- `src/pages/ui/CheckoutUI.tsx` — ✅ v3 (4 días hábiles, Gratis, "Llega el")
- `src/components/StripePayment.tsx` — ✅ v3 | sessionStorage guard en 2 trackPurchase
- `src/lib/tracking-utils.ts` — ✅ v2 | generateEventId determinístico
- `src/components/ProductExpressCheckout.tsx` — ✅ v2 | sessionStorage guard en 1 trackPurchase
- `src/lib/edge.ts` — helper callEdge (para order-track)
- `src/adapters/MyOrdersAdapter.tsx` — ⚠️ TIPO C NO EDITAR, usa view `orders_customer` con `select('*')`
- `src/App.tsx` — routing (agregar /orders/track)
- `src/pages/ThankYou.tsx` — confirmación (agregar CTA tracking)
- `src/index.css` — design system

## PENDING / Future Sessions
- Add a "También les encantó" section at bottom of cart/checkout (upsell)
- Consider a post-purchase email sequence (set up from Dashboard)
- Video testimonial section if user has video content
- Monitor conversion rate after checkout v2 deploy
- Monitorear en Meta Ads Manager si las conversiones duplicadas desaparecen tras deploy