/**
 * Advertising configuration — all values stay empty/disabled until real
 * publisher IDs are supplied. Never invent IDs.
 */

export const ADS = {
  /** Master switch. Advertising stays OFF until set to true deliberately. */
  enabled: false,
  /** Test mode renders nothing public and never shows test ads as real. */
  testMode: true,
  /** AdSense publisher ID placeholder — replace with the real one (pub-...). */
  publisherId: '',
  /** Global AdSense head code placeholder. Inserted between <head> tags only
   * when enabled && publisherId is set && a real code is provided. */
  headCode: '',
  /** Individual ad-slot IDs per location. */
  slots: {
    belowIntro: '',
    afterResult: '',
    inContent: '',
    sidebar: '',
    betweenGuideSections: '',
  },
  /** Google Auto Ads — kept disabled by default. */
  autoAds: false,
  /** Configurable ad locations (used by the AdSlot component). */
  locations: ['belowIntro', 'afterResult', 'inContent', 'sidebar', 'betweenGuideSections'] as const,
} as const;

/**
 * ads.txt record template. When a real publisher ID is supplied, generate:
 * google.com, <publisherId>, DIRECT, f08c47fec0942fa0
 */
export function adsTxtFor(publisherId: string): string {
  return `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`;
}
