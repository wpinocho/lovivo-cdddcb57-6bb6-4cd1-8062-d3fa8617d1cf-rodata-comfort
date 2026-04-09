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

## Recent Changes (Session 8)
- Hero image replaced with user-uploaded photo: rider de espaldas junto a moto en carretera serpenteante, hora dorada, RODATA visible en cinturón
- Overlay ajustado a capa ligera: img opacity 80% + gradient más sutil (left dark for text, right more open)
- Previous HERO_IMG was `/hero-rider.jpg` (generated); now uses Supabase URL

## Image Assets (Current)
| File | Usage | Notes |
|------|-------|-------|
| `supabase/...16g7elmcuii.webp` | IndexUI hero background | **NEW** — rider de espaldas + moto + carretera dorada, RODATA visible |
| `/hero-rider.jpg` | (no longer used) | Old generated hero |
| `/product-worn.jpg` | IndexUI hero right, PDP lifestyle, features banner | Generated - rider on CDMX cobblestone, RODATA visible |
| `supabase/...gqxi2j4hklp.webp` | PRODUCT_FLAT in IndexUI + PDP gallery (FEATURES_ES) | User-uploaded — clean studio shot, RODATA label |
| `supabase/...uca4dkx21g.webp` | PDP "Menos fatiga. Más rodada." (LIFESTYLE_HIGHWAY) | **USER REAL PHOTO** — rider de espaldas, carretera serpenteante, cactos, luz dorada, RODATA en cinturón |
| `supabase/...1nufsuab1jt.webp` | IndexUI "El problema real" | **USER UPLOAD** — rider en moto con glow lumbar ámbar integrado, carretera desierto |
| `supabase/...676o65sijn4.webp` | IndexUI "Parte del equipo" — imagen principal (col-span-2) | rider usando RODATA de espaldas, studio quality |
| `supabase/...tl8qt6nmo8.webp` | IndexUI "Parte del equipo" — bottom left | cinturón RODATA solo, fondo oscuro premium |
| `supabase/...z730si7cdto.webp` | IndexUI "Parte del equipo" — bottom right | macro detalle correas y malla |
| `/lifestyle-1.jpg` | (no longer used in "Parte del equipo") | Can repurpose |
| `/lifestyle-2.jpg` | (no longer used in "Parte del equipo") | Can repurpose |
| `/lifestyle-3.jpg` | IndexUI final CTA background | Mexican mountain road, sunset |
| `/pdp-lifestyle-1.jpg` | PDP city lifestyle section | From session 2 — verify branding |

## Product Detail Page (ProductPageUI.tsx) — 11 Sections
1. **Main Product** — Dark #111315 bg, sticky gallery + full buy panel
   - Size pills with waist cm + collapsible size guide table
   - "Comprar ahora" amber CTA + "Agregar al carrito" outline
   - 3 trust icons + WhatsApp link
2. **Stats Bar** — +800 riders, 4.9★, 100% México (graphite bg)
3. **Lifestyle Break** — Full-bleed highway image + cinematic copy overlay (user real photo with RODATA)
4. **Feature Breakdown** — 3 alternating full-width sections (panel/correas/malla)
5. **Technical Specs** — Clean table on offwhite bg
6. **How to Wear** — 3 numbered steps + inline CTA (graphite bg)
7. **City Lifestyle Quote** — Full-bleed CDMX image + rider blockquote (`/pdp-lifestyle-1.jpg`)
8. **Reviews** — 5 verified reviews + 4.9/127 rating summary pill (dark bg)
9. **Guarantee** — 4 trust cards on offwhite bg
10. **FAQ** — 6 accordion items (graphite bg)
11. **Final CTA** — Dark centered with price + amber button
12. **Sticky Bottom Bar** — Shows when main CTA scrolls out

## Landing Page (IndexUI.tsx) — 11 Sections
1. Hero (new user photo + light overlay), 2. Benefits Bar, 3. Problem Section (user upload with integrated glow), 4. How It Works, 5. Lifestyle Grid (updated with new product photos),
6. For Whom, 7. Comparison Table, 8. Testimonials, 9. Guarantee, 10. FAQ, 11. Final CTA

## Product Info
- Title: Soporte Lumbar Rodata One
- Slug: soporte-lumbar-rodata-one
- Price: MX$749 / Compare at: MX$999
- Variants: S (60-75cm), M (75-90cm), L (90-100cm), XL (100-115cm)
- Status: active

## Tool Notes (for future sessions)
- `imagegen--edit_image`: Works, visible results. Good for style/lighting/scene edits. NOT good for adding graphic overlays (heat maps, glows, logos) on photorealistic photos — use CSS overlays instead.
- `user-uploads://` URLs: NOT directly accessible by imagegen tools — must use `lov-copy` first to get a proper URL.

## Next Steps / Known Issues
- Connect Stripe payment gateway (Dashboard)
- Update WhatsApp number from 5215500000000 to real number (EcommerceTemplate.tsx + ProductPageUI.tsx)
- Replace placeholder testimonials with real rider reviews post-launch
- `/pdp-lifestyle-1.jpg` (city lifestyle quote section) — verify if it has "Motosupport" branding
- `/lifestyle-3.jpg` — verify if it has "Motosupport" branding

## User Preferences
- Language: Spanish (Mexico)
- Tone: Premium, technical, no medical claims
- Mobile-first
- No fake countdown timers, no aggressive popups
- Dark sections mixed with light sections for visual rhythm
- Amber as primary CTA color
- Campaign-ready for Meta Ads — PDP is the landing page