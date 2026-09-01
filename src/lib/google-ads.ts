/**
 * Google Ads (gtag.js) multitenant loader.
 *
 * The conversion ID and the conversion labels live in `store_settings`
 * (google_ads_conversion_id, google_ads_purchase_label, google_ads_labels),
 * so nothing is hardcoded per store. If a store has no conversion ID
 * configured, NOTHING is injected into the page.
 */

type GtagFn = (...args: any[]) => void;

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: GtagFn;
  }
}

export interface GoogleAdsItem {
  item_id: string;
  item_name?: string;
  price?: number;
  quantity?: number;
}

export interface GoogleAdsUserData {
  email?: string | null;
  phone?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  city?: string | null;
  region?: string | null;
  postal_code?: string | null;
  country?: string | null;
}

const SCRIPT_ID = 'google-ads-gtag';

class GoogleAdsTracker {
  private conversionId: string | null = null;
  private purchaseLabel: string | null = null;
  private labels: Record<string, string> = {};
  private initialized = false;
  private isDebug = process.env.NODE_ENV === 'development';

  private log(message: string, data?: any) {
    if (this.isDebug) console.log(`🟢 GoogleAds: ${message}`, data ?? '');
  }

  /** True once gtag.js is loaded and a conversion ID is configured. */
  private isReady(): boolean {
    return (
      this.initialized &&
      !!this.conversionId &&
      typeof window !== 'undefined' &&
      typeof window.gtag === 'function'
    );
  }

  /**
   * Injects gtag.js for the given AW- conversion ID.
   * Safe to call multiple times: it only injects once per ID.
   */
  init(
    conversionId?: string | null,
    purchaseLabel?: string | null,
    labels?: Record<string, string> | null
  ): void {
    if (typeof window === 'undefined') return;
    if (!conversionId) return;

    // Keep labels fresh even if the script is already loaded
    this.purchaseLabel = purchaseLabel || null;
    this.labels = labels || {};

    if (this.initialized && this.conversionId === conversionId) return;

    this.conversionId = conversionId;

    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag !== 'function') {
      window.gtag = function gtag() {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer!.push(arguments);
      } as GtagFn;
    }

    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${conversionId}`;
      document.head.appendChild(script);
    }

    window.gtag('js', new Date());
    window.gtag('config', conversionId, {
      allow_enhanced_conversions: true,
      // SPA: page views are sent manually on every route change
      send_page_view: false,
    });

    this.initialized = true;
    this.log('initialized', { conversionId, purchaseLabel, labels: this.labels });
  }

  /** Full `send_to` value for a conversion action, or null if no label exists. */
  private sendTo(labelKey: string): string | null {
    const label =
      labelKey === 'purchase'
        ? this.purchaseLabel || this.labels.purchase
        : this.labels?.[labelKey];
    if (!label || !this.conversionId) return null;
    return `${this.conversionId}/${label}`;
  }

  /** SPA page view. */
  pageView(path?: string): void {
    if (!this.isReady()) return;
    try {
      window.gtag!('event', 'page_view', {
        send_to: this.conversionId,
        page_path: path || window.location.pathname,
        page_location: window.location.href,
        page_title: document.title,
      });
      this.log('page_view', path);
    } catch (error) {
      console.error('❌ GoogleAds page_view error:', error);
    }
  }

  /**
   * Generic event. If a conversion label exists for `name`, it is sent as a
   * conversion action; otherwise it is sent as a plain event to the account.
   */
  event(name: string, params: Record<string, any> = {}): void {
    if (!this.isReady()) return;
    try {
      const sendTo = this.sendTo(name);
      window.gtag!('event', name, {
        ...params,
        send_to: sendTo || this.conversionId,
      });
      this.log(name, { ...params, send_to: sendTo || this.conversionId });
    } catch (error) {
      console.error(`❌ GoogleAds event error (${name}):`, error);
    }
  }

  /**
   * Enhanced conversions: gtag hashes this data client-side before sending.
   */
  setUserData(data: GoogleAdsUserData): void {
    if (!this.isReady()) return;
    try {
      const userData: Record<string, any> = {};
      if (data.email) userData.email = data.email.trim().toLowerCase();
      if (data.phone) userData.phone_number = data.phone.replace(/[^\d+]/g, '');

      const address: Record<string, any> = {};
      if (data.first_name) address.first_name = data.first_name.trim().toLowerCase();
      if (data.last_name) address.last_name = data.last_name.trim().toLowerCase();
      if (data.city) address.city = data.city.trim().toLowerCase();
      if (data.region) address.region = data.region.trim().toLowerCase();
      if (data.postal_code) address.postal_code = String(data.postal_code).trim();
      if (data.country) address.country = data.country.trim().toUpperCase();
      if (Object.keys(address).length > 0) userData.address = address;

      if (Object.keys(userData).length === 0) return;

      window.gtag!('set', 'user_data', userData);
      this.log('user_data set', Object.keys(userData));
    } catch (error) {
      console.error('❌ GoogleAds setUserData error:', error);
    }
  }

  /** Purchase conversion. Uses `google_ads_purchase_label`. */
  purchase(params: {
    value: number;
    currency: string;
    transactionId?: string;
    items?: GoogleAdsItem[];
  }): void {
    if (!this.isReady()) return;
    const sendTo = this.sendTo('purchase');
    if (!sendTo) {
      this.log('purchase skipped — no purchase label configured');
      return;
    }
    try {
      window.gtag!('event', 'conversion', {
        send_to: sendTo,
        value: params.value,
        currency: (params.currency || 'MXN').toUpperCase(),
        transaction_id: params.transactionId || '',
        ...(params.items && params.items.length > 0 ? { items: params.items } : {}),
      });
      this.log('purchase', params);
    } catch (error) {
      console.error('❌ GoogleAds purchase error:', error);
    }
  }
}

export const googleAds = new GoogleAdsTracker();
export default googleAds;