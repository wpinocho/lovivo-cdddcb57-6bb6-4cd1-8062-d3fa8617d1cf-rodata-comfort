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

## Active Plan — Order Tracking — IMPLEMENTADO ✅ (2026-06-24)

Página pública de rastreo de pedidos estilo Shopify. Backend (edge function `order-track`) ya desplegado. Frontend del template ahora COMPLETO.

### Lo construido
- `src/pages/ui/OrderTrackUI.tsx` (CREADO) — UI editable Tipo B. 2 modos:
  - Modo token (`/orders/track/:token`): `callEdge('order-track', { token })` al montar.
  - Modo lookup (`/orders/track`): formulario → `callEdge('order-track', { store_id: STORE_ID, order_number, email })`.
  - Timeline horizontal 4 nodos desde `steps[]` + `current_step` (completado=amber lleno, current=pulse, pending=gris). Banner rojo si `cancelled`. Bloque entrega estimada (`estimated_delivery_at`, date-fns/es). Bloque carrier + tracking_number copiable + botón tracking_url (SOLO si `display_mode !== 'masked'`). Eventos colapsables (Collapsible). Loading skeleton + estados error (notfound/generic).
  - Defensivo: normaliza `steps[].completed/current` o cae a comparación con `current_step`; carrier acepta `carrier` o `shipping_carrier`; eventos aceptan `status_detail` o `description`.
- `src/pages/ui/OrderTrackLookupForm.tsx` (CREADO) — formulario order_number + email, estilado dark.
- `src/pages/OrderTrack.tsx` (CREADO) — wrapper Tipo A. Lee `:token`. SEO noindex via useEffect (meta robots noindex,nofollow + title, cleanup en unmount).
- `src/App.tsx` — rutas lazy `/orders/track` y `/orders/track/:token` (URL exacta de emails Lovivo).
- `src/pages/ui/MyOrdersUI.tsx` — en OrderCard (CollapsibleContent, tras dirección): entrega estimada, guía + link paquetería, botón "Rastrear pedido" → `/orders/track/{checkout_token}`. Todo con guards condicionales.
- `src/pages/ThankYou.tsx` — CTA "Rastrear mi pedido" si `order.checkout_token` existe. Añadido `checkout_token?` a interface OrderDetails.
- `src/components/StripePayment.tsx` (2 call sites) y `src/components/ProductExpressCheckout.tsx` (1 call site) — ahora inyectan `checkout_token: checkoutToken` al objeto `completed_order` guardado en localStorage, para que el CTA del ThankYou funcione siempre.

### Verificación pendiente (end-to-end, requiere dashboard/datos reales)
1. Generar etiqueta Envia → email order_shipped con link `/orders/track/{token}`.
2. Abrir link → timeline, carrier, tracking, entrega estimada.
3. Webhook Envia → recargar → eventos nuevos + avance de paso.
4. `/mis-pedidos` autenticado → card muestra "Rastrear pedido" + entrega estimada (DEPENDE de que view `orders_customer` exponga campos — ver Known Issues).
5. `/orders/track` sin token con order_number + email → lookup.
6. `tracking_display_mode = 'masked'` → carrier/tracking/eventos ocultos.

## Recent Changes
- **Order Tracking — frontend completo** ✅ (2026-06-24) — OrderTrack page + UI timeline 2 modos, rutas, CTA en MyOrders y ThankYou, checkout_token inyectado en completed_order
- **Footer WhatsApp link corregido** ✅ (2026-06-24) — +52 55 3121 5386 en EcommerceTemplate.tsx
- **BUG FIX: Sticky bar no aparece en PDP — RESUELTO ✅** (2026-06-18) — useEffect IntersectionObserver dep `[logic.product]`
- **Fix conversiones duplicadas Meta** ✅ (2026-06-18) — generateEventId determinístico + sessionStorage guards
- **Checkout bottom section v2** ✅ (2026-06-15)
- **Checkout UI mejoras** ✅ (2026-06-15)
- **Badge descuento half-outside + precio tachado dinámico** ✅ (2026-06-15)
- **Trust bar: 2 mensajes en móvil** ✅
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
- **Order Tracking — view orders_customer (VERIFICAR 2026-06-24)**: El CTA "Rastrear pedido" + entrega estimada en `/mis-pedidos` dependen de que la VIEW `orders_customer` exponga `checkout_token`, `tracking_number`, `tracking_url`, `estimated_delivery_at`. El adapter (Tipo C, NO editar) usa `select('*')` sobre la view. Si la view los excluye, el CTA simplemente no aparece (guards condicionales lo protegen). Si falta, ajustar la view en Supabase (backend), no el template. La página `/orders/track/:token` NO depende de esto (usa la edge function directa).
- **Order Tracking — shape de response**: OrderTrackUI es defensivo pero NO verificado contra el response real de la edge function. Si los campos difieren (ej. `steps[].label` vs otro nombre), ajustar el mapeo. Verificar con un token real.
- Chrome autofill puede pintar inputs del checkout en blanco (workaround CSS aplicado)
- Avatares: si `avatar-carlos-v3.webp` no existe en product-images bucket, buscar en message-images o regenerar

## Key Files
- `src/pages/OrderTrack.tsx` — ✅ wrapper público noindex (token + lookup)
- `src/pages/ui/OrderTrackUI.tsx` — ✅ UI timeline 2 modos
- `src/pages/ui/OrderTrackLookupForm.tsx` — ✅ form lookup
- `src/pages/ui/MyOrdersUI.tsx` — ✅ CTA rastrear + tracking + entrega estimada
- `src/pages/ThankYou.tsx` — ✅ CTA "Rastrear mi pedido"
- `src/components/StripePayment.tsx` — ✅ inyecta checkout_token en completed_order (2 sites)
- `src/components/ProductExpressCheckout.tsx` — ✅ inyecta checkout_token (1 site)
- `src/lib/edge.ts` — helper callEdge
- `src/adapters/MyOrdersAdapter.tsx` — ⚠️ TIPO C NO EDITAR, view orders_customer con select('*')
- `src/pages/ui/ProductPageUI.tsx` — main PDP ✅ v4.7
- `src/templates/EcommerceTemplate.tsx` — ✅ trust bar + WhatsApp
- `src/index.css` — design system

## PENDING / Future Sessions
- Verificar response real de order-track con un token de producción y ajustar mapeo si difiere
- Confirmar que view `orders_customer` expone campos de tracking (o ajustar view)
- "También les encantó" upsell en cart/checkout
- Post-purchase email sequence (Dashboard)
- Monitorear conversiones duplicadas Meta tras deploy