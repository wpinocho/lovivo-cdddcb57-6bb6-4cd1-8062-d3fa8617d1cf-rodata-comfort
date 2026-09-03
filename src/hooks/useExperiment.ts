import { useCallback, useEffect, useRef, useState } from 'react';
import { useFeatureFlagVariantKey, usePostHog } from '@posthog/react';
import { captureExperimentExposure, trackExperimentEvent } from '@/lib/experiments';
import { isExperimentVariantKey, type ExperimentMetadata, type ExperimentVariantKey } from '@/types/experiments';

/**
 * Feature flags can legitimately never arrive (blocked script, offline, PostHog
 * down). Without a ceiling, every experiment-aware CTA would stay disabled, so
 * after this delay we treat flags as "settled" and fall back to the catalog
 * behaviour.
 */
const FLAGS_READY_TIMEOUT_MS = 3000;

/**
 * True once PostHog has finished evaluating feature flags for this visitor
 * (or the safety timeout elapsed). `onFeatureFlags` fires immediately when
 * flags are already available.
 *
 * Pass `enabled: false` when no experiment targets the caller, to avoid
 * subscribing and re-rendering for nothing.
 */
export function useFeatureFlagsReady(enabled = true): boolean {
  const posthog = usePostHog();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabled || ready) return;

    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = posthog?.onFeatureFlags?.(() => setReady(true));
    } catch {
      setReady(true);
    }

    const timeout = window.setTimeout(() => setReady(true), FLAGS_READY_TIMEOUT_MS);

    return () => {
      window.clearTimeout(timeout);
      try {
        unsubscribe?.();
      } catch {
        /* noop */
      }
    };
  }, [posthog, ready, enabled]);

  return ready;
}

/**
 * Hook for experiments that need more control than ExperimentSlot.
 *
 * Usage:
 *   const { variant, isReady, track } = useExperiment('exp-checkout-layout');
 *   // variant  = 'control' | 'test' | null   (null while flags load)
 *   // isReady  = flags settled
 *   // track('cta_clicked') → sends event with experiment context
 */
export function useExperiment(experimentKey: string, metadata?: ExperimentMetadata) {
  const rawVariant = useFeatureFlagVariantKey(experimentKey);
  const isReady = useFeatureFlagsReady();

  /** A real PostHog assignment, as opposed to the control fallback. */
  const assignedVariant: ExperimentVariantKey | null = isExperimentVariantKey(rawVariant)
    ? rawVariant
    : null;

  // Flag missing once loading finished → behave like control.
  const variant: ExperimentVariantKey | null = assignedVariant ?? (isReady ? 'control' : null);

  const exposedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!experimentKey || !assignedVariant) return;

    const dedupeKey = `${experimentKey}:${assignedVariant}`;
    if (exposedRef.current.has(dedupeKey)) return;
    exposedRef.current.add(dedupeKey);

    captureExperimentExposure({
      experiment_type: 'ui',
      ...metadata,
      experiment_key: experimentKey,
      experiment_variant: assignedVariant,
    });
    // `metadata` is intentionally not a dependency: it is usually an inline
    // object and the dedupe key already covers what identifies an exposure.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experimentKey, assignedVariant]);

  const track = useCallback(
    (eventName: string, properties?: Record<string, any>) => {
      trackExperimentEvent(experimentKey, eventName, properties);
    },
    [experimentKey]
  );

  return { variant, isReady, assignedVariant, track };
}
