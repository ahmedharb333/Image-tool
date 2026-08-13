/**
 * Tool registry — the single source of truth for all tools:
 * routes, categories, related tools, guide links and publish status.
 * Formats are lowercase file extensions.
 */

import type { L10n } from '../lib/i18n';

export type ToolCategory = 'compress' | 'resize' | 'convert' | 'crop';

export interface ToolEntry {
  /** Stable machine id (used in analytics events later). */
  id: string;
  /** URL slug. */
  slug: string;
  category: ToolCategory;
  /** Localized titles. */
  title: L10n;
  /** Localized one-line description (used in cards + meta). */
  description: L10n;
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
    title: { ar: 'ضغط الصور', en: 'Compress images' },
    description: { ar: 'قلّص حجم صور JPG وPNG وWebP داخل متصفحك دون رفعها إلى أي خادم.', en: 'Shrink JPG, PNG and WebP images inside your browser without uploading them to any server.' },
    formats: ['jpg', 'jpeg', 'png', 'webp'],
    related: ['resize-image', 'convert-image'],
    guide: '',
    active: true,
  },
  {
    id: 'resize-image',
    slug: 'resize-image',
    category: 'resize',
    title: { ar: 'تغيير حجم الصور', en: 'Resize images' },
    description: { ar: 'غيّر أبعاد الصورة بالبكسل أو بالنسبة المئوية مع الحفاظ على أبعادها الأصلية.', en: 'Change image dimensions by pixels or percentage while preserving the original aspect ratio.' },
    formats: ['jpg', 'jpeg', 'png', 'webp'],
    related: ['compress-image', 'crop-image'],
    guide: '',
    active: true,
  },
  {
    id: 'convert-image',
    slug: 'convert-image',
    category: 'convert',
    title: { ar: 'تحويل صيغة الصور', en: 'Convert image format' },
    description: { ar: 'حوّل الصور بين JPG وPNG وWebP مع خيارات الجودة والخلفية داخل المتصفح.', en: 'Convert images between JPG, PNG and WebP with quality and background options, in the browser.' },
    formats: ['jpg', 'jpeg', 'png', 'webp'],
    related: ['compress-image', 'resize-image'],
    guide: '',
    active: true,
  },
  {
    id: 'crop-image',
    slug: 'crop-image',
    category: 'crop',
    title: { ar: 'قص الصور', en: 'Crop images' },
    description: { ar: 'اقصّ الصورة بحرية أو بنسب ثابتة مثل 1:1 و16:9 مع التدوير قبل القص.', en: 'Crop freely or to fixed ratios like 1:1 and 16:9, with rotation before cropping.' },
    formats: ['jpg', 'jpeg', 'png', 'webp'],
    related: ['resize-image', 'convert-image'],
    guide: '',
    active: true,
  },
];
