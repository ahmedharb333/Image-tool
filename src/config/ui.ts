/**
 * Bilingual UI strings (Arabic + English). Access with `tr(UI.x, locale)`.
 * Content data (tools, guides, pages) lives in their own config/content files;
 * this file holds interface chrome and tool-form labels only.
 */
import type { L10n } from '../lib/i18n';

export const UI = {
  // Chrome
  skipToContent: { ar: 'تخطَّ إلى المحتوى الرئيسي', en: 'Skip to main content' },
  mainNavAria: { ar: 'التنقل الرئيسي', en: 'Main navigation' },
  footerQuickLinks: { ar: 'روابط سريعة', en: 'Quick links' },
  footerLegal: { ar: 'الصفحات القانونية', en: 'Legal pages' },
  rightsReserved: {
    ar: 'جميع الحقوق محفوظة. تتم معالجة جميع الصور محليًا داخل متصفحك.',
    en: 'All rights reserved. Every image is processed locally in your browser.',
  },
  consentToggleLabel: { ar: 'الموافقة على ملفات تعريف الارتباط', en: 'Cookie consent' },
  switchToEnglish: { ar: 'English', en: 'English' },
  switchToArabic: { ar: 'العربية', en: 'العربية' },
  langSwitchAria: { ar: 'تغيير اللغة', en: 'Change language' },

  // Home
  heroBadge: {
    ar: '🔒 يعمل بالكامل داخل متصفحك — لا رفع للملفات',
    en: '🔒 Runs entirely in your browser — no uploads',
  },
  heroTitle: { ar: 'أدوات معالجة الصور داخل متصفحك', en: 'In-browser image processing tools' },
  heroText: {
    ar: 'ضغط، تغيير حجم، تحويل واقتصاص الصور — بالكامل محليًا دون رفع أي ملف إلى أي خادم.',
    en: 'Compress, resize, convert and crop images — fully local, without uploading any file to any server.',
  },
  startNow: { ar: 'ابدأ الآن', en: 'Start now' },
  sectionTools: { ar: 'الأدوات', en: 'Tools' },
  sectionHow: { ar: 'كيف تعمل؟', en: 'How it works' },
  sectionGuides: { ar: 'الأدلة', en: 'Guides' },
  toolCta: { ar: 'جرّب الآن ←', en: 'Try it →' },
  step1Strong: { ar: 'اختر صورة', en: 'Choose an image' },
  step1Rest: { ar: 'من جهازك', en: 'from your device' },
  step2Strong: { ar: 'عدّل الإعدادات', en: 'Adjust the settings' },
  step2Rest: { ar: '(الجودة، الأبعاد، الصيغة)', en: '(quality, dimensions, format)' },
  step3Strong: { ar: 'حمّل الناتج', en: 'Download the result' },
  step3Rest: { ar: '— ولا يغادر ملفك جهازك أبدًا', en: '— and your file never leaves your device' },

  // Tools index
  toolsIndexTitle: { ar: 'الأدوات', en: 'Tools' },
  toolsIndexDesc: {
    ar: 'جميع أدوات معالجة الصور المحلية في مكان واحد.',
    en: 'All local image-processing tools in one place.',
  },
  catAll: { ar: 'الكل', en: 'All' },
  catCompress: { ar: 'الضغط', en: 'Compress' },
  catResize: { ar: 'تغيير الحجم', en: 'Resize' },
  catConvert: { ar: 'التحويل', en: 'Convert' },
  catCrop: { ar: 'القص', en: 'Crop' },
  toolsSearchPlaceholder: { ar: 'ابحث عن أداة…', en: 'Search for a tool…' },
  toolsSearchAria: { ar: 'البحث في الأدوات', en: 'Search tools' },

  // Tool common
  breadcrumbAria: { ar: 'مسار التنقل', en: 'Breadcrumb' },
  crumbHome: { ar: 'الرئيسية', en: 'Home' },
  crumbTools: { ar: 'الأدوات', en: 'Tools' },
  dropTitle: { ar: 'اسحب صورة هنا أو اضغط للاختيار', en: 'Drag an image here or click to choose' },
  outputFormat: { ar: 'الصيغة الناتجة', en: 'Output format' },
  optWebp: { ar: 'WebP (موصى به)', en: 'WebP (recommended)' },
  optJpg: { ar: 'JPG', en: 'JPG' },
  optPng: { ar: 'PNG (بدون فقدان)', en: 'PNG (lossless)' },
  qualityPrefix: { ar: 'الجودة: ', en: 'Quality: ' },
  qualitySuffix: { ar: '٪', en: '%' },
  reset: { ar: 'إعادة تعيين', en: 'Reset' },

  // Compress
  compressMaxSize: { ar: 'الحد الأقصى للحجم (اختياري، بالكيلوبايت)', en: 'Max size (optional, KB)' },
  compressMaxSizePlaceholder: { ar: 'مثال: 500', en: 'e.g. 500' },
  compressProcess: { ar: 'ضغط الصورة', en: 'Compress image' },

  // Resize
  resizeMode: { ar: 'نوع التحجيم', en: 'Resize mode' },
  resizeByPixel: { ar: 'بالبكسل', en: 'By pixels' },
  resizeByPercent: { ar: 'بالنسبة المئوية', en: 'By percentage' },
  resizeByMax: { ar: 'الحد الأقصى للأبعاد', en: 'Max dimension' },
  resizeWidth: { ar: 'العرض (بكسل)', en: 'Width (px)' },
  resizeHeight: { ar: 'الارتفاع (بكسل)', en: 'Height (px)' },
  resizePercent: { ar: 'النسبة المئوية', en: 'Percentage' },
  resizeLongEdge: { ar: 'أطول ضلع (بكسل)', en: 'Longest edge (px)' },
  resizeProcess: { ar: 'تغيير الحجم', en: 'Resize' },

  // Convert
  convertWhiteBg: { ar: 'خلفية بيضاء (للشفافية في JPG)', en: 'White background (for transparency in JPG)' },
  convertProcess: { ar: 'تحويل الصورة', en: 'Convert image' },

  // Crop
  cropX: { ar: 'س (يسار)', en: 'X (left)' },
  cropY: { ar: 'ص (أعلى)', en: 'Y (top)' },
  cropW: { ar: 'العرض', en: 'Width' },
  cropH: { ar: 'الارتفاع', en: 'Height' },
  cropRatio: { ar: 'نسبة الأبعاد', en: 'Aspect ratio' },
  cropFree: { ar: 'حر', en: 'Free' },
  cropLockRatio: { ar: 'قفل نسبة الأبعاد', en: 'Lock aspect ratio' },
  cropRotate: { ar: 'تدوير', en: 'Rotate' },
  cropProcess: { ar: 'قص الصورة', en: 'Crop image' },
} satisfies Record<string, L10n>;
