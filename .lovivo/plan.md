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

## Active Plan
### Fix: Conversiones duplicadas en Meta (aprobado por usuario)

**El bug:** `generateEventId()` en tracking-utils.ts usa `crypto.randomUUID()` en cada llamada.
Si `trackPurchase` se dispara 2 veces para la misma orden (3DS, doble click, Express+Normal checkout),
Meta recibe 2 event_ids distintos → no puede deduplicar → cuenta 2 compras.

**La solución (propuesta por técnico del usuario, validada):**

### Archivo 1: `src/lib/tracking-utils.ts`

**Cambio 1 — Reemplazar `generateEventId()` (líneas 94-97):**
```ts
// ANTES:
private generateEventId(): string {
  return crypto.randomUUID();
}

// DESPUÉS:
private generateEventId(eventName: string = 'evt', stableId?: string): string {
  const ev = eventName.toLowerCase();
  if (stableId && String(stableId).length > 0) {
    return `${ev}_${stableId}`;
  }
  return `${ev}_${crypto.randomUUID()}`;
}
```

**Cambio 2 — Agregar `stableId` a `trackHybrid` (líneas 131-136):**
```ts
// ANTES:
private trackHybrid(
  eventName: string,
  browserParams: Record<string, any>,
  customData: Record<string, any>
): void {
  const eventId = this.generateEventId();

// DESPUÉS:
private trackHybrid(
  eventName: string,
  browserParams: Record<string, any>,
  customData: Record<string, any>,
  stableId?: string
): void {
  const eventId = this.generateEventId(eventName, stableId);
```

**Cambio 3 — `trackPurchase` (línea 293): pasar `order_id`**
```ts
// ANTES:
this.trackHybrid('Purchase', browserParams, customData);
// DESPUÉS:
this.trackHybrid('Purchase', browserParams, customData, order_id);
```

**Cambio 4 — `trackInitiateCheckout` (línea 261): pasar stableId**
```ts
// ANTES:
this.trackHybrid('InitiateCheckout', browserParams, customData);
// DESPUÉS:
const icStableId = params.order_id || (products?.[0]?.id);
this.trackHybrid('InitiateCheckout', browserParams, customData, icStableId);
```

**Cambio 5 — `trackAddToCart` (línea 226): pasar stableId**
```ts
// ANTES:
this.trackHybrid('AddToCart', browserParams, customData);
// DESPUÉS:
const atcStableId = products?.[0]?.id;
this.trackHybrid('AddToCart', browserParams, customData, atcStableId);
```

**Cambio 6 — `trackViewContent` (línea 195): pasar stableId**
```ts
// ANTES:
this.trackHybrid('ViewContent', browserParams, customData);
// DESPUÉS:
const vcStableId = products?.[0]?.id;
this.trackHybrid('ViewContent', browserParams, customData, vcStableId);
```

**Cambio 7 — `trackSearch` (línea 311): usar generateEventId con stableId**
```ts
// ANTES:
const eventId = this.generateEventId();
// DESPUÉS:
const eventId = this.generateEventId('Search', search_string?.trim().toLowerCase());
```

**NO tocar:** `trackPageView()` — debe seguir disparando UUID único por visita. ✅

---

### Archivo 2: `src/components/StripePayment.tsx`

Hay DOS llamadas a `trackPurchase` en este archivo:
1. **handlePayment** (línea ~367) — cuando `pi.status === 'succeeded'` (tarjeta/Link normal)
2. **handleExpressCheckoutConfirm** (línea ~591) — cuando `pi.status === 'succeeded'` (Express: Apple Pay/GPay)

Envolver AMBAS con sessionStorage guard:

```ts
// Patrón a aplicar ANTES de cada trackPurchase:
const ptKey = `purchase_tracked_${orderId}`;
const alreadyTracked = (() => { try { return sessionStorage.getItem(ptKey) === '1'; } catch { return false; } })();
if (!alreadyTracked) {
  try { sessionStorage.setItem(ptKey, '1'); } catch {}
  trackPurchase({
    /* ...los mismos params que ya estaban... */
  });
}
```

Aplicar en:
- `handlePayment` → `pi?.status === 'succeeded'` block (StripePayment.tsx ~línea 365)
- `handleExpressCheckoutConfirm` → `pi?.status === 'succeeded'` block (~línea 590)

---

### Archivo 3: `src/components/ProductExpressCheckout.tsx`

Hay UNA llamada a `trackPurchase` (línea ~366) dentro de `handlePaymentMethod`.

Aplicar el mismo sessionStorage guard:
```ts
const ptKey = `purchase_tracked_${orderId}`;
const alreadyTracked = (() => { try { return sessionStorage.getItem(ptKey) === '1'; } catch { return false; } })();
if (!alreadyTracked) {
  try { sessionStorage.setItem(ptKey, '1'); } catch {}
  trackPurchase({
    /* ...mismos params... */
  });
}
```

