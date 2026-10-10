import { useState } from "react"
import { Star, Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { PHOTO_REVIEWS, TEXT_REVIEWS, type RodataReview } from "@/data/rodataReviews"

const INITIAL_TEXT_REVIEWS = 4

const ReviewStars = ({ count, size = 12 }: { count: number; size?: number }) => (
  <div className="flex gap-0.5" aria-label={`${count} de 5 estrellas`}>
    {[1, 2, 3, 4, 5].map(s => (
      <Star
        key={s}
        size={size}
        className={s <= count ? "text-brand-amber fill-brand-amber" : "text-brand-steel/30"}
      />
    ))}
  </div>
)

const ReviewerLine = ({ review }: { review: RodataReview }) => (
  <div className="flex items-center gap-3">
    <div className="h-9 w-9 rounded-full bg-brand-amber/15 border border-brand-amber/30 flex items-center justify-center flex-shrink-0">
      <span className="font-sora font-bold text-brand-amber text-sm">{review.name.charAt(0)}</span>
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-sora font-semibold text-brand-offwhite text-sm flex items-center gap-1.5">
        {review.name}
        <Check size={11} className="text-brand-amber" aria-hidden />
      </p>
      <p className="text-brand-steel text-xs font-inter truncate">{review.tag ?? "Compra verificada"}</p>
    </div>
  </div>
)

interface RodataReviewsProps {
  reviewCount: number
}

const RodataReviews = ({ reviewCount }: RodataReviewsProps) => {
  const [showAll, setShowAll] = useState(false)
  const visibleText = showAll ? TEXT_REVIEWS : TEXT_REVIEWS.slice(0, INITIAL_TEXT_REVIEWS)
  const hiddenCount = TEXT_REVIEWS.length - INITIAL_TEXT_REVIEWS

  return (
    <section id="opiniones" className="bg-brand-carbon py-16 lg:py-28 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-brand-amber text-xs font-sora font-semibold uppercase tracking-[0.18em] mb-2 block">Reseñas de clientes</span>
            <h2 className="font-sora font-bold text-brand-offwhite text-3xl sm:text-4xl">Lo que dicen los riders</h2>
            <p className="text-brand-steel text-sm font-inter mt-2">Reseñas de los últimos 2 meses, compartidas por clientes por WhatsApp.</p>
          </div>
          <div className="flex items-center gap-4 bg-brand-graphite border border-white/[0.08] rounded-2xl px-6 py-4 flex-shrink-0">
            <div>
              <p className="font-sora font-bold text-brand-amber text-3xl leading-none">4.9</p>
              <div className="mt-1.5"><ReviewStars count={5} size={11} /></div>
            </div>
            <div className="h-12 w-px bg-white/[0.08]" />
            <div>
              <p className="text-brand-offwhite font-sora font-bold text-lg leading-none">{reviewCount}</p>
              <p className="text-brand-steel text-xs font-inter mt-1">reseñas</p>
            </div>
          </div>
        </div>

        {/* Reseñas con foto real — carrusel en móvil, grid en desktop */}
        <div
          className="flex md:grid md:grid-cols-3 gap-4 md:gap-5 overflow-x-auto md:overflow-visible snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 pb-2"
          style={{ scrollbarWidth: "none" }}
        >
          {PHOTO_REVIEWS.map(review => (
            <article
              key={review.name}
              className="flex-shrink-0 w-[82%] sm:w-[60%] md:w-auto snap-start bg-brand-graphite border border-white/[0.07] rounded-2xl overflow-hidden flex flex-col"
            >
              <div className="relative aspect-square overflow-hidden bg-brand-carbon">
                <img
                  src={review.photo}
                  alt={`Foto real de ${review.name} con su RODATA`}
                  className="w-full h-full object-cover"
                  style={review.photoPos ? { objectPosition: review.photoPos } : undefined}
                  loading="lazy"
                />
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-brand-carbon/80 backdrop-blur-sm rounded-full px-2.5 py-1">
                  <Check size={10} className="text-brand-amber" />
                  <span className="text-brand-amber text-[10px] font-inter font-medium">Foto real del cliente</span>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1 gap-3">
                <ReviewerLine review={review} />
                <ReviewStars count={review.stars} />
                <blockquote className="text-brand-smoke text-sm font-inter leading-relaxed">"{review.text}"</blockquote>
              </div>
            </article>
          ))}
        </div>

        {/* Reseñas de texto */}
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {visibleText.map(review => (
            <article key={review.name} className="bg-brand-graphite border border-white/[0.07] rounded-2xl p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <ReviewerLine review={review} />
                <ReviewStars count={review.stars} />
              </div>
              <blockquote className="text-brand-smoke text-sm font-inter leading-relaxed">"{review.text}"</blockquote>
            </article>
          ))}
        </div>

        {hiddenCount > 0 && (
          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={() => setShowAll(v => !v)}
              className="inline-flex items-center gap-2 border border-brand-amber/40 text-brand-amber font-sora font-semibold text-sm rounded-full px-6 py-3 hover:bg-brand-amber/10 transition-colors"
            >
              {showAll ? "Ver menos reseñas" : `Ver ${hiddenCount} reseñas más`}
              <ChevronDown size={16} className={cn("transition-transform", showAll && "rotate-180")} />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default RodataReviews