# RODATA (rodata.store) — Plan

## Brand & Context
- Marca premium de equipo para motociclistas mexicanos. **Nombre público: "RODATA"** (NUNCA "rodata.mx"). Dominio oficial: **https://rodata.store**
- Producto principal: Rodata One — soporte lumbar (MX$799, compare_at MX$999, 20% OFF)
- Slug: `soporte-lumbar-rodata-one` (id `400026a2-c277-407c-abbb-d1683f415120`)
- 4 tallas (opción `Talla`): S `37d48c11-...`, M `b6995a9e-82a5-4fd9-a1b6-2043b70955ec`, L `f4e5d229-4e32-47bc-8fae-9064ba74f358`,
  XL `f69e66aa-...` — **todas a $799**, `compare_at_price` 999. `track_inventory: false`. Sin suscripciones. `cost: 209`.
- **Producto en prueba: Muñequeras RODATA (par)** — id `97b069e9-3ee5-45ff-872a-50ff91762189`, slug `munequeras-rodata`,
  **precio PROVISIONAL $449 / compare $599**, talla única, sin cost cargado. NO está en home ni menú.
- **Producto REGALO**: título **"Regalo: Soporte de muñeca RODATA (par)"** id `f29e9557-14ac-4101-8c97-7c7b427c5e70`, slug `regalo-munequeras-rodata`,
  **price 0**, compare_at 449. Tags `regalo,no-listar`. Nombre visible en PDP: "Soporte de muñeca para moto" (constante `GIFT_NAME`).
- Tono: directo, técnico-emocional, sin fluff. Habla como rider, no como médico.
- **Avatar 1**: rider carretera → PDP `/productos/soporte-lumbar-rodata-one` · **Avatar 2**: repartidor → `/repartidores`
- **Dos repos hermanos**: Rodata US y Rodata MX. Agente solo tiene acceso a MX.
- **Tráfico (30d, 2026-09-04)**: 6,362 únicos. PDP 91%. **94% mobile.** ~80% Meta Ads. ~130 ventas/30d, CVR PDP ≈ 2.2%.
- **Política oficial (2026-09-28)**: 30 días desde que recibe · devolución normal = cliente paga regreso · defectuoso = RODATA cubre ·
  1er cambio de talla SIN COSTO · reembolso máx 10 días hábiles · envío estándar gratis en MX · preparación 24–48 h.
- WhatsApp: +52 55 3121 5386. **No existe razón social/RFC/dirección/email públicos — NO inventarlos.**

## Design System
- Dark theme: `brand-carbon` #111315, `brand-graphite` #1D2125, `brand-steel` #5E6670, `brand-smoke` #C7CDD3, `brand-offwhite` #F5F7F8
- Amber: `brand-amber` #C98B2E / `brand-amber-light` #E5A842 — único acento. Sora (headings), Inter (body).
- **Identidad pública — `src/lib/brand.ts`**. Páginas legales: `PolicyLayout.tsx`.
- Imágenes Supabase: `render/image/public` + `?width=xxx&quality=75`
- **Landings/PDP dedicadas**: forkear `ProductPageUI`/`DeliveryPDPUI` + ruta estática antes de `/productos/:slug`. NO tocar PDP original.
- **Regla del cliente**: en `/repartidores` SOLO fotos reales. Errores de pago: nunca culpar al cliente. Precios: NUNCA hardcodear.
- Copy devolución: "30 días para devolver", NO "garantía". Sin claims médicos. Un solo ancla de precio.
- **Urgencia: SOLO real** — contador a fecha FIJA igual para todos (nunca por visitante).
- **Vibración (claim honesto)**: "para que la vibración del manubrio te canse menos". PROHIBIDO "elimina la vibración / quita hormigueo / túnel carpiano".
- Tracking: event_id ÚNICO POR OCURRENCIA; stableId SOLO con order_id.

## Active Plan
### 🏠 Formulario de dirección estilo México (PLANEADO 2026-09-29 — esperando OK del cliente para Craft)
**Problema**: el cliente ve en /pagar las etiquetas de Stripe AddressElement: "Nombre de pila", "Primera línea de la dirección",
"Segunda línea de la dirección" (placeholder "Número de apartamento, suite…"). Confunden. **Stripe NO permite cambiar el texto de
las etiquetas** del AddressElement (solo appearance/locale; ya usamos `locale: 'es-419'` en `StripePayment.tsx` L1033).
Además **no existe campo Colonia** → en México las paqueterías la necesitan (riesgo de entregas fallidas / llamadas).