---

**Por qué es seguro:**
- No cambia el flujo de pago en absoluto
- Solo afecta el tracking (evento Meta)
- Todos los try/catch protegen contra Safari privado y otros casos edge
- PageView sigue siendo UUID random (correcto)
- Purchase queda con event_id = `purchase_{order_id}` → Meta deduplica perfectamente

## Recent Changes
- **Fix conversiones duplicadas Meta** — PENDIENTE DE IMPLEMENTAR (2026-06-18)
  - `tracking-utils.ts`: generateEventId → determinístico por evento+stableId
  - `StripePayment.tsx`: sessionStorage guard en 2 call sites de trackPurchase
  - `ProductExpressCheckout.tsx`: sessionStorage guard en 1 call site de trackPurchase
- **Checkout bottom section v2** — COMPLETADO ✅ (2026-06-15)
  - Envío: "Pendiente" → "Gratis" en resumen móvil
  - `getEstimatedDelivery()`: ahora 4 días hábiles (un solo día, no rango) — coincide con PDP
  - Display: "Llega el {fecha}" (con "el" agregado)
  - Social proof arriba del botón: ★★★★★ 4.9 · +800 riders satisfechos
  - Botón dos líneas: "Completar Compra" / "{monto}" — fondo amber sólido, h-14
  - Trust badges: Envío gratis · Pago Seguro · Garantía 30 Días (con íconos amber)
  - Métodos de pago: VISA | MC | AMEX | Apple Pay | G Pay | OXXO (badges borde)
  - Links legales: Términos | Privacidad (style mejorado)
- **Checkout UI mejoras** — COMPLETADO ✅ (2026-06-15)
- **Badge descuento half-outside + precio tachado dinámico** — COMPLETADO ✅ (2026-06-15)
- **Trust bar: 2 mensajes en móvil** — COMPLETADO ✅
- **Avatar fix: resize=cover server-side** ✅ (2026-06-15)
- **PDP MX v4 — 8 mejoras sincronizadas del repo US** ✅ (2026-06-15)
- **Precio actualizado: MX$699 → MX$799** ✅
- Cart Sidebar dark rebrand ✅
- **BUG FIX: "Comprar Ahora" → checkout vacío — RESUELTO ✅**

## Image Inventory
- LIFESTYLE_CITY: `/pdp-lifestyle-1.jpg`
- LIFESTYLE_HIGHWAY: `render/image/public/message-images/.../1775768374485-uca4dkx21g.webp?width=1200&quality=75` ✅
- FEAT_IMG_1-3: `render/image/public/message-images/.../1775777133671/72-*.webp?width=800&quality=75` ✅
- REVIEW_IMG_1-5: `render/image/public/product-images/.../review-1-5.webp?width=600&quality=75` ✅
- AVATAR_*: `product-images/.../avatar-carlos-v3.webp?width=72&height=72&resize=cover&quality=80` ✅

## Known Issues
- Chrome autofill puede pintar inputs del checkout en blanco (workaround: CSS autofill override ya aplicado en index.css)
- Avatares: si `avatar-carlos-v3.webp` no existe en `product-images` bucket, buscar en `message-images` o regenerar
- **ACTIVO**: Conversiones duplicadas en Meta por event_id no determinístico → fix pendiente en tracking-utils.ts + StripePayment.tsx + ProductExpressCheckout.tsx

## Key Files
- `src/pages/ui/ProductPageUI.tsx` — main PDP ✅ v4.6
- `src/templates/EcommerceTemplate.tsx` — ✅ trust bar 2 mensajes
- `src/pages/ui/CheckoutUI.tsx` — ✅ v3 (4 días hábiles, Gratis, "Llega el")
- `src/components/StripePayment.tsx` — ✅ v2 | ⚠️ necesita sessionStorage guard en 2 trackPurchase
- `src/lib/tracking-utils.ts` — ⚠️ necesita generateEventId determinístico
- `src/components/ProductExpressCheckout.tsx` — ⚠️ necesita sessionStorage guard en 1 trackPurchase
- `src/lib/stripe-appearance.ts` — ✅
- `src/lib/country-codes.ts` — ✅
- `src/components/CartSidebar.tsx` — ✅
- `src/index.css` — design system
- `src/adapters/CheckoutAdapter.tsx` — ✅ isValidPhone fix
- `src/pages/ui/IndexUI.tsx` — ✅ precio actualizado a MX$799

## PENDING / Future Sessions
- **ALTA PRIORIDAD**: Fix conversiones duplicadas Meta (tracking-utils + StripePayment + ProductExpressCheckout)
- Add a "También les encantó" section at bottom of cart/checkout (upsell)
- Consider a post-purchase email sequence (set up from Dashboard)
- Video testimonial section if user has video content
- Monitor conversion rate after checkout v2 deploy