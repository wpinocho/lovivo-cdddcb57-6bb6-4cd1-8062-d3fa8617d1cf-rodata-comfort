import posthog from 'posthog-js';
import { STORE_ID } from '@/lib/config';
import { getExperimentPreview } from '@/lib/experimentPreview';
import { isExperimentVariantKey, type ExperimentType, type ExperimentVariantKey } from '@/types/experiments';

/** Drops undefined/null entries so PostHog events stay clean. */
const compact = (properties: Record<string, unknown>): Record<string, unknown> => {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(properties)) {
    if (value === undefined || value === null) continue;
    out[key] = value;
  }
  return out;
};

/**
 * Track a custom event with experiment context attached.
 * Automatically reads the current variant from PostHog and includes it in the event.
 *
 * Usage:
 *   trackExperimentEvent('exp-homepage-cta-color', 'cta_clicked', { position: 'hero' });
 */
export function trackExperimentEvent(
  experimentKey: string,
  eventName: string,
  properties?: Record<string, any>
) {
  const pv = getExperimentPreview();
  const variant = pv?.exp === experimentKey ? pv.variant : posthog.getFeatureFlag(experimentKey);
  if (variant) {
    posthog.capture(eventName, {
      ...properties,
      store_id: STORE_ID,
      experiment_key: experimentKey,
      experiment_variant: variant,
    });
  }
}

export interface ExperimentExposureInput {
  experiment_key: string;
  experiment_variant: ExperimentVariantKey | string | null | undefined;
  experiment_type?: ExperimentType;
  experiment_id?: string;
  target_type?: string;
  target_id?: string;
  product_id?: string;
  displayed_price?: number;
  [key: string]: unknown;
}

/**
 * Captures the canonical `experiment_exposure` event.
 *
 * Only fires for a real assignment (`control` | `test`) — a missing or loading
 * flag must never be reported as an exposure.
 */
export function captureExperimentExposure(input: ExperimentExposureInput) {
  const { experiment_key: experimentKey, experiment_variant: variant, ...rest } = input;

  if (!experimentKey || !isExperimentVariantKey(variant)) return;

  posthog.capture(
    'experiment_exposure',
    compact({
      ...rest,
      store_id: STORE_ID,
      experiment_key: experimentKey,
      experiment_variant: variant,
      $pathname: typeof window !== 'undefined' ? window.location.pathname : undefined,
    })
  );
}
