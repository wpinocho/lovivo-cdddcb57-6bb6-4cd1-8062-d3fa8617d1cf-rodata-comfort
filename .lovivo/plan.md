# Store Plan — rodata.mx
(Auto-updated by Lovivo AI)

## Current State
rodata.mx is a DTC store selling a single product: **Soporte Lumbar Rodata One** (MX$749, compare at MX$999).
Full premium landing page + premium product detail page are built. The store targets male motorcyclists 25-45 in Mexico. Ready to launch Meta Ads campaigns.

## Brand Identity
- **Name:** rodata.mx
- **Tagline:** Rueda más. Llega mejor.
- **Colors:** Carbon #111315, Graphite #1D2125, Steel #5E6670, Smoke #C7CDD3, Offwhite #F5F7F8, Amber #C98B2E
- **Fonts:** Sora (headings) + Inter (body)
- **Tone:** Premium, technical, masculine, motorcycle lifestyle — NOT medical/orthopedic. Benefit-first, not material/spec-first.

## Recent Changes (Session 13) — PENDING IMPLEMENTATION
### PDP Copy & Structure Improvements

**Problem identified:**
- Panel description starts with a question + is too long → not converting
- No explicit differentiation from generic back braces in ANY section
- Feature descriptions don't explain WHY motorcycle posture is unique
- Feature 02 doesn't mention flexibility / freedom of movement
- Specs section (section 5) is clinical, adds zero conversion value → DELETE
- "En tres pasos" section is useful for reducing purchase anxiety but too padded → CONDENSE
- Feature descriptions are wall-of-text with no bold keywords for scannability

---

## Implementation Plan — ProductPageUI.tsx

### 1. PANEL DESCRIPTION (section 1, info panel, ~line 188)
Replace the current "¿Llegas cansado...?" paragraph with shorter, moto-specific, statement-first copy:

```
<p className="text-brand-smoke text-sm leading-relaxed font-inter">
  En la moto vas inclinado hacia adelante — esa postura pone{' '}
  <strong className="text-brand-offwhite">tu zona lumbar bajo tensión constante</strong>,
  hora tras hora. No es lo mismo que una silla de oficina.{' '}
  <strong className="text-brand-offwhite">El Rodata One está diseñado para esa postura</strong>{' '}
  — no para el gym, no para la oficina.
</p>
```

Bullets (keep the 3, rewording the 2nd):
- "Baja de la moto sin ese dolor que acumulas en cada rodada"
- "Flexible — se mueve contigo y no estorba el manejo ni bajo la chamarra"
- "Ajuste en segundos — y se queda exactamente donde lo pusiste"

### 2. FEATURES ARRAY — rewrite desc with bold keywords

Feature 01 — "Termina cada rodada sin el dolor de siempre"
- Render as JSX node (not plain string), using `<strong>` for key phrases
```jsx
desc: (
  <>
    En la moto, tu cuerpo va inclinado hacia adelante durante horas —{' '}
    <strong>esa postura carga tu zona lumbar de una forma que no te das cuenta hasta que ya duele</strong>.
    El Rodata One actúa exactamente ahí:{' '}
    <strong>soporte firme que distribuye esa tensión</strong> sin restringirte. Lo pones, arrancas y te olvidas de él.
  </>
)
```

Feature 02 — "Rueda horas sin detenerte a ajustar nada"
```jsx
desc: (
  <>
    No es rígido como una faja de gimnasio —{' '}
    <strong>es flexible y se mueve contigo mientras manejas</strong>, sin restricciones.
    El sistema de doble correa lo mantiene{' '}
    <strong>exactamente en el mismo lugar desde que arrancas hasta que bajas</strong>.
    Sin que se corra. Sin que apriete de más. En trayectos largos, el equipo tiene que trabajar contigo — no en tu contra.
  </>
)
```

Feature 03 — "Bajo la chamarra, sin que lo notes"
```jsx
desc: (
  <>
    <strong>Textil negro mate con malla perforada transpirable</strong> — construcción técnica y perfil bajo
    diseñado para{' '}
    <strong>no estorbar debajo de cualquier chamarra de moto</strong>.
    A diferencia de los soportes genéricos, no presiona donde no debe ni sobresale.
    Resiste el uso diario, los climas y las temporadas largas{' '}
    <strong>sin deformarse ni perder estructura</strong>.
  </>
)
```