**Solución**: reemplazar el AddressElement (solo modo envío, no pickup) por un formulario propio con etiquetas estilo Shopify MX:
1. Nombre(s) | Apellidos (2 columnas)
2. **Calle y número exterior** (placeholder "Ej. Av. Insurgentes Sur 1234") — requerido → `line1`
3. **Número interior / depto (opcional)** (placeholder "Ej. Depto 4B, Int. 2") 
4. **Colonia** — requerido
5. **Código postal** (inputMode numeric, 5 dígitos, validar /^\d{5}$/) | **Ciudad o alcaldía** (2 columnas)
6. **Estado** — select con los 32 estados (mismos valores/códigos que hoy manda Stripe al backend; revisar qué formato recibe `logic.address.state` hoy, ej. "Ciudad de México" vs "CDMX" vs "DF", y mantenerlo idéntico)
7. **Teléfono (WhatsApp)** — reusar `CountryPhoneSelect.tsx` (+52 default), requerido, 10 dígitos
8. (Opcional, colapsado) "Referencias para el repartidor" → si hay campo notas en orden, usarlo; si no, omitir.
- Mapeo: `line1` = calle y número; `line2` = `[Int. X, ]Col. Y` (colonia SIEMPRE en line2 para que llegue a Stripe, pedido y guía). País fijo MX (`countryCode 'MX'`, nombre via `countryCodeToName`).
- Autocompletar: `autoComplete` attrs (given-name, family-name, address-line1, address-line2, postal-code, address-level2, address-level1, tel) para que el celular rellene solo.
- Mantener exacto el contrato actual de `onAddressChange(addressValue, complete)` en CheckoutUI.tsx (L385-434): construir el mismo objeto `{ address:{line1,line2,city,state,postal_code,country:'MX'}, name, phone }` y calcular `complete` con la validación propia → así no se toca saveClientData, PostHog `checkout_address_completed`, ExpressCheckout (`addressElementComplete`), ni la validación `onValidationRequired`.
- Revisar dentro de `StripePayment.tsx` todo lo que dependa del AddressElement (getValue, elements.getElement(AddressElement), shipping en confirmPayment / payments-create-intent `shipping_address`) y alimentarlo desde el estado del formulario propio (prop `shippingAddress` ya llega desde CheckoutUI).
- `defaultValues` (defaultAddress / cliente que regresa) → prellenar inputs.
- Errores inline por campo (texto ámbar/rojo suave, nunca culpar), solo tras blur o intento de pago.
- Estilo: igual al actual (inputs graphite, borde ámbar en focus, labels smoke 14px, alto ≥48px, font-size ≥16px para que iOS no haga zoom).
- **Rollback**: dejar el AddressElement detrás de una constante `USE_CUSTOM_ADDRESS_FORM = true` en `StripePayment.tsx` para poder volver en 1 línea.
- Nuevo archivo sugerido: `src/components/MxAddressForm.tsx`.
- Wallets (Apple/Google Pay) y Link para tarjeta NO cambian. Se pierde autollenado de dirección de Link (aceptado).

**Fix de paso**: consola muestra `clients-upsert 400 {"error":"email requerido"}` → `logic.saveClientData(true)` se dispara al completar dirección antes de tener email. Solo llamarlo si el email es válido (regex ya existe en L330); re-disparar cuando llegue el email.

**QA obligatorio (checkout = dinero)**: en móvil — pedido tarjeta con Int. vacío y lleno; ver que el pedido en Dashboard y el PaymentIntent en Stripe tengan colonia en line2; validación bloquea CP de 4 dígitos / sin colonia; Apple/Google Pay siguen funcionando; PDP regalo (línea $0) sigue OK; pickup sin cambios.

### 🎁 PDP Regalo v2 — CONSTRUIDA 2026-09-29 (QA real pendiente)
URL `/productos/soporte-lumbar-rodata-one-regalo`. Archivos:
- `src/lib/gift-offer.ts`: `GIFT_NAME`, `GIFT_NAME_SHORT`, **`GIFT_OFFER_ENDS_AT = '2026-10-09T23:59:59-06:00'`**, `isGiftOfferActive()`, `formatGiftEndDate()`. `isGiftEligible()` exige promo activa.
- `src/components/GiftCountdown.tsx`, `src/components/GiftDetailsDrawer.tsx` (vaul).
- `GiftLanding.tsx`: al vencer → `<Navigate replace>` a PDP normal.
- `GiftPDPUI.tsx`: tarjeta regalo con contador + drawer; badge; FAQ vibración; sticky móvil.
- **Para extender/cambiar la fecha**: editar solo `GIFT_OFFER_ENDS_AT` (o `null`).

### PDP Muñequeras — pendiente validación cliente (precio final, cierre/material, reseña "Ricardo G., Guadalajara").
### Merchant Center — cliente: dominio rodata.store + políticas + revisión.
### Experimento `exp-cdddcb57-pdp-second-belt-offer` (activo) — BOGO `7653e73d` limitada a Rodata One.

