# Rodata.mx — Plan

## Current State
Premium moto lumbar support PDP. Store is live and looking great.

## Recent Changes
- Fixed ScrollLink to handle hash-only hrefs (`#section`) — now scrolls within current page regardless of pathname
- Fixed navLinks prop wiring in EcommerceTemplate (was ignoring the prop)
- PDP navLinks: "Por qué funciona" → `#por-que-funciona`, "Opiniones" → `#opiniones`, "FAQ" → `#faq`
- WhatsApp number updated to +52 55 3121 5386
- Hero description: "El soporte confiado por los motociclistas mexicanos diseñado para eliminar el dolor de espalda"
- Removed all em-dashes from copy
- Merged "En tres pasos" + "Compra sin riesgo" into "Listo en segundos. Sin riesgo."

## Known Issues
- None currently

## Key Files
- `src/pages/ui/ProductPageUI.tsx` — main PDP
- `src/templates/EcommerceTemplate.tsx` — header/footer/nav
- `src/components/ScrollLink.tsx` — handles anchor scroll logic