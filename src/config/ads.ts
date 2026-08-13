/**
 * Advertising configuration — all values stay empty/disabled until real
 * publisher IDs are supplied. Never invent IDs.
 */

export const ADS = {
  /** Master switch. Advertising stays OFF until set to true deliberately. */
  enabled: true,
  /** Test mode: false so the AdSense head loader runs (verification + Auto Ads).
   * No manual <ins> slots render until slot IDs are set post-approval. */
  testMode: false,
  /** AdSense publisher ID (pub-...). */
  publisherId: 'pub-2317129100484201',
  /** Global AdSense head loader. Inserted between <head> tags. */
  headCode: '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2317129100484201" crossorigin="anonymous"></script>',
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
