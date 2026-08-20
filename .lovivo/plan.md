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
- **Regla del cliente (2026-08-20)**: en `/repartidores` SOLO se usan las fotos reales que él
  sube. Prohibido mezclar las imágenes del producto de la BD ni generar con IA para esa landing.

---

## Active Plan — ✅ Fotografía real montada en `/repartidores` (2026-08-20). Falta QA visual.

### Mapeo de slots de imagen en `src/pages/ui/DeliveryPDPUI.tsx`
Bucket: `message-images/0f3c776b-9309-4486-bd63-fd732b7d8db1` (constante `SB_UPLOAD`)

| Slot | Archivo |
|---|---|
| Galería 1 (estudio 3/4) | `1787249204164-ifubpmh955s.webp` |
| Galería 2 (mochila térmica) | `1787249204164-h4pa1xnbjw.webp` |
| Galería 3 (asiento + casco) | `1787249204164-5rlwxy193t3.webp` |
| Galería 4 (ajuste puesto) | `1787249204164-r9dtbwqmwaa.webp` |
| Galería 5 (interior) | `1787249204164-7ws595nt61i.webp` |
| Lifestyle "Para quien vive arriba de la moto" | `1787249204164-0fhnu1sec2e.webp` |
| Beneficio 01 | `1787249204164-v5k7gqoh4rq.webp` |
| Beneficio 02 (macro correas) | `1787249204164-w8rmrhw4b6k.webp` |
| Beneficio 03 | `1787249204164-sobj1wnq3sg.webp` |
| Quote "Ya cierro las 10 horas…" | reutiliza galería 2 (**falta la imagen 10**) |

- `productImages` ya NO incluye `logic.displayImages` (BD) — galería 100% del avatar repartidor.
- Constantes viejas `DLV_HERO_WIDE`, `DLV_HERO_SQ`, `dlv-feat-*.webp` **eliminadas** del archivo.

### QA pendiente
1. Screenshot mobile + desktop de `/repartidores`: verificar recortes cuadrados de la galería.
2. Lifestyle break: la imagen tiene texto quemado abajo-izquierda ("No estorba con la mochila").
   El gradiente 0.92 a la izquierda debería taparlo — confirmar en mobile.
3. Pedir al cliente la imagen #10 para el quote break.

---

## Recent Changes
- **✅ Fotografía real en `/repartidores`** (2026-08-20) — 9 imágenes del cliente montadas en
  galería (5), lifestyle break, 3 beneficios; quote reutiliza galería 2. Galería desligada de la BD.
- **✅ Fix PayPal → `/gracias` implementado** (2026-08-18) — ruta corregida, `checkout_token`,
  mapeo de items al shape real, `delivery_method`, `clearCart`, toast, tracking corregido.
  `ThankYou` ya no asume pickup y sobrevive un refresh (TTL 2h). **Falta prueba real.**
- **🚨 Auditoría PayPal → `/gracias`** (2026-08-18) — detectado el 404 y 4 bugs secundarios.
- **`/repartidores` refactorizada a PDP clonada** ✅ (2026-08-06) — creado
  `src/pages/ui/DeliveryPDPUI.tsx` (fork de ProductPageUI v4.7).
- **Auditoría Meta Purchase duplicados** ✅ (2026-08-06) — no viene del storefront.
- **PayPal Express portado US→MX — IMPLEMENTADO** ✅ (2026-07-23)
- **Nav + footer: "Rastrear pedido" agregado** ✅ (2026-06-24)
- **Order Tracking — frontend completo** ✅ (2026-06-24)
- **Footer WhatsApp link corregido** ✅ (2026-06-24) — +52 55 3121 5386
- **BUG FIX: Sticky bar no aparece en PDP — RESUELTO ✅** (2026-06-18)
- **Fix conversiones duplicadas Meta** ✅ (2026-06-18)
- **Checkout bottom section v2** ✅ (2026-06-15)
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

