import { useEffect, useRef } from "react"
import { AlertCircle, Info, X } from "lucide-react"
import { trackPH } from "@/lib/tracking-utils"
import {
  usePaymentRecovery,
  clearPaymentFailure,
  PAYMENT_SECTION_ANCHOR_ID,
  PAYPAL_ANCHOR_ID,
} from "@/lib/payment-recovery"

function smoothScrollTo(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" })
}

/**
 * Banner persistente de recuperación de pago.
 * Reemplaza los toasts efímeros: se queda hasta que el usuario reintenta o lo cierra.
 */
export default function PaymentRecoveryBanner() {
  const { failure, attempts, focusToken, alternatives } = usePaymentRecovery()
  const shownRef = useRef<string | null>(null)

  const showAlternatives =
    !!failure && (failure.suggestAlternatives || attempts >= 2)

  const chips: { key: string; label: string; target: string }[] = []
  if (failure && showAlternatives) {
    if (alternatives.paypal && failure.kind !== "cancelled") {
      chips.push({ key: "paypal", label: "Pagar con PayPal", target: PAYPAL_ANCHOR_ID })
    }
    if (failure.kind === "cancelled") {
      chips.push({ key: "card", label: "Pagar con tarjeta", target: PAYMENT_SECTION_ANCHOR_ID })
    }
    if (alternatives.oxxo) {
      chips.push({ key: "oxxo", label: "Pagar en OXXO", target: PAYMENT_SECTION_ANCHOR_ID })
    }
    if (alternatives.spei) {
      chips.push({ key: "spei", label: "Transferencia SPEI", target: PAYMENT_SECTION_ANCHOR_ID })
    }
  }

  // Scroll + evento cuando aparece un fallo nuevo o alguien pide foco.
  useEffect(() => {
    if (!failure) {
      shownRef.current = null
      return
    }
    const signature = `${failure.kind}:${failure.code ?? ""}:${failure.declineCode ?? ""}:${attempts}:${focusToken}`
    if (shownRef.current === signature) return
    shownRef.current = signature

    trackPH("payment_recovery_shown", {
      kind: failure.kind,
      error_code: failure.code,
      decline_code: failure.declineCode,
      attempts,
      alternatives_shown: chips.map((c) => c.key),
    })

    smoothScrollTo(PAYMENT_SECTION_ANCHOR_ID)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [failure, attempts, focusToken])

  if (!failure) return null

  const isNeutral = failure.tone === "neutral"
  const Icon = isNeutral ? Info : AlertCircle

  return (
    <div
      role="alert"
      aria-live="polite"
      className={[
        "rounded-lg border p-4 flex items-start gap-3",
        isNeutral
          ? "bg-brand-amber/10 border-brand-amber/30"
          : "bg-destructive/10 border-destructive/30",
      ].join(" ")}
    >
      <Icon
        size={18}
        className={`mt-0.5 shrink-0 ${isNeutral ? "text-brand-amber" : "text-destructive"}`}
      />

      <div className="flex-1 min-w-0 space-y-2">
        <p
          className={`font-sora font-semibold text-sm leading-snug ${
            isNeutral ? "text-brand-amber-light" : "text-destructive"
          }`}
        >
          {failure.title}
        </p>
        <p className="text-sm text-brand-smoke leading-relaxed">{failure.body}</p>

        {chips.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {chips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={() => {
                  trackPH("payment_recovery_alternative_clicked", {
                    from_kind: failure.kind,
                    alternative: chip.key,
                  })
                  smoothScrollTo(chip.target)
                }}
                className="px-3 py-1.5 rounded-md border border-white/[0.18] bg-white/[0.04] text-xs font-medium text-brand-offwhite hover:border-brand-amber/50 hover:text-brand-amber-light transition-colors"
              >
                {chip.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={clearPaymentFailure}
        aria-label="Cerrar aviso"
        className="shrink-0 text-brand-steel hover:text-brand-offwhite transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  )
}