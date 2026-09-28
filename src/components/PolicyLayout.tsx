import { ReactNode, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { EcommerceTemplate } from '@/templates/EcommerceTemplate'
import { BRAND_NAME, SITE_URL } from '@/lib/brand'

/** Título + canonical (rodata.store) para páginas informativas/legales. Restaura al desmontar. */
export const usePolicyPageMeta = (title: string, description?: string) => {
  const { pathname } = useLocation()

  useEffect(() => {
    const prevTitle = document.title
    document.title = `${title} | ${BRAND_NAME}`

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    const createdCanonical = !canonical
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    const prevCanonical = canonical.href
    canonical.href = `${SITE_URL}${pathname}`

    const descTag = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const prevDesc = descTag?.content
    if (descTag && description) descTag.content = description

    return () => {
      document.title = prevTitle
      if (createdCanonical) canonical?.remove()
      else if (canonical) canonical.href = prevCanonical
      if (descTag && prevDesc !== undefined) descTag.content = prevDesc
    }
  }, [title, description, pathname])
}

interface PolicyLayoutProps {
  title: string
  metaTitle?: string
  description?: string
  updated?: string
  children: ReactNode
}

export const PolicyLayout = ({ title, metaTitle, description, updated, children }: PolicyLayoutProps) => {
  usePolicyPageMeta(metaTitle ?? title, description)

  return (
    <EcommerceTemplate>
      <article className="max-w-3xl mx-auto py-8 px-4 space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          {updated && <p className="text-muted-foreground text-sm">{updated}</p>}
        </header>
        {children}
      </article>
    </EcommerceTemplate>
  )
}

export const PolicySection = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="space-y-3">
    <h2 className="text-xl font-semibold text-foreground">{title}</h2>
    <div className="text-foreground/80 leading-relaxed space-y-3">{children}</div>
  </section>
)

export const PolicyLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <a
    href={href}
    target={href.startsWith('http') ? '_blank' : undefined}
    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
    className="text-primary underline underline-offset-2"
  >
    {children}
  </a>
)