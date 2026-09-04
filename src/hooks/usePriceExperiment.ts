import { useEffect, useMemo, useRef } from 'react'
import { useFeatureFlagVariantKey } from '@posthog/react'
import { captureExperimentExposure } from '@/lib/experiments'
import { getExperimentPreview } from '@/lib/experimentPreview'
import { getActivePriceExperiment } from '@/experiments'
import { useFeatureFlagsReady } from '@/hooks/useExperiment'
import {
  isExperimentVariantKey,
  type ExperimentVariantKey,
  type PriceExperimentAssignment,
} from '@/types/experiments'

interface UsePriceExperimentInput {
  productId?: string
  variantId?: string
  catalogPrice: number
  /** Selling plans (subscriptions) opt out of price experiments entirely. */
  disabled?: boolean
}

interface UsePriceExperimentResult {
  resolvedPrice: number
  isReady: boolean
  isLoading: boolean
  experiment: PriceExperimentAssignment | null
}

const isDev = import.meta.env.DEV

/**
 * Resolves the price to display for a product/variant when a `product_price`
 * experiment targets it.
 *
 * PostHog assigns control/test; the displayed price then comes straight from
 * `manifest.variants[].price`, so there is no network round-trip in the render
 * path. The manifest is authoritative for PRESENTATION ONLY — `checkout-create`
 * re-validates the price against `store_experiments` using experiment_key +
 * experiment_variant, and the manifest price is never sent to the backend.
 *
 * Any missing manifest, unresolved flag or invalid price degrades silently to
 * the catalog price.
 */
export const usePriceExperiment = ({
  productId,
  variantId,
  catalogPrice,
  disabled,
}: UsePriceExperimentInput): UsePriceExperimentResult => {
  const manifest = disabled ? null : getActivePriceExperiment(productId, variantId)
  const flagKey = manifest?.flag_key ?? ''

  // Hooks must run unconditionally; an empty flag key is a no-op for PostHog.
  const posthogVariant = useFeatureFlagVariantKey(flagKey)
  const flagsReadyFromPh = useFeatureFlagsReady(!!manifest)
  const pv = getExperimentPreview()
  // A preview override skips PostHog entirely, so the price is available on the
  // very first render.
  const hasPreviewOverride = !!flagKey && pv?.exp === flagKey
  const rawVariant = hasPreviewOverride ? pv!.variant : posthogVariant
  const flagsReady = hasPreviewOverride ? true : flagsReadyFromPh

  const assignedVariant: ExperimentVariantKey | null =
    manifest && isExperimentVariantKey(rawVariant) ? rawVariant : null

  // Price for the assigned variant, straight from the manifest.
  const selectedVariant = manifest?.variants.find((entry) => entry.key === assignedVariant)
  const localPrice =
    typeof selectedVariant?.price === 'number' &&
    Number.isFinite(selectedVariant.price) &&
    selectedVariant.price >= 0
      ? selectedVariant.price
      : null

  // Memoized so consumers can safely use it as an effect dependency.
  const experiment: PriceExperimentAssignment | null = useMemo(() => {
    if (!manifest || !flagsReady || !assignedVariant || localPrice === null) return null
    return {
      id: manifest.id,
      key: manifest.flag_key,
      variant: assignedVariant,
      displayedPrice: localPrice,
    }
  }, [manifest, flagsReady, assignedVariant, localPrice])

  useEffect(() => {
    if (isDev && flagsReady && assignedVariant && localPrice === null) {
      console.warn(
        `[experiments] "${flagKey}" has no valid price for variant "${assignedVariant}", falling back to catalog price`,
      )
    }
  }, [flagsReady, assignedVariant, localPrice, flagKey])

  // Exposure is reported only for a resolved assignment, deduped by
  // experiment key + variant + displayed price.
  const exposedRef = useRef<Set<string>>(new Set())
  useEffect(() => {
    if (!experiment) return

    const dedupeKey = `${experiment.key}:${experiment.variant}:${experiment.displayedPrice}`
    if (exposedRef.current.has(dedupeKey)) return
    exposedRef.current.add(dedupeKey)

    captureExperimentExposure({
      experiment_type: 'product_price',
      experiment_id: experiment.id,
      experiment_key: experiment.key,
      experiment_variant: experiment.variant,
      target_type: variantId ? 'product_variant' : 'product',
      target_id: variantId ?? productId,
      product_id: productId,
      displayed_price: experiment.displayedPrice,
    })
  }, [experiment, productId, variantId])

  // ── A / B: no experiment for this target (or explicitly disabled) ──
  // Returns synchronously, issues zero requests and never blocks a CTA.
  const noExperiment: UsePriceExperimentResult = {
    resolvedPrice: catalogPrice,
    isReady: true,
    isLoading: false,
    experiment: null,
  }

  if (!manifest) return noExperiment

  // ── C: flags still loading → not ready, nothing to show yet ──
  if (!flagsReady) {
    return { resolvedPrice: catalogPrice, isReady: false, isLoading: true, experiment: null }
  }

  // ── D: flags settled but no valid assignment, or no usable manifest price ──
  if (!assignedVariant || !experiment) return noExperiment

  // ── E: experimental price resolved locally ──
  return {
    resolvedPrice: experiment.displayedPrice,
    isReady: true,
    isLoading: false,
    experiment,
  }
}
