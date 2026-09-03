import { useEffect, useMemo, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useFeatureFlagVariantKey } from '@posthog/react'
import { callEdge } from '@/lib/edge'
import { STORE_ID } from '@/lib/config'
import { captureExperimentExposure } from '@/lib/experiments'
import { getExperimentPreview } from '@/lib/experimentPreview'
import { getActivePriceExperiment } from '@/experiments'
import { useFeatureFlagsReady } from '@/hooks/useExperiment'
import {
  isExperimentVariantKey,
  type ExperimentResolveResponse,
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
 * The central `experiment-resolve` edge function is the ONLY authority for the
 * price — `variants[].price` in the manifest is never used. Any failure, missing
 * flag or missing manifest degrades silently to the catalog price.
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
  const rawVariant = pv?.exp === flagKey ? pv.variant : posthogVariant
  const flagsReady = pv?.exp === flagKey ? true : flagsReadyFromPh

  const assignedVariant: ExperimentVariantKey | null =
    manifest && isExperimentVariantKey(rawVariant) ? rawVariant : null

  const shouldResolve = !!manifest && flagsReady && !!assignedVariant

  const { data, isFetching, isError } = useQuery<ExperimentResolveResponse>({
    queryKey: ['experiment-resolve', STORE_ID, productId, variantId ?? null, flagKey, assignedVariant],
    enabled: shouldResolve,
    queryFn: () =>
      callEdge('experiment-resolve', {
        store_id: STORE_ID,
        product_id: productId,
        variant_id: variantId ?? null,
        experiment_key: flagKey,
        experiment_variant: assignedVariant,
      }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (isError && isDev) {
      console.warn(
        `[experiments] experiment-resolve failed for "${flagKey}", falling back to catalog price`,
      )
    }
  }, [isError, flagKey])

  // ── A / B: no experiment for this target (or explicitly disabled) ──
  // Returns synchronously, issues zero requests and never blocks a CTA.
  const noExperiment: UsePriceExperimentResult = {
    resolvedPrice: catalogPrice,
    isReady: true,
    isLoading: false,
    experiment: null,
  }

  // Memoized so consumers can safely use it as an effect dependency.
  const experiment: PriceExperimentAssignment | null = useMemo(() => {
    const resolvedVariant = data?.experiment_variant ?? assignedVariant
    const hasAuthorizedPrice =
      !!data &&
      data.active === true &&
      typeof data.unit_price === 'number' &&
      Number.isFinite(data.unit_price) &&
      isExperimentVariantKey(resolvedVariant)

    if (!hasAuthorizedPrice) return null
    return {
      id: data!.experiment_id,
      key: data!.experiment_key ?? flagKey,
      variant: resolvedVariant as ExperimentVariantKey,
      displayedPrice: data!.unit_price,
    }
  }, [data, assignedVariant, flagKey])

  // Exposure is reported only for an authorized experimental price, deduped by
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

  if (!manifest) return noExperiment

  // ── C.2: flags still loading → not ready, nothing to show yet ──
  if (!flagsReady) {
    return { resolvedPrice: catalogPrice, isReady: false, isLoading: true, experiment: null }
  }

  // ── C.6: flags settled but no assignment → catalog price, no request ──
  if (!assignedVariant) return noExperiment

  // ── C.7: waiting on the authoritative price from experiment-resolve ──
  if (isFetching && !data) {
    return { resolvedPrice: catalogPrice, isReady: false, isLoading: true, experiment: null }
  }

  // ── D: resolve failed, or backend says the experiment is not active ──
  if (!experiment) return noExperiment

  // ── E: authorized experimental price ──
  return {
    resolvedPrice: experiment.displayedPrice,
    isReady: true,
    isLoading: false,
    experiment,
  }
}
