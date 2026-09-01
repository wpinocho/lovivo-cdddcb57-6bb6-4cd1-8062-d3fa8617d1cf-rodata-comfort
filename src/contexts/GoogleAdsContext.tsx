import React, { createContext, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';
import { googleAds } from '@/lib/google-ads';

interface GoogleAdsContextType {
  conversionId: string | null;
  purchaseLabel: string | null;
  labels: Record<string, string> | null;
  loading: boolean;
}

const GoogleAdsContext = createContext<GoogleAdsContextType | undefined>(undefined);

/**
 * Loads gtag.js when the store has a Google Ads conversion ID configured
 * and sends a manual page_view on every SPA route change.
 *
 * MUST be rendered inside <BrowserRouter> (uses useLocation).
 */
export function GoogleAdsProvider({ children }: { children: React.ReactNode }) {
  const { googleAdsId, googleAdsPurchaseLabel, googleAdsLabels, isLoading } = useSettings();
  const location = useLocation();

  // Single effect: init (idempotent) + one page_view per route.
  // Guard avoids a duplicate page_view when settings resolve after mount.
  const lastPathRef = React.useRef<string | null>(null);

  useEffect(() => {
    if (isLoading || !googleAdsId) return;

    googleAds.init(googleAdsId, googleAdsPurchaseLabel, googleAdsLabels);

    const path = location.pathname + location.search;
    if (lastPathRef.current === path) return;
    lastPathRef.current = path;
    googleAds.pageView(path);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    googleAdsId,
    googleAdsPurchaseLabel,
    googleAdsLabels,
    isLoading,
    location.pathname,
    location.search,
  ]);

  return (
    <GoogleAdsContext.Provider
      value={{
        conversionId: googleAdsId,
        purchaseLabel: googleAdsPurchaseLabel,
        labels: googleAdsLabels,
        loading: isLoading,
      }}
    >
      {children}
    </GoogleAdsContext.Provider>
  );
}

export const useGoogleAds = () => {
  const context = useContext(GoogleAdsContext);
  if (context === undefined) {
    throw new Error('useGoogleAds must be used within a GoogleAdsProvider');
  }
  return context;
};