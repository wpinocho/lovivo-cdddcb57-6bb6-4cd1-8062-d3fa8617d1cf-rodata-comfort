import React from 'react';
import { useExperiment } from '@/hooks/useExperiment';
import type { ExperimentMetadata } from '@/types/experiments';

interface ExperimentSlotProps {
  experimentKey: string;
  variants: Record<string, React.ReactNode>;
  fallback?: React.ReactNode;
  /** Extra context attached to the `experiment_exposure` event. */
  metadata?: ExperimentMetadata;
}

/**
 * Renders the correct variant based on a PostHog feature flag.
 * `useExperiment` handles the assignment and sends `experiment_exposure`
 * once a real variant has been assigned.
 *
 * Usage:
 *   <ExperimentSlot
 *     experimentKey="exp-homepage-cta-color"
 *     variants={{
 *       control: <Button className="bg-green-600">Comprar</Button>,
 *       test:    <Button className="bg-purple-600">Comprar</Button>,
 *     }}
 *     fallback={<Button className="bg-green-600">Comprar</Button>}
 *   />
 */
export function ExperimentSlot({ experimentKey, variants, fallback, metadata }: ExperimentSlotProps) {
  const { variant } = useExperiment(experimentKey, metadata);

  // While loading or if flag not found, show fallback (always control/original)
  if (!variant || !(variant in variants)) {
    return <>{fallback || variants['control'] || Object.values(variants)[0]}</>;
  }

  return <>{variants[variant]}</>;
}
