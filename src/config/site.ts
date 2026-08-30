/**
 * Central site configuration.
 * Edit brand, domain, contact, colors and dates here only.
 */

export type Locale = 'ar' | 'en';

export const LOCALES: Locale[] = ['ar', 'en'];
export const DEFAULT_LOCALE: Locale = 'ar';

export const SITE = {
  /** Live domain. */
  url: 'https://tools.worldly.pro',
  /** Brand name (display). */
  brandName: { ar: 'أدوات وردلي', en: 'Worldly Tools' },
  /** Short brand tagline. */
  tagline: {
    ar: 'أدوات مجانية داخل متصفحك — للصور والمستندات وأكثر، دون رفع أي ملف',
    en: 'Free in-browser tools — images, documents and more, with no uploads',
  },
  /** Owner / editorial placeholder. Kept empty until real info is provided. */
  owner: {
    name: { ar: '', en: '' },
    email: 'contact@worldly.pro',
    emailDisplay: { ar: 'بريد إلكتروني', en: 'email' },
  },
  /** Editorial placeholder — no invented people. */
  reviewerPlaceholder: {
    ar: 'المراجِع: سيُذكر اسم المراجِع المعتمد هنا',
    en: 'Reviewer: an approved reviewer name will be listed here',
  },
  /** Default last-reviewed date (ISO). Update as content is reviewed. */
  lastReviewedDefault: '2026-08-10',
  /** Contact route handling: mailto-based (no server backend). */
  contact: {
    useMailto: true,
    mailtoSubject: {
      ar: 'رسالة من موقع أدوات وردلي',
      en: 'Message from Worldly Tools',
    },
  },
} as const;

export const LOGO = {
  /** Rendered as text (no image assets). */
  text: { ar: 'أدوات وردلي', en: 'Worldly Tools' },
  /** Arabic-English combined lockup used in footer. */
  lockup: { ar: 'أدوات وردلي — Worldly Tools', en: 'Worldly Tools — أدوات وردلي' },
} as const;

export const THEME = {
  /** Brand colors (kept in sync with styles/tokens.css). */
  primary: '#12305C',
  accent: '#0E8A6D',
  background: '#FFFFFF',
  altBackground: '#F6F8FB',
  text: '#16233A',
} as const;
