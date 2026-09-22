import { forwardRef } from "react"
import { cn } from "@/lib/utils"

/**
 * PDP pack selector — UI experiment exp-cdddcb57-pdp-second-belt-offer (test only).
 * Pure presentation: every amount comes from `offer`, which HeadlessProduct
 * derives from the REAL shared BOGO rule via central pricing. No hardcoded %.
 */
export interface PackOfferQuote {
  singlePrice: number
  firstPrice: number
  secondPrice: number
  listTotal: number
  total: number
}

interface SizeOption { name: string; values: string[] }

interface PackOfferSelectorProps {
  offer: PackOfferQuote
  packQuantity: 1 | 2
  onPackChange: (q: 1 | 2) => void
  option?: SizeOption
  secondValue?: string
  onSecondSelect: (optName: string, value: string) => void
  isSecondAvailable: (optName: string, value: string) => boolean
  getSizeKey: (value: string) => string
  getSizeHint?: (value: string) => string | undefined
  showSecondError: boolean
  disabled?: boolean
  formatMoney: (n: number) => string
}

const Radio = ({ on }: { on: boolean }) => (
  <span className={cn("h-4 w-4 rounded-full border-2 flex items-center justify-center flex-shrink-0",
    on ? "border-brand-amber" : "border-brand-steel")}>
    {on && <span className="h-2 w-2 rounded-full bg-brand-amber" />}
  </span>
)

export const PackOfferSelector = forwardRef<HTMLDivElement, PackOfferSelectorProps>(({
  offer, packQuantity, onPackChange, option, secondValue, onSecondSelect,
  isSecondAvailable, getSizeKey, getSizeHint, showSecondError, disabled, formatMoney,
}, secondRef) => {
  const pct = offer.firstPrice > 0 ? Math.round((1 - offer.secondPrice / offer.firstPrice) * 100) : 0
  const card = (on: boolean) => cn(
    "w-full flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all disabled:opacity-60",
    on ? "border-brand-amber bg-brand-amber/[0.07] shadow-[0_0_16px_rgba(201,139,46,0.15)]"
       : "border-white/[0.12] bg-brand-graphite hover:border-brand-amber/50"
  )

  return (
    <div className="space-y-3" role="radiogroup" aria-label="Elige tu opción">
      <p className="text-brand-smoke text-sm font-sora font-semibold">Elige tu opción</p>

      <button type="button" role="radio" aria-checked={packQuantity === 1} disabled={disabled}
        onClick={() => onPackChange(1)} className={card(packQuantity === 1)}>
        <Radio on={packQuantity === 1} />
        <div className="flex-1 min-w-0">
          <p className="font-sora font-semibold text-brand-offwhite text-sm">1 Rodata One</p>
          <p className="text-brand-steel text-xs font-inter">Para ti</p>
        </div>
        <span className="font-sora font-bold text-brand-offwhite">{formatMoney(offer.singlePrice)}</span>
      </button>

      <button type="button" role="radio" aria-checked={packQuantity === 2} disabled={disabled}
        onClick={() => onPackChange(2)} className={card(packQuantity === 2)}>
        <Radio on={packQuantity === 2} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-sora font-semibold text-brand-offwhite text-sm">2 Rodata One</p>
            {pct > 0 && (
              <span className="bg-brand-amber text-brand-carbon text-[10px] font-sora font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                2.ª al {pct}%
              </span>
            )}
          </div>
          <p className="text-brand-steel text-xs font-inter mt-0.5">Una para ti y otra para quien rueda contigo.</p>
          <p className="text-brand-smoke text-[11px] font-inter mt-1">
            Primera {formatMoney(offer.firstPrice)} · segunda {formatMoney(offer.secondPrice)}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-brand-steel text-xs line-through font-inter">{formatMoney(offer.listTotal)}</p>
          <p className="font-sora font-bold text-brand-offwhite">{formatMoney(offer.total)}</p>
        </div>
      </button>

      {packQuantity === 2 && option && (
        <div ref={secondRef} className={cn("rounded-xl border p-4 space-y-3 bg-brand-graphite/60",
          showSecondError ? "border-brand-amber" : "border-white/[0.08]")}>
          <p className="text-brand-smoke text-sm font-sora font-semibold">Talla de la segunda faja</p>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isSelected = secondValue === value
              const ok = isSecondAvailable(option.name, value)
              const hint = getSizeHint?.(value)
              return (
                <button key={value} type="button" disabled={!ok || disabled}
                  onClick={() => onSecondSelect(option.name, value)}
                  className={cn("flex flex-col items-center min-w-[68px] px-3 py-2.5 rounded-xl border text-sm transition-all font-sora",
                    isSelected ? "bg-brand-amber text-brand-carbon border-brand-amber font-bold"
                    : ok ? "bg-brand-graphite border-white/[0.12] text-brand-smoke hover:border-brand-amber/50"
                    : "opacity-40 cursor-not-allowed bg-brand-graphite border-white/[0.08] text-brand-steel")}>
                  <span className="font-bold">{getSizeKey(value)}</span>
                  {hint && <span className={cn("text-[10px] font-inter mt-0.5", isSelected ? "text-brand-carbon/70" : "text-brand-steel")}>{hint}</span>}
                </button>
              )
            })}
          </div>
          {!secondValue && (
            <p className={cn("text-xs font-inter", showSecondError ? "text-brand-amber-light" : "text-brand-steel")}>
              Elige la talla de la segunda faja para continuar.
            </p>
          )}
        </div>
      )}
    </div>
  )
})
PackOfferSelector.displayName = "PackOfferSelector"