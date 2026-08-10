/**
 * Pure file/format helpers. No DOM access — unit-testable in node.
 */

const EXT_TO_MIME: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
};

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

/** First up-to-16 bytes as a lowercase hex string. */
export function readSignature(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf.slice(0, Math.min(16, buf.byteLength)));
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Sniff the real image type from file content. Returns null when not an image. */
export function detectImageMime(buf: ArrayBuffer): string | null {
  const sig = readSignature(buf);
  if (sig.startsWith('ffd8ff')) return 'image/jpeg';
  if (sig.startsWith('89504e47')) return 'image/png';
  if (sig.startsWith('52494646') && sig.length >= 24 && sig.slice(16, 24) === '57454250') return 'image/webp';
  if (sig.startsWith('474946')) return 'image/gif';
  return null;
}

export function mimeToExtension(mime: string): string {
  return MIME_TO_EXT[mime] ?? 'bin';
}

/** Strip path separators, control chars, leading dots and trim; fall back to 'image'. */
export function sanitizeFilename(name: string): string {
  const cleaned = name.replace(/[\\/:*?"<>|\x00-\x1f]/g, '').trim().replace(/^\.+/, '');
  return cleaned === '' || cleaned === '.' || cleaned === '..' ? 'image' : cleaned;
}

/** Lowercase extension without the dot; '' when absent or hidden-only. */
export function extensionOf(name: string): string {
  const idx = name.lastIndexOf('.');
  if (idx <= 0) return '';
  return name.slice(idx + 1).toLowerCase();
}

/** Base filename without extension, sanitized. */
export function baseNameOf(name: string): string {
  const idx = name.lastIndexOf('.');
  return idx > 0 ? sanitizeFilename(name.slice(0, idx)) : sanitizeFilename(name);
}

export function buildOutputFilename(original: string, suffix: string, ext: string): string {
  return `${baseNameOf(original)}-${suffix}.${ext}`;
}

/** Format bytes with Latin digits (deliberate: matches site output rule). */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '';
  if (bytes < 1024) return `${Math.round(bytes)} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export function reductionPercent(original: number, result: number): number {
  if (original <= 0) return 0;
  return Math.max(0, Math.round((1 - result / original) * 100));
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  detectedMime: string | null;
}

/**
 * Validate an image file against the tool's supported formats.
 * Checks size limit, extension allow-list, real content signature,
 * and extension/content consistency (rejects renamed non-images).
 */
export function validateImageFile(
  formats: string[],
  name: string,
  size: number,
  maxSize: number,
  buffer: ArrayBuffer,
): ValidationResult {
  const errors: string[] = [];
  const ext = extensionOf(name);
  const detectedMime = detectImageMime(buffer);

  if (size === 0) errors.push('الملف فارغ (0 بايت).');
  if (size > maxSize) errors.push(`حجم الملف يتجاوز الحد الأقصى المسموح به (${formatBytes(maxSize)}).`);

  const formatSet = new Set(formats);
  if (!formatSet.has(ext)) {
    errors.push(`نوع الملف غير مدعوم (${ext || 'بدون امتداد'}). الصيغ المدعومة: ${formats.join('، ')}.`);
  }

  if (!detectedMime) {
    errors.push('محتوى الملف لا يبدو أنه صورة صالحة.');
  } else if (ext !== '' && EXT_TO_MIME[ext] !== detectedMime) {
    errors.push('محتوى الملف لا يطابق امتداده. قد يكون الملف معاد تسميته.');
  }

  return { valid: errors.length === 0, errors, detectedMime };
}