## Recent Changes
- **📋 Plan formulario de dirección estilo México + Colonia (2026-09-29)** — pendiente Craft.
- **🎁 PDP Regalo v2 construida (2026-09-29)** — nombre "Soporte de muñeca para moto", contador a fecha fija 9 oct, drawer detalles, vibración, auto-apagado, producto regalo renombrado.
- **📋 Plan PDP Regalo v2 (2026-09-29)**.
- **🎁 PDP Rodata One + Muñequeras de regalo (2026-09-28)**.
- **🧤 PDP Muñequeras RODATA (2026-09-28)**.
- **🛡️ Merchant Center trust fix (2026-09-28)**.
- **🎯 Fix event_id Meta Pixel + CAPI (2026-09-26)**.
- **🎨 Fix contraste `CartAppliedRules.tsx` (2026-09-22)**.
- **🚀 Experimento de pack ACTIVADO + BOGO activa (2026-09-22)**.
- **✅ `/politica-de-devoluciones` creada** (2026-09-22).
- **✅ Meta `google-site-verification` en `index.html`** (2026-09-22). NO QUITAR.
- **⚪ Test de precio $799 vs $849 CERRADO inconcluso** (2026-09-22).
- **✅ ETA centralizado** (2026-09-03).
- **✅ Recuperación de pagos rechazados** (2026-09-03).
- **✅ Google Ads (gtag.js)** (2026-09-01).

## Image Inventory
- `SB_PROD` = `https://ptgmltivisbtvmoxwnhd.supabase.co/storage/v1/render/image/public/product-images/cdddcb57-6bb6-4cd1-8062-d3fa8617d1cf`
- `SB_MSG` = `.../render/image/public/message-images/0f3c776b-9309-4486-bd63-fd732b7d8db1`
- Catálogo lumbar (object/public/product-images/products/): `nae4riov9h.webp` (ganadora), `j8kw94s83hn`, `pjleekrch4l`, `b5mg4lv2qbf`, `0evbcgfgplnh`
- **Kit regalo (IA 2026-09-28)**: `SB_PROD/kit-rodata-one-munequeras.webp`
- Muñequeras (reales) `SB_MSG/1790638502334-`: `pkwpdneq4dd` (estudio, thumb tarjeta), `q4h7kvtg3nn` (manubrio), `0yjgi3apchym` (callouts), `nwhrcsc3un` ("Esto recibes" — drawer), `2wwj6uvz7a5` (reseña)
- PDP carretera: LIFESTYLE_CITY `/pdp-lifestyle-1.jpg` · LIFESTYLE_HIGHWAY `SB_MSG/1775768374485-uca4dkx21g.webp` · FEAT 1-3 `SB_MSG/177577713367x-*` · REVIEW_IMG_1-5 `SB_PROD/review-1..5.webp`
- Home: HERO `SB_MSG/1775772513540-16g7elmcuii.webp`. Repartidor real: `SB_MSG/1787249204164-*`, `1787251752010-*`. DEPRECADAS `SB_PROD/dlv-*.webp`.

## Known Issues
- **Checkout (2026-09-29)**: etiquetas de Stripe confusas + sin campo Colonia → plan arriba. `clients-upsert` 400 "email requerido" en consola.
- **Regalo (2026-09-29)**: sin QA de compra real con línea $0.
- **Regalo vence 2026-10-09 23:59 CDMX**: después la URL redirige a PDP normal. Avisar al cliente antes.
- **Muñequeras**: precio provisional; reseña sin validar.
- "Garantía 30 días" en `StripePayment.tsx`/`DeliveryLandingUI.tsx` (permiso pendiente). Canonical estático PDP carretera.
- Tests vitest nunca ejecutados. Código `DEDE` 98% activo. `useURLCartLoader` roto (PGRST200).

## Pending / Future Sessions
- **[ALTA]** Construir formulario de dirección MX (plan arriba) + QA de compra real.
- **[ALTA]** QA compra real en celular en PDP regalo → confirmar "Regalo: Soporte de muñeca RODATA (par)" $0 en pedido.
- **[ALTA]** ~2026-10-07: preguntar al cliente si extiende/cambia la fecha del regalo (`GIFT_OFFER_ENDS_AT`).
- **[ALTA]** Muñequeras: precio final → actualizar también compare_at del producto regalo.
- **[MEDIA]** Medir clics en tarjeta/drawer del regalo (evento PostHog).
- **[ALTA]** Merchant Center. **[MEDIA]** "Garantía" → lenguaje devolución. **[ALTA]** vitest + build. **[CRÍTICA]** decisión `DEDE`.