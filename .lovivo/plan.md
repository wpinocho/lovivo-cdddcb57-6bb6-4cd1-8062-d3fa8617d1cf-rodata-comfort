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
- **Tone:** Premium, technical, masculine, motorcycle lifestyle — NOT medical/orthopedic

## Recent Changes (Session 11)
- Replaced broken `/pdp-lifestyle-1.jpg` (had wrong product upside-down + another product in frame)
- Generated new city lifestyle image using RODATA product as reference: rider in CDMX street, evening light, lumbar support visible, authentic Mexican atmosphere
- Saved to `public/pdp-lifestyle-1.jpg` (also_in_repo: true) — no code changes needed, path was already correct

## Image Assets (Current)
| File | Usage | Notes |
|------|-------|-------|
| `supabase/...16g7elmcuii.webp` | IndexUI hero background | rider de espaldas + moto + carretera dorada, RODATA visible |
| `/product-worn.jpg` | PDP gallery, features | Generated - rider on CDMX cobblestone, RODATA visible |
| `supabase/...gqxi2j4hklp.webp` | PRODUCT_FLAT in IndexUI + PDP gallery (FEATURES_ES) | User-uploaded — clean studio shot, RODATA label |
| `supabase/...uca4dkx21g.webp` | PDP "Menos fatiga. Más rodada." (LIFESTYLE_HIGHWAY) | USER REAL PHOTO — rider de espaldas, carretera serpenteante, cactos, luz dorada, RODATA en cinturón |
| `supabase/...1nufsuab1jt.webp` | IndexUI "El problema real" | USER UPLOAD — rider en moto con glow lumbar ámbar integrado, carretera desierto |
| `supabase/...676o65sijn4.webp` | IndexUI "Parte del equipo" — col-span-2 top | rider usando RODATA de espaldas, studio quality |
| `supabase/...tl8qt6nmo8.webp` | IndexUI "Parte del equipo" — bottom left | cinturón RODATA solo, fondo oscuro premium |
| `supabase/...z730si7cdto.webp` | IndexUI "Parte del equipo" — bottom right | macro detalle correas y malla |
| `/lifestyle-3.jpg` | IndexUI final CTA background | Mexican mountain road, sunset |
| `/pdp-lifestyle-1.jpg` | PDP "Ahora el Rodata One sale conmigo..." quote section | **REGENERATED** — rider en CDMX, moto, soporte lumbar visible, luz de tarde |
| `product-images/.../review-1.webp` | REVIEW_IMG_1 — Carlos / Carlos M. | rider de espaldas junto a Honda roja — **product-images bucket** |
| `product-images/.../review-2.webp` | REVIEW_IMG_2 — Jorge / Jorge R. | rider sentado en moto en gasolinera — **product-images bucket** |
| `product-images/.../review-3.webp` | REVIEW_IMG_3 — Andrés / Andrés V. | mirror selfie de espaldas con soporte — **product-images bucket** |
| `product-images/.../review-4.webp` | REVIEW_IMG_4 — Miguel T. | flat lay producto frente — **product-images bucket** |
| `product-images/.../review-5.webp` | REVIEW_IMG_5 — Rodrigo S. | flat lay producto panel RODATA visible — **product-images bucket** |

## Product Detail Page (ProductPageUI.tsx) — 11 Sections
1. **Main Product** — Dark #111315 bg, sticky gallery + full buy panel
2. **Stats Bar** — +800 riders, 4.9★, 100% México
3. **Lifestyle Break** — Full-bleed highway image + cinematic copy overlay
4. **Feature Breakdown** — 3 alternating full-width sections
5. **Technical Specs** — Clean table on offwhite bg
6. **How to Wear** — 3 numbered steps + inline CTA
7. **City Lifestyle Quote** — Full-bleed CDMX image + rider blockquote
8. **Reviews** — 5 cards with real customer photos (aspect 4/3) + "Compra verificada" badge
9. **Guarantee** — 4 trust cards on offwhite bg
10. **FAQ** — 6 accordion items
11. **Final CTA** — Dark centered with price + amber button
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
- Tone: Premium, technical, no medical claims
- Mobile-first
- No fake countdown timers, no aggressive popups
- Dark sections mixed with light sections for visual rhythm
- Amber as primary CTA color
- Campaign-ready for Meta Ads — PDP is the landing page