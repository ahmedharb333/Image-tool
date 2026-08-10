/**
 * Decoders. All browser-side. Decode is uniform via createImageBitmap
 * (or Image fallback where createImageBitmap is unavailable).
 */

import { newImageCanvas } from './encoders.ts';

type BitmapSource = ImageBitmap | HTMLImageElement;

function dimensionsOf(source: BitmapSource): { width: number; height: number } {
  if ('naturalWidth' in source) {
    return { width: source.naturalWidth, height: source.naturalHeight };
  }
  return { width: source.width, height: source.height };
}

async function createBitmap(source: Blob): Promise<BitmapSource> {
  if (typeof createImageBitmap === 'function') {
    return createImageBitmap(source);
  }
  // Fallback: <img> decode for legacy environments.
  const url = URL.createObjectURL(source);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Read any supported image Blob into a drawable canvas (preserves pixels). */
export async function toCanvas(source: Blob): Promise<HTMLCanvasElement> {
  const bmp = await createBitmap(source);
  const { width, height } = dimensionsOf(bmp);
  const canvas = newImageCanvas(width, height);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('تعذّر إنشاء سياق الرسم.');
  ctx.drawImage(bmp, 0, 0);
  return canvas;
}

export async function readImage(source: Blob): Promise<{ width: number; height: number; canvas: HTMLCanvasElement }> {
  const canvas = await toCanvas(source);
  return { width: canvas.width, height: canvas.height, canvas };
}

export async function readImageDimensions(file: Blob): Promise<{ width: number; height: number }> {
  const bmp = await createBitmap(file);
  const { width, height } = dimensionsOf(bmp);
  if (typeof (bmp as ImageBitmap).close === 'function') (bmp as ImageBitmap).close();
  return { width, height };
}
