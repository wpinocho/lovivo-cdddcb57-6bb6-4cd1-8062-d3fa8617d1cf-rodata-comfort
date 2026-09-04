import React, { useEffect } from 'react';
import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from '@posthog/react';
import { STORE_ID } from '@/lib/config';

const POSTHOG_KEY = 'phc_ru49b7F3aVosgfA5g91sIGxRC2iBU0RMWFekcI5iSR7';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && POSTHOG_KEY) {
      posthog.init(POSTHOG_KEY, {
        api_host: '/ingest',
        ui_host: 'https://us.posthog.com',
        person_profiles: 'identified_only',
        capture_pageview: false,
        capture_pageleave: true,
        autocapture: false,
        // @ts-ignore — valid PostHog config, types lag behind SDK
        enable_exception_autocapture: true,
        
        persistence: 'localStorage+cookie',
        cross_subdomain_cookie: false,
        
        debug: process.env.NODE_ENV === 'development',
        
        disable_session_recording: false,
        advanced_disable_decide: false,
        
        loaded: (ph) => {
          console.log('✅ PostHog loaded successfully!');
          console.log('🏪 Store ID:', STORE_ID);

          const storeProperties = {
            store_id: STORE_ID,
            domain: window.location.hostname,
            environment: process.env.NODE_ENV || 'production',
            initialized_at: new Date().toISOString(),
          };

          // store_id on every event — experiment analytics depend on it
          ph.register({ store_id: STORE_ID });

          // Keep PostHog group association for analytics/grouping.
          ph.group('store', STORE_ID, storeProperties);

          // store_id is the tenant targeting property used by experiment flags.
          // Pass it explicitly to flag evaluation so the first evaluation can
          // match immediately without waiting for person-property ingestion.
          // `false` avoids a duplicate reload — we trigger it explicitly below.
          ph.setPersonPropertiesForFlags({ store_id: STORE_ID }, false);

          // Re-evaluate flags now that store_id is available for targeting, so
          // experiment assignments are correct for this store before any
          // experiment runs.
          ph.reloadFeatureFlags();

          const groups = ph.getGroups();
          console.log('✅ PostHog group created for store:', STORE_ID);
          console.log('📊 Active groups:', groups);

          ph.capture('$pageview', {
            $current_url: window.location.href,
            $pathname: window.location.pathname,
          });
          console.log('📄 Initial pageview captured after group setup');
        },
      });
    }
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

export { usePostHog, useFeatureFlagVariantKey, useFeatureFlagEnabled } from '@posthog/react';
