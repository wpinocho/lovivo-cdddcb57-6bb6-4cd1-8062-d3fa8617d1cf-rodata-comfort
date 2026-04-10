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

## Recent Changes (Session 13) — IMPLEMENTED ✅
### PDP Copy & Structure Improvements

- **Eyebrow label:** "El soporte que cambia cómo llegas" → "Diseñado para la postura de manejo"
- **Panel description:** Replaced question-lead with statement-first moto-specific copy + bold keywords
- **Bullet 2:** "Soporte firme que no estorba ni bajo la chamarra" → "Flexible — se mueve contigo y no estorba el manejo ni bajo la chamarra"
- **Feature descriptions:** Refactored `desc` field to `React.ReactNode`, added `<strong>` bold keywords across all 3 features
  - Feature 01: postura inclinada en moto → tensión lumbar → soporte que distribuye sin restringir
  - Feature 02: no rígido como faja → flexible, se mueve → doble correa mantiene posición
  - Feature 03: textil negro mate + malla perforada → perfil bajo → no estorba bajo chamarra → no se deforma
- **Specs section (section 5):** DELETED entirely — no conversion value
- **"En tres pasos" section:** Condensed — padding reduced (`py-14 lg:py-16`), CTA button removed, descriptions made shorter/crisper

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
1. **Main Product** — Dark #111315 bg, sticky gallery + full buy panel. NEW: moto-specific description + bold keywords + flexible bullet
2. **Stats Bar** — +800 riders, 4.9★, 100% México
3. **Lifestyle Break** — Full-bleed highway image. "Deja de bajar a estirar. Empieza a llegar mejor."
4. **Feature Breakdown** — 3 alternating full-width sections. NEW: React.ReactNode desc with `<strong>` bold keywords + moto-posture differentiation
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