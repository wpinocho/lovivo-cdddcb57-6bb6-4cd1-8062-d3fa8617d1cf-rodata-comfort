import { useCallback, useEffect, useRef, useState } from 'react'
import { trackCustomEvent, trackPH, trackViewContent } from '@/lib/tracking-utils'
import { ADV_PDP_PATH, ADV_PRODUCT_ID, ADV_SLUG } from '@/data/advertorialEspalda'

export type AdvCta = 'cta1_mecanismo' | 'cta2_producto' | 'cta3_cierre' | 'sticky'

const SCROLL_MARKS = [25, 50, 75, 100] as const
const STICKY_THRESHOLD = 0.4

/**
 * Medición del advertorial:
 * - Pixel/CAPI: ViewContent al cargar + evento propio `AdvertorialCTAClick` (también llega a PostHog).
 * - PostHog: `advertorial_scroll` a 25/50/75/100 %.
 * - Links a la PDP conservan los UTMs del anuncio y marcan el CTA en `utm_term`.
 */
export function useAdvertorialTracking(variant: string) {
  const fired = useRef(new Set<number>())
  const [showSticky, setShowSticky] = useState(false)

  useEffect(() => {
    trackViewContent({
      products: [{ id: ADV_PRODUCT_ID, name: 'Soporte Lumbar Rodata One' }],
      content_category: 'advertorial',
      custom_parameters: { advertorial: ADV_SLUG, variant },
    })
    trackPH('advertorial_view', { advertorial: ADV_SLUG, variant })
  }, [variant])

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        const max = document.documentElement.scrollHeight - window.innerHeight
        const progress = max > 0 ? window.scrollY / max : 1
        setShowSticky(progress >= STICKY_THRESHOLD)
        SCROLL_MARKS.forEach((mark) => {
          const reached = mark === 100 ? progress >= 0.98 : progress >= mark / 100
          if (reached && !fired.current.has(mark)) {
            fired.current.add(mark)
            trackPH('advertorial_scroll', { advertorial: ADV_SLUG, variant, depth: mark })
          }
        })
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [variant])

  /** URL a la PDP: conserva UTMs/fbclid entrantes, marca el CTA en utm_term */
  const ctaHref = useCallback(
    (cta: AdvCta) => {
      const params = new URLSearchParams(window.location.search)
      params.delete('v')
      if (!params.get('utm_source')) {
        params.set('utm_source', 'advertorial')
        params.set('utm_medium', 'web')
        params.set('utm_campaign', ADV_SLUG)
      }
      params.set('utm_term', `adv_${variant}_${cta}`)
      return `${ADV_PDP_PATH}?${params.toString()}`
    },
    [variant]
  )

  const onCtaClick = useCallback(
    (cta: AdvCta) => {
      trackCustomEvent('AdvertorialCTAClick', {
        advertorial: ADV_SLUG,
        variant,
        cta,
        content_ids: [ADV_PRODUCT_ID],
      })
    },
    [variant]
  )

  return { showSticky, ctaHref, onCtaClick }
}