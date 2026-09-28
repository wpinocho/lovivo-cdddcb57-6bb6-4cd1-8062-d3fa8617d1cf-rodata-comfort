/**
 * Identidad pública de la marca — FUENTE ÚNICA.
 * Usar estas constantes en footer, políticas, títulos y metadata.
 * No usar `storeName` de settings para texto legal/público (puede traer valores antiguos).
 * No inventar razón social, RFC, dirección ni email.
 */
export const BRAND_NAME = 'RODATA'
export const SITE_URL = 'https://rodata.store'
export const BRAND_TAGLINE = 'Tienda online mexicana de productos para motociclistas'

export const WHATSAPP_DISPLAY = '+52 55 3121 5386'
export const WHATSAPP_NUMBER = '525531215386'

export const whatsappUrl = (message?: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}${message ? `?text=${encodeURIComponent(message)}` : ''}`

export const POLICY_LINKS = [
  { label: 'Sobre RODATA', href: '/sobre-rodata' },
  { label: 'Envíos', href: '/politica-de-envios' },
  { label: 'Devoluciones', href: '/politica-de-devoluciones' },
  { label: 'Privacidad', href: '/aviso-de-privacidad' },
  { label: 'Términos', href: '/terminos-y-condiciones' },
] as const