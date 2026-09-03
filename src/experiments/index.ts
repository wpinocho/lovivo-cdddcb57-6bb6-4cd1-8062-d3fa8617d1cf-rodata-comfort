/**
 * Experiment registry — runtime V1.
 *
 * Reads every `src/experiments/*.json` manifest at build time and exposes the
 * subset that is valid AND active. A malformed manifest is skipped (warning in
 * development only) so a bad JSON can never break the build or the storefront.
 */

import {
  EXPERIMENT_SCHEMA_VERSION,
  isExperimentVariantKey,
  type ExperimentManifest,
  type ExperimentVariant,
  type ProductPriceExperimentManifest,
  type UIExperimentManifest,
} from '@/types/experiments'

export const EXPERIMENT_RUNTIME_VERSION = 1

const isDev = import.meta.env.DEV

const warn = (message: string, detail?: unknown) => {
  if (!isDev) return
  if (detail === undefined) console.warn(`[experiments] ${message}`)
  else console.warn(`[experiments] ${message}`, detail)
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0

const isValidVariant = (value: unknown): value is ExperimentVariant => {
  if (!isRecord(value)) return false
  if (!isExperimentVariantKey(value.key)) return false
  if (!isNonEmptyString(value.name)) return false
  if (typeof value.weight !== 'number' || !Number.isFinite(value.weight)) return false
  if (value.price !== undefined && (typeof value.price !== 'number' || !Number.isFinite(value.price))) return false
  return true
}

/**
 * Defensive structural validation. Intentionally simple — no external schema
 * library — but strict enough that anything reaching the runtime is usable.
 */
const validateManifest = (source: string, raw: unknown): ExperimentManifest | null => {
  if (!isRecord(raw)) {
    warn(`${source}: manifest is not an object, ignoring`)
    return null
  }

  if (raw.schema_version !== EXPERIMENT_SCHEMA_VERSION) {
    warn(`${source}: unsupported schema_version ${String(raw.schema_version)}, ignoring`)
    return null
  }

  if (!isNonEmptyString(raw.name) || !isNonEmptyString(raw.flag_key) || !isNonEmptyString(raw.hypothesis)) {
    warn(`${source}: missing name / flag_key / hypothesis, ignoring`)
    return null
  }

  if (raw.status !== 'active' && raw.status !== 'paused' && raw.status !== 'completed') {
    warn(`${source}: invalid status ${String(raw.status)}, ignoring`)
    return null
  }

  if (!isRecord(raw.target) || !isRecord(raw.primary_metric)) {
    warn(`${source}: target and primary_metric must be objects, ignoring`)
    return null
  }

  if (!Array.isArray(raw.variants) || !raw.variants.every(isValidVariant)) {
    warn(`${source}: variants must all be valid control/test entries, ignoring`)
    return null
  }

  const variantKeys = new Set(raw.variants.map((v) => v.key))
  if (!variantKeys.has('control') || !variantKeys.has('test') || variantKeys.size !== raw.variants.length) {
    warn(`${source}: variants must contain exactly one 'control' and one 'test', ignoring`)
    return null
  }

  if (raw.type === 'ui') {
    if (!isNonEmptyString(raw.target.route) || !isNonEmptyString(raw.target.component)) {
      warn(`${source}: ui target requires route and component, ignoring`)
      return null
    }
    return raw as unknown as UIExperimentManifest
  }

  if (raw.type === 'product_price') {
    if (!isNonEmptyString(raw.target.product_id)) {
      warn(`${source}: product_price target requires product_id, ignoring`)
      return null
    }
    const variantId = raw.target.variant_id
    if (variantId !== undefined && variantId !== null && !isNonEmptyString(variantId)) {
      warn(`${source}: product_price target variant_id must be a string or null, ignoring`)
      return null
    }
    return raw as unknown as ProductPriceExperimentManifest
  }

  warn(`${source}: unsupported type ${String(raw.type)}, ignoring`)
  return null
}

const loadManifests = (): ExperimentManifest[] => {
  const modules = import.meta.glob<unknown>('./*.json', { eager: true })
  const manifests: ExperimentManifest[] = []

  // Sorted by file path so "pick one deterministically" is stable across builds.
  for (const source of Object.keys(modules).sort()) {
    const mod = modules[source] as { default?: unknown } | unknown
    const raw = isRecord(mod) && 'default' in mod ? (mod as { default: unknown }).default : mod
    const manifest = validateManifest(source, raw)
    if (manifest) manifests.push(manifest)
  }

  return manifests
}

/** Every valid manifest, regardless of status. */
const ALL_MANIFESTS: ExperimentManifest[] = loadManifests()

const ACTIVE_MANIFESTS: ExperimentManifest[] = ALL_MANIFESTS.filter((m) => m.status === 'active')

export const listActiveExperiments = (): ExperimentManifest[] => ACTIVE_MANIFESTS

export const getActiveExperimentByFlagKey = (flagKey: string): ExperimentManifest | null => {
  if (!isNonEmptyString(flagKey)) return null
  const matches = ACTIVE_MANIFESTS.filter((m) => m.flag_key === flagKey)
  if (matches.length === 0) return null
  if (matches.length > 1) {
    warn(`multiple active experiments share flag_key "${flagKey}", using the first one`, matches.map((m) => m.name))
  }
  return matches[0]
}

/**
 * Finds the active `product_price` experiment for a product/variant pair.
 *
 * A manifest targeting a specific `variant_id` only matches that variant.
 * A manifest with `variant_id` null/absent applies to the whole product.
 * Variant-specific manifests win over product-level ones.
 */
export const getActivePriceExperiment = (
  productId?: string | null,
  variantId?: string | null,
): ProductPriceExperimentManifest | null => {
  if (!isNonEmptyString(productId)) return null

  const candidates = ACTIVE_MANIFESTS.filter(
    (m): m is ProductPriceExperimentManifest =>
      m.type === 'product_price' && m.target.product_id === productId,
  )
  if (candidates.length === 0) return null

  const variantScoped = isNonEmptyString(variantId)
    ? candidates.filter((m) => m.target.variant_id === variantId)
    : []
  const productScoped = candidates.filter(
    (m) => m.target.variant_id === null || m.target.variant_id === undefined,
  )

  const matches = variantScoped.length > 0 ? variantScoped : productScoped
  if (matches.length === 0) return null
  if (matches.length > 1) {
    warn(
      `multiple active product_price experiments target product ${productId}${variantId ? ` / variant ${variantId}` : ''}, using "${matches[0].name}"`,
      matches.map((m) => m.name),
    )
  }
  return matches[0]
}
