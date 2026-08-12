import { encodeBlob, readImage } from '../image/index.ts';
import { computeReduction } from './utils.ts';
import type { CropBox, OutputFormat, ProcessResult } from './types.ts';

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

/** Browser-side crop (with optional rotation): read, crop, rotate, re-encode. */
export async function cropImage(
  blob: Blob,
  opts: {
    x: number;
    y: number;
    w: number;
    h: number;
    lockRatio?: boolean;
    baseRatio?: number;
    rotate?: number;
    format: OutputFormat;
    quality?: number;
    backgroundColor?: string | null;
  },
): Promise<ProcessResult> {
  const { width, height, canvas } = await readImage(blob);
  const box = computeCrop(width, height, opts);
  const angle = rotationToAngle(opts.rotate ?? 0);
  let out = document.createElement('canvas');
  out.width = box.w;
  out.height = box.h;
  let ctx = out.getContext('2d')!;
  if (opts.backgroundColor) {
    ctx.fillStyle = opts.backgroundColor;
    ctx.fillRect(0, 0, out.width, out.height);
  }
  ctx.drawImage(canvas, box.x, box.y, box.w, box.h, 0, 0, box.w, box.h);
  if (angle !== 0) {
    const rotated = document.createElement('canvas');
    rotated.width = angle === 90 || angle === 270 ? out.height : out.width;
    rotated.height = angle === 90 || angle === 270 ? out.width : out.height;
    const rctx = rotated.getContext('2d')!;
    if (opts.backgroundColor) {
      rctx.fillStyle = opts.backgroundColor;
      rctx.fillRect(0, 0, rotated.width, rotated.height);
    }
    rctx.translate(rotated.width / 2, rotated.height / 2);
    rctx.rotate((angle * Math.PI) / 180);
    rctx.drawImage(out, -out.width / 2, -out.height / 2);
    out = rotated;
  }
  const type = opts.format === 'jpg' ? 'image/jpeg' : opts.format === 'png' ? 'image/png' : 'image/webp';
  const result = await encodeBlob(out, { type, quality: opts.quality ?? 0.85, backgroundColor: opts.backgroundColor ?? null });
  return { blob: result, width: out.width, height: out.height, sourceSize: blob.size, resultSize: result.size, reduction: computeReduction(blob.size, result.size), format: opts.format };
}
