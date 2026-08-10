/**
 * Canvas-based encoders. Runs entirely in the browser (no server runtime).
 * PNG is fully lossless (no toBlob round-trip); JPEG/WebP use native canvas
 * toBlob. Node tests cover only the pure helpers (see index.ts).
 */

const hasToBlob = (): boolean => typeof HTMLCanvasElement !== 'undefined' && typeof HTMLCanvasElement.prototype.toBlob === 'function';

/** True when the environment can perform canvas->blob encoding. */
export function canUseToBlob(): boolean {
  return hasToBlob();
}

export function newImageCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

/** Lossless PNG encoding via canvas.toBlob('image/png'). */
export async function encodePng(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('فشل ترميز الصورة إلى PNG.'));
    }, 'image/png');
  });
}

/**
 * Lossy JPEG/WebP encoding. `backgroundColor` is used when the image has
 * transparency and the target format cannot store alpha.
 */
export async function encodeLossy(
  canvas: HTMLCanvasElement,
  type: 'image/jpeg' | 'image/webp',
  quality: number,
  backgroundColor: string | null,
): Promise<Blob> {
  const target = newImageCanvas(canvas.width, canvas.height);
  const ctx = target.getContext('2d');
  if (!ctx) throw new Error('تعذّر إنشاء سياق الرسم.');
  if (backgroundColor) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, target.width, target.height);
  }
  ctx.drawImage(canvas, 0, 0);
  return new Promise((resolve, reject) => {
    target.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('فشل ترميز الصورة.'));
      },
      type,
      quality,
    );
  });
}

/** High-level encode: pick codec from the pure helper, then delegate. */
export async function encodeBlob(
  canvas: HTMLCanvasElement,
  opts: {
    type: 'image/jpeg' | 'image/png' | 'image/webp';
    quality?: number;
    backgroundColor?: string | null;
  },
): Promise<Blob> {
  const quality = opts.quality ?? 0.82;
  const bg = opts.backgroundColor ?? null;
  if (opts.type === 'image/png') return encodePng(canvas);
  return encodeLossy(canvas, opts.type, quality, bg);
}