### Avatar repartidor — fotografía REAL vigente (2026-08-20)
Ver tabla de mapeo en "Active Plan". Todas en `SB_MSG`, prefijo `1787249204164-`.
- **DEPRECADAS**: `SB_PROD/dlv-hero.webp`, `dlv-feat-1.webp`, `dlv-feat-2.webp`, `dlv-feat-3.webp`
  (generadas con IA, el cliente las rechazó por calidad).
- Reviews/avatares en `/repartidores`: siguen reutilizando los de carretera.

### Creativos de ads validados
- `SB_MSG/1786041572607-zlqbmm6nxp.webp` — "Te subes y bajas 40 veces al día"
- `SB_MSG/1786041572607-2687rjqwf6x.webp` — "Mochila cargada. Postura inclinada."
- `SB_MSG/1786041572607-iufym7bnuz9.webp` — "Acortar tu turno te cuesta entregas."

## Known Issues
- **Falta la imagen #10 de `/repartidores` (2026-08-20)**: el cliente dijo 10, llegaron 9.
  El quote break usa provisionalmente la imagen de galería 2.
- **PayPal MX — falta prueba real (2026-08-18)**: el fix del 404 y del resumen está
  implementado pero NUNCA se ha completado una compra real por PayPal de punta a punta.
- **PayPal — dirección de envío**: solo llega si `paypal-capture-order` devuelve
  `res.order.shipping_address`. Si no, `/gracias` muestra "Envío a domicilio + detalles por correo".
- **Meta Purchase server duplicados (2026-08-06)**: 75 enviados vs 141 recibidos. Revisar CAPI Gateway.
- **Order Tracking — view orders_customer**: depende de que exponga checkout_token/tracking_number/
  tracking_url/estimated_delivery_at.
- **`lov-search-files` devuelve resultados vacíos / índice desactualizado (2026-08-18, confirmado
  2026-08-20)** — usar `lov-view` directo.
- Chrome autofill puede pintar inputs del checkout en blanco (workaround CSS aplicado)

## Key Files
- `src/App.tsx` — rutas (`/gracias`, `/gracias/:orderId`, `/repartidores`)
- `src/components/PaypalExpressButton.tsx` — PayPal Express (✅ arreglado 2026-08-18)
- `src/components/StripePayment.tsx` — pago con tarjeta/OXXO (referencia de flujo correcto)
- `src/components/ProductExpressCheckout.tsx` — wallets en PDP
- `src/pages/ThankYou.tsx` — resumen post-compra (localStorage `completed_order`, TTL 2h)
- `src/pages/ui/CheckoutUI.tsx` — checkout; PayPal en L263, Stripe en L273
- `src/adapters/CheckoutAdapter.tsx` — `orderItems` (product_title, price en pesos)
- `src/components/headless/HeadlessProduct.tsx` — `useProductLogic(slugOverride?)`
- `src/pages/ui/ProductPageUI.tsx` — PDP carretera v4.7 — **control del test**
- `src/pages/ui/DeliveryPDPUI.tsx` — PDP repartidores (fotografía real desde 2026-08-20)
- `src/lib/tracking-utils.ts` — tracking + getAttributionPayload
- `src/index.css` / `tailwind.config.ts` — design system

## PENDING / Future Sessions
- **[ALTA]** Screenshot-preview mobile + desktop de `/repartidores` y validar recortes.
- **[ALTA]** Pedir la imagen #10 (quote break) al cliente.
- **[CRÍTICA]** Probar compra real con PayPal en producción de punta a punta.
- **[ALTA]** Apuntar el ad set de repartidores a `/repartidores` con UTMs y anotar CR benchmark.
- **[MEDIA]** Hidratar `/gracias/:id` desde el backend por `checkout_token` (como `OrderTrack`).
- **[MEDIA]** Generar/pedir reviews y avatares propios de repartidores.
- **[MEDIA]** Revisar CAPI Gateway en Business Manager (duplicados Meta).
- **[BAJA]** Test posterior: versión sin nav vs con nav en `/repartidores`.
- **[BAJA]** Property PostHog `landing_variant: 'repartidores'`.