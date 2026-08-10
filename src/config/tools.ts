/**
 * Tool registry — the single source of truth for all tools:
 * routes, categories, related tools, guide links and publish status.
 * Formats are lowercase file extensions.
 */

export type ToolCategory = 'compress' | 'resize' | 'convert' | 'crop';

export interface ToolEntry {
  /** Stable machine id (used in analytics events later). */
  id: string;
  /** URL slug. */
  slug: string;
  category: ToolCategory;
  /** Localized titles. */
  title: { ar: string };
  /** Localized one-line description (used in cards + meta). */
  description: { ar: string };
  /** Supported input file extensions, lowercase. */
  formats: string[];
  /** Slugs of related tools (internal linking). */
  related: string[];
  /** Slug of the primary explanatory guide ('' until guides exist). */
  guide: string;
  /** Whether the tool is published. */
  active: boolean;
}

export const TOOLS: ToolEntry[] = [
  {
    id: 'compress-image',
    slug: 'compress-image',
    category: 'compress',
    title: { ar: 'ضغط الصور' },
    description: { ar: 'قلّص حجم صور JPG وPNG وWebP داخل متصفحك دون رفعها إلى أي خادم.' },
    formats: ['jpg', 'jpeg', 'png', 'webp'],
    related: ['resize-image', 'convert-image'],
    guide: '',
    active: true,
  },
  {
    id: 'resize-image',
    slug: 'resize-image',
    category: 'resize',
    title: { ar: 'تغيير حجم الصور' },
    description: { ar: 'غيّر أبعاد الصورة بالبكسل أو بالنسبة المئوية مع الحفاظ على أبعادها الأصلية.' },
    formats: ['jpg', 'jpeg', 'png', 'webp'],
    related: ['compress-image', 'crop-image'],
    guide: '',
    active: true,
  },
  {
    id: 'convert-image',
    slug: 'convert-image',
    category: 'convert',
    title: { ar: 'تحويل صيغة الصور' },
    description: { ar: 'حوّل الصور بين JPG وPNG وWebP مع خيارات الجودة والخلفية داخل المتصفح.' },
    formats: ['jpg', 'jpeg', 'png', 'webp'],
    related: ['compress-image', 'resize-image'],
    guide: '',
    active: true,
  },
  {
    id: 'crop-image',
    slug: 'crop-image',
    category: 'crop',
    title: { ar: 'قص الصور' },
    description: { ar: 'اقصّ الصورة بحرية أو بنسب ثابتة مثل 1:1 و16:9 مع التدوير قبل القص.' },
    formats: ['jpg', 'jpeg', 'png', 'webp'],
    related: ['resize-image', 'convert-image'],
    guide: '',
    active: true,
  },
];
