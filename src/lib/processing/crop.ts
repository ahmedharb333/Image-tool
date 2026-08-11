import type { CropBox } from './types.ts';

export function rotationToAngle(degrees: number): number {
  const d = degrees % 360;
  return d < 0 ? d + 360 : d;
}

/** Clamp a crop box to the image; optionally lock the aspect ratio. */
export function computeCrop(
  imageW: number,
  imageH: number,
  opts: { x: number; y: number; w: number; h: number; lockRatio?: boolean; baseRatio?: number },
): CropBox {
  let w = Math.max(1, Math.round(opts.w));
  let h = Math.max(1, Math.round(opts.h));
  let x = Math.max(0, Math.round(opts.x));
  let y = Math.max(0, Math.round(opts.y));

  if (opts.lockRatio && opts.baseRatio) {
    if (w / h > opts.baseRatio) h = Math.round(w / opts.baseRatio);
    else w = Math.round(h * opts.baseRatio);
  }

  // Clamp to image bounds.
  if (x + w > imageW) w = Math.max(1, imageW - x);
  if (y + h > imageH) h = Math.max(1, imageH - y);
  if (w > imageW) w = imageW;
  if (h > imageH) h = imageH;
  return { x, y, w, h };
}

export function parseDimensionInput(value: string | number | null | undefined): number | null {
  if (value == null) return null;
  const n = typeof value === 'number' ? value : Number(String(value).trim());
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.round(n);
}

export function parsePercentInput(value: string | number | null | undefined): number | null {
  if (value == null) return null;
  const n = typeof value === 'number' ? value : Number(String(value).trim());
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.round(n);
}
