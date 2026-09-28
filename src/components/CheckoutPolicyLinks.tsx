import { Fragment } from 'react'
import { whatsappUrl } from '@/lib/brand'

const LINKS = [
  { label: 'Devoluciones', href: '/politica-de-devoluciones' },
  { label: 'Envíos', href: '/politica-de-envios' },
  { label: 'Privacidad', href: '/aviso-de-privacidad' },
  { label: 'Términos', href: '/terminos-y-condiciones' },
  { label: 'WhatsApp', href: whatsappUrl('Hola, tengo una duda sobre mi compra') },
]

/** Enlaces discretos de políticas al pie del checkout. Solo presentación; abren en pestaña nueva para no perder el checkout. */
export const CheckoutPolicyLinks = () => (
  <nav aria-label="Políticas de la tienda" className="px-4 pb-8 pt-2">
    <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-brand-steel">
      {LINKS.map((link, i) => (
        <Fragment key={link.href}>
          {i > 0 && <span aria-hidden="true">·</span>}
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-smoke transition-colors"
          >
            {link.label}
          </a>
        </Fragment>
      ))}
    </p>
  </nav>
)