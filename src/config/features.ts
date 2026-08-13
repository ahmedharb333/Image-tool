/**
 * Feature flags — central switches for optional functionality.
 * Everything non-essential defaults to OFF.
 */

export const FEATURES = {
  /** Affiliate recommendation module — disabled until real programs exist. */
  affiliates: {
    enabled: false,
    programs: [] as { id: string; name: string; url: string; label: { ar: string } }[],
  },
  /** Consent management for analytics/advertising tags.
   * Disabled: Google's certified CMP (via AdSense) is the sole consent UI,
   * so the built-in banner is suppressed to avoid a duplicate EEA prompt. */
  consent: {
    enabled: false,
    cmp: null as null | { name: string; scriptUrl: string },
  },
  /** Analytics event tracking (respects consent). */
  analyticsEvents: true,
} as const;
