import { useState } from "react"
import { Star, Check, ChevronDown, ChevronRight } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { PHOTO_REVIEWS, TEXT_REVIEWS, ALL_REVIEWS, REVIEW_STATS, formatReviewDate, type RodataReview } from "@/data/rodataReviews"

const INITIAL_TEXT_REVIEWS = 5
const LOAD_MORE_STEP = 10

const ReviewStars = ({ count, size = 12 }: { count: number; size?: number }) => (
  <div className="flex gap-0.5" aria-label={`${count} de 5 estrellas`}>
    {[1, 2, 3, 4, 5].map(s => (
      <Star
        key={s}
        size={size}
        className={s <= Math.round(count) ? "text-brand-amber fill-brand-amber" : "text-brand-steel/30"}
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
      <p className="text-brand-steel text-xs font-inter truncate">
        {review.tag ?? "Compra verificada"}
        {review.date && <> · <time dateTime={review.date}>{formatReviewDate(review.date)}</time></>}
      </p>
    </div>
  </div>
)

/** Tarjeta de reseña (texto + foto opcional) usada en la lista y en el modal */
const ReviewCard = ({ review }: { review: RodataReview }) => (
  <article className="bg-brand-graphite border border-white/[0.07] rounded-2xl p-5 flex flex-col gap-3">
    <div className="flex items-start justify-between gap-3">
      <ReviewerLine review={review} />
      <ReviewStars count={review.stars} />
    </div>
    <blockquote className="text-brand-smoke text-sm font-inter leading-relaxed">"{review.text}"</blockquote>
    {review.photo && (
      <img
        src={review.photo}
        alt={`Foto real de ${review.name} con su RODATA`}
        className="w-24 h-24 rounded-xl object-cover"
        style={review.photoPos ? { objectPosition: review.photoPos } : undefined}
        loading="lazy"
      />
    )}
  </article>
)

/** Modal con solo las reseñas de N estrellas */
const StarFilterModal = ({ stars, onClose }: { stars: number | null; onClose: () => void }) => {
  const filtered = stars ? ALL_REVIEWS.filter(r => r.stars === stars) : []

  return (
    <Dialog open={stars !== null} onOpenChange={open => !open && onClose()}>
      <DialogContent className="w-[calc(100%-1.5rem)] max-w-xl max-h-[85vh] p-0 gap-0 flex flex-col overflow-hidden rounded-2xl bg-brand-carbon border-white/10 text-brand-offwhite">
        <DialogHeader className="p-5 pb-4 border-b border-white/[0.08] text-left">
          <DialogTitle className="font-sora text-lg flex items-center gap-2">
            Reseñas de {stars}
            <Star size={16} className="text-brand-amber fill-brand-amber" aria-hidden />
          </DialogTitle>
          <DialogDescription className="text-brand-steel text-xs font-inter">
            {filtered.length} {filtered.length === 1 ? "opinión" : "opiniones"} de {REVIEW_STATS.total}
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto p-4 space-y-3">
          {filtered.map((review, i) => (
            <ReviewCard key={`${review.name}-${review.date ?? i}`} review={review} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

/** Resumen tipo "4.3 ★ · barras por estrella" — calculado de las reseñas publicadas. Cada fila abre el modal filtrado. */
const ReviewSummary = ({ onSelectStars }: { onSelectStars: (stars: number) => void }) => {
  const { average, total, distribution } = REVIEW_STATS
  const max = Math.max(...distribution.map(d => d.count), 1)

  return (
    <div className="bg-brand-graphite border border-white/[0.08] rounded-2xl p-5 sm:p-6 grid grid-cols-[auto_1fr] gap-5 sm:gap-8 items-center md:max-w-xl">
      <div className="text-center">
        <p className="font-sora font-bold text-brand-offwhite text-5xl leading-none">{average.toFixed(1)}</p>
        <div className="mt-2 flex justify-center"><ReviewStars count={average} size={15} /></div>
        <p className="text-brand-steel text-xs font-inter mt-1.5">{total} opiniones</p>
      </div>
      <ul className="space-y-1.5" aria-label="Distribución de calificaciones">
        {distribution.map(({ stars, count }) => (
          <li key={stars}>
            <button
              type="button"
              disabled={count === 0}
              onClick={() => onSelectStars(stars)}
              aria-label={`Ver ${count} reseñas de ${stars} estrellas`}
              className="group w-full flex items-center gap-2.5 text-xs font-inter py-0.5 rounded-md enabled:hover:bg-white/[0.04] disabled:opacity-50 disabled:cursor-default transition-colors"
            >
            <span className="text-brand-smoke w-6 flex items-center gap-0.5 flex-shrink-0">
              {stars}<Star size={10} className="text-brand-amber fill-brand-amber" aria-hidden />
            </span>
            <span className="relative flex-1 h-1.5 rounded-full bg-brand-carbon overflow-hidden">
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-brand-amber"
                style={{ width: `${(count / max) * 100}%` }}
              />
            </span>
            <span className="text-brand-steel w-6 text-right tabular-nums flex-shrink-0 group-enabled:group-hover:text-brand-amber">{count}</span>
            <ChevronRight size={12} className="text-brand-steel/60 flex-shrink-0 group-disabled:invisible" aria-hidden />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

const RodataReviews = () => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_TEXT_REVIEWS)
  const [starFilter, setStarFilter] = useState<number | null>(null)
  const visibleText = TEXT_REVIEWS.slice(0, visibleCount)
  const remaining = TEXT_REVIEWS.length - visibleCount
  const nextBatch = Math.min(LOAD_MORE_STEP, remaining)

  return (
    <section id="opiniones" className="bg-brand-carbon py-16 lg:py-28 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-[1fr_auto] gap-6 md:gap-10 items-end mb-10">
          <div>
            <span className="text-brand-amber text-xs font-sora font-semibold uppercase tracking-[0.18em] mb-2 block">Reseñas de clientes</span>
            <h2 className="font-sora font-bold text-brand-offwhite text-3xl sm:text-4xl">Lo que dicen los riders</h2>
          </div>
          <ReviewSummary onSelectStars={setStarFilter} />
        </div>

        {/* Reseñas con foto real — carrusel en móvil, grid en desktop */}
        <div
          className="flex gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 pb-2"
          style={{ scrollbarWidth: "none" }}
        >
          {PHOTO_REVIEWS.map(review => (
            <article
              key={review.name}
              className="flex-shrink-0 w-[82%] sm:w-[60%] md:w-[31%] snap-start bg-brand-graphite border border-white/[0.07] rounded-2xl overflow-hidden flex flex-col"
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

        {/* Reseñas de texto — 5 iniciales, luego de 10 en 10 */}
        <div className="grid md:grid-cols-2 gap-4 mt-6" aria-live="polite">
          {visibleText.map((review, i) => (
            <ReviewCard key={`${review.name}-${review.date ?? i}`} review={review} />
          ))}
        </div>

        {remaining > 0 && (
          <div className="flex flex-col items-center gap-2 mt-8">
            <button
              type="button"
              onClick={() => setVisibleCount(c => c + LOAD_MORE_STEP)}
              className="inline-flex items-center gap-2 border border-brand-amber/40 text-brand-amber font-sora font-semibold text-sm rounded-full px-7 py-3 hover:bg-brand-amber/10 transition-colors"
            >
              Cargar {nextBatch} reseñas más
              <ChevronDown size={16} aria-hidden />
            </button>
            <p className="text-brand-steel text-xs font-inter">
              Mostrando {visibleCount + PHOTO_REVIEWS.length} de {REVIEW_STATS.total}
            </p>
          </div>
        )}
      </div>

      <StarFilterModal stars={starFilter} onClose={() => setStarFilter(null)} />
    </section>
  )
}

export default RodataReviews