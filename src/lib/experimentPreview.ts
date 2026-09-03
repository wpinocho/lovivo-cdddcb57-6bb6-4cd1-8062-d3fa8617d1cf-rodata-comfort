const KEY = 'lovivo_experiment_preview';

export function initExperimentPreview() {
  const p = new URLSearchParams(window.location.search);
  const exp = p.get('lovivo_exp'), variant = p.get('lovivo_variant');
  if (exp && (variant === 'control' || variant === 'test')) {
    sessionStorage.setItem(KEY, JSON.stringify({ exp, variant }));
  }
}

export function getExperimentPreview(): { exp: string; variant: 'control' | 'test' } | null {
  try { return JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch { return null; }
}

export const isPreviewMode = () => !!getExperimentPreview();