**IMPORTANT:** Since FEATURES is an array of objects with `desc` as a string, it needs to be refactored so `desc` can accept `React.ReactNode`. Change the type from `string` to `React.ReactNode` in the FEATURES array and render it directly as `{desc}` (not inside a plain `<p>`).

The render line (currently `<p className="text-brand-smoke text-base leading-relaxed font-inter mb-6">{desc}</p>`) stays the same — it already renders JSX children fine.

### 3. DELETE SPECS SECTION (section 5, ~lines 343-366)
Remove entirely. The size info is already in the selector. Material info is covered in Feature 03. Specs table adds zero conversion value and feels clinical.

### 4. CONDENSE "En tres pasos" (section 6)
- KEEP the 3-step content (it reduces purchase anxiety — "is it complicated?")
- Remove the bottom CTA button from this section (there's already a sticky bar)
- Reduce vertical padding: `py-20 lg:py-24` → `py-14 lg:py-16`
- Make step descriptions even shorter and crisper:
  - Step 1: "Coloca a la altura lumbar y ajusta las correas hasta sentirlo firme."
  - Step 2: "El perfil bajo lo hace discreto bajo cualquier chamarra de moto."
  - Step 3: "Notarás la diferencia al bajarte. Esa es la prueba."

### 5. EYEBROW label in panel (line 173)
Change: "El soporte que cambia cómo llegas"
To: "Diseñado para la postura de manejo"

This immediately signals moto-specificity to anyone who lands on the page.

---

## Files to modify
- `src/pages/ui/ProductPageUI.tsx`:
  - Refactor `FEATURES` array `desc` field from `string` to `React.ReactNode`
  - Rewrite panel description (lines ~188-196)
  - Change eyebrow label (line 173)
  - Rewrite all 3 feature descriptions with bold keywords
  - Delete entire specs section (lines ~343-366)
  - Condense "En tres pasos" section (reduce padding, remove CTA, update step descriptions)

---

## Previous Changes (Session 12)
- Rewrote ProductPageUI.tsx FEATURES section copy → now fully benefit-focused (pain relief, ride longer, comfort), not material-focused
- Updated 3 feature images to user-provided product photos:
  - FEAT_IMG_1: back shot of rider wearing RODATA (studio grey bg) → Feature 01 "Termina cada rodada sin el dolor de siempre"
  - FEAT_IMG_2: rider on motorcycle at sunset with RODATA → Feature 02 "Rueda horas sin detenerte a ajustar nada"
  - FEAT_IMG_3: macro close-up of straps/mesh panel → Feature 03 "Bajo la chamarra, sin que lo notes" (this one CAN talk about materials per user)
- Updated product panel eyebrow + description + bullets → now pain-problem focused
- Updated "How to wear" section title/descriptions → clearer, more benefit language
- Updated section headline "Ingeniería de soporte" → "Por qué funciona / Diseñado para que dures más en el camino"
- Updated Lifestyle Break copy → "Deja de bajar a estirar. Empieza a llegar mejor."
- Updated Final CTA → "¿Cuántas rodadas más vas a terminar con dolor de espalda?"

## Image Assets (Current)
| File | Usage | Notes |
|------|-------|-------|
| `supabase/...16g7elmcuii.webp` | IndexUI hero background | rider de espaldas + moto + carretera dorada, RODATA visible |
| `/product-worn.jpg` | PDP gallery, features | Generated - rider on CDMX cobblestone, RODATA visible |
| `supabase/...gqxi2j4hklp.webp` | PRODUCT_FLAT in IndexUI + PDP gallery (FEATURES_ES) | User-uploaded — clean studio shot, RODATA label |
| `supabase/...uca4dkx21g.webp` | PDP "Lifestyle Break" (LIFESTYLE_HIGHWAY) | USER REAL PHOTO — rider de espaldas, carretera serpenteante |
| `supabase/...1nufsuab1jt.webp` | IndexUI "El problema real" | USER UPLOAD — rider en moto con glow lumbar ámbar |
| `supabase/...676o65sijn4.webp` | IndexUI "Parte del equipo" — col-span-2 top | rider usando RODATA de espaldas |
| `supabase/...tl8qt6nmo8.webp` | IndexUI "Parte del equipo" — bottom left | cinturón RODATA solo, fondo oscuro premium |
| `supabase/...z730si7cdto.webp` | IndexUI "Parte del equipo" — bottom right | macro detalle correas y malla |
| `/lifestyle-3.jpg` | IndexUI final CTA background | Mexican mountain road, sunset |
| `/pdp-lifestyle-1.jpg` | PDP "Ahora el Rodata One sale conmigo..." quote section | REGENERATED — rider en CDMX |
| `supabase/...80hvv9dmxa.webp` | PDP Feature 01 (FEAT_IMG_1) | Studio shot — back view man wearing RODATA support, grey bg |
| `supabase/...xhxki05535d.webp` | PDP Feature 02 (FEAT_IMG_2) | Rider on motorcycle at sunset, RODATA visible |
| `supabase/...dzkdrl1lt2.webp` | PDP Feature 03 (FEAT_IMG_3) | Macro close-up correas y malla panel RODATA |
| `product-images/.../review-1.webp` through `review-5.webp` | Review cards in both pages | Product-images bucket (public access) |

## Product Detail Page (ProductPageUI.tsx) — Sections (UPDATED)
1. **Main Product** — Dark #111315 bg, sticky gallery + full buy panel. NEW: benefit-focused bullets & description
2. **Stats Bar** — +800 riders, 4.9★, 100% México
3. **Lifestyle Break** — Full-bleed highway image. NEW: "Deja de bajar a estirar. Empieza a llegar mejor."
4. **Feature Breakdown** — 3 alternating full-width sections. NEW: all benefit-focused copy + new user photos
5. ~~**Technical Specs**~~ → **DELETED**
6. **How to Wear** — 3 numbered steps. CONDENSED: less padding, no CTA, shorter descriptions
7. **City Lifestyle Quote** — Full-bleed CDMX image + rider blockquote
8. **Reviews** — 5 cards with real customer photos (aspect 4/3) + "Compra verificada" badge
9. **Guarantee** — 4 trust cards on offwhite bg
10. **FAQ** — 6 accordion items
11. **Final CTA** — "¿Cuántas rodadas más vas a terminar con dolor de espalda?"
12. **Sticky Bottom Bar** — Shows when main CTA scrolls out

## Landing Page (IndexUI.tsx) — 11 Sections
1. Hero (user photo + light overlay), 2. Benefits Bar, 3. Problem Section, 4. How It Works,
5. Lifestyle Grid ("Parte del equipo"), 6. For Whom, 7. Comparison Table,
8. **Testimonials** — 3 cards with real customer photos (aspect 4/3) + verified badge,
9. Guarantee, 10. FAQ, 11. Final CTA

## Product Info
- Title: Soporte Lumbar Rodata One
- Slug: soporte-lumbar-rodata-one
- Price: MX$749 / Compare at: MX$999
- Variants: S (60-75cm), M (75-90cm), L (90-100cm), XL (100-115cm)
- Status: active

## Next Steps / Known Issues
- Connect Stripe payment gateway (Dashboard)
- Update WhatsApp number from 5215500000000 to real number (EcommerceTemplate.tsx + ProductPageUI.tsx)
- Replace placeholder testimonials text with real rider reviews post-launch
- `/lifestyle-3.jpg` — verify if it has wrong branding
- **IMPORTANT:** Always save user images to `product-images` bucket (via image--optimize), NOT `message-images`. The `message-images` bucket has access restrictions.

## User Preferences
- Language: Spanish (Mexico)
- Tone: Premium, technical, no medical claims. BENEFIT-FIRST not material/spec-first.
- Mobile-first
- No fake countdown timers, no aggressive popups
- Dark sections mixed with light sections for visual rhythm
- Amber as primary CTA color
- Campaign-ready for Meta Ads — PDP is the landing page