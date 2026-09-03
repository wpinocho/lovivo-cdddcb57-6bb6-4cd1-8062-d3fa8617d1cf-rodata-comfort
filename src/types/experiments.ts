/**
 * Experiment runtime V1 — manifest schema.
 *
 * Manifests live in `src/experiments/<slug>.json` and are loaded by
 * `src/experiments/index.ts`. Only `schema_version: 1` is supported.
 *
 * V1 supports two experiment types:
 *   - `ui`            → PostHog decides the variant, the component renders it.
 *   - `product_price` → PostHog decides the variant, the Lovivo `experiment-resolve`
 *                       edge function is the authority for the price.
 */

export const EXPERIMENT_SCHEMA_VERSION = 1 as const

export type ExperimentType = 'ui' | 'product_price'
export type ExperimentStatus = 'active' | 'paused' | 'completed'

/** The only variant keys the runtime accepts. Anything else is ignored. */
export type ExperimentVariantKey = 'control' | 'test'

export interface ExperimentVariant {
  key: ExperimentVariantKey
  name: string
  weight: number
  /**
   * Informational only. NEVER used as an authoritative price —
   * `experiment-resolve` is the single source of truth.
   */
  price?: number
}

export interface ExperimentManifestBase {
  schema_version: 1
  name: string
  flag_key: string
  type: ExperimentType
  status: ExperimentStatus
  hypothesis: string
  target: Record<string, unknown>
  variants: ExperimentVariant[]
  primary_metric: Record<string, unknown>
}

export interface UIExperimentTarget extends Record<string, unknown> {
  route: string
  component: string
}

export interface UIExperimentManifest extends ExperimentManifestBase {
  type: 'ui'
  target: UIExperimentTarget
}

export interface ProductPriceExperimentTarget extends Record<string, unknown> {
  product_id: string
  variant_id?: string | null
}

export interface ProductPriceExperimentManifest extends ExperimentManifestBase {
  type: 'product_price'
  target: ProductPriceExperimentTarget
}

export type ExperimentManifest = UIExperimentManifest | ProductPriceExperimentManifest

/**
 * A resolved price-experiment assignment that travels with a cart line
 * so the displayed price and its experiment context never get separated.
 */
export interface PriceExperimentAssignment {
  id?: string
  key: string
  variant: ExperimentVariantKey
  displayedPrice: number
}

/** Optional context attached to experiment analytics events. */
export interface ExperimentMetadata {
  experiment_type?: ExperimentType
  target_type?: string
  target_id?: string
  product_id?: string
  displayed_price?: number
  [key: string]: unknown
}

/** Response contract of the central `experiment-resolve` edge function. */
export interface ExperimentResolveResponse {
  active: boolean
  experiment_id?: string
  experiment_key?: string
  experiment_variant?: ExperimentVariantKey
  unit_price: number
  fallback_reason?: string
}

export const isExperimentVariantKey = (value: unknown): value is ExperimentVariantKey =>
  value === 'control' || value === 'test'
