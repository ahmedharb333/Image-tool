import { encodeBlob, readImage } from '../image/index.ts';
import { computeReduction } from './utils.ts';
import type { OutputFormat, ProcessResult, Size } from './types.ts';

/**
 * Pure dimension math. All values are integers >= 1.
 * `mode`:
 *   - 'pixel': fit within width/height box (keep aspect unless both given → exact box)
 *   - 'percent': scale by percent (>= 1)
 *   - 'max': cap the longer side at `max`
 */
export function computeResize(
  width: number,
  height: number,
  opts: { mode: 'pixel' | 'percent' | 'max'; width?: number; height?: number; percent?: number; max?: number },
): Size {
  const w = Math.max(1, Math.round(width));
  const h = Math.max(1, Math.round(height));

  if (opts.mode === 'pixel' && opts.width && opts.height) {
    return { width: Math.max(1, Math.round(opts.width)), height: Math.max(1, Math.round(opts.height)) };
  }

  if (opts.mode === 'pixel' && opts.width) {
    const ratio = h / w;
    const nw = Math.max(1, Math.round(opts.width));
    return { width: nw, height: Math.max(1, Math.round(nw * ratio)) };
  }

  if (opts.mode === 'pixel' && opts.height) {
    const ratio = w / h;
    const nh = Math.max(1, Math.round(opts.height));
    return { width: Math.max(1, Math.round(nh * ratio)), height: nh };
  }

  if (opts.mode === 'percent' && opts.percent != null) {
    const factor = opts.percent / 100;
    return {
      width: Math.max(1, Math.round(w * factor)),
      height: Math.max(1, Math.round(h * factor)),
    };
  }

  // 'max' mode: scale so the longer side == max.
  if (opts.mode === 'max' && opts.max) {
    const longer = Math.max(w, h);
    if (longer <= opts.max) return { width: w, height: h };
    const ratio = opts.max / longer;
    return {
      width: Math.max(1, Math.round(w * ratio)),
      height: Math.max(1, Math.round(h * ratio)),
    };
  }

  return { width: w, height: h };
}

/** Clamp a size so the longer side lands in [min, max] and both sides are even. */
export function clampTargetFileSize(opts: { width: number; height: number; min: number; max: number; stride?: number }): Size {
  const { width, height, min, max } = opts;
  const stride = opts.stride ?? 2;
  const longer = Math.max(width, height);
  let ratio: number;
  if (longer > max) ratio = max / longer;
  else if (longer < min) ratio = min / longer;
  else ratio = 1;
  let w = Math.round(width * ratio);
  let h = Math.round(height * ratio);
  w = Math.max(1, Math.round(w / stride) * stride);
  h = Math.max(1, Math.round(h / stride) * stride);
  return { width: w, height: h };
}

/** Browser-side resize: read, scale, re-encode. DOM lives only inside this function. */
export async function resizeImage(
  blob: Blob,
  opts: {
    mode: 'pixel' | 'percent' | 'max';
    width?: number;
    height?: number;
    percent?: number;
    max?: number;
    format: OutputFormat;
    quality?: number;
    backgroundColor?: string | null;
  },
): Promise<ProcessResult> {
  const { width, height, canvas } = await readImage(blob);
  const size = computeResize(width, height, opts);
  const out = document.createElement('canvas');
  out.width = size.width;
  out.height = size.height;
  const ctx = out.getContext('2d')!;
  if (opts.backgroundColor) {
    ctx.fillStyle = opts.backgroundColor;
    ctx.fillRect(0, 0, out.width, out.height);
  }
  ctx.drawImage(canvas, 0, 0, out.width, out.height);
  const type = opts.format === 'jpg' ? 'image/jpeg' : opts.format === 'png' ? 'image/png' : 'image/webp';
  const result = await encodeBlob(out, { type, quality: opts.quality ?? 0.85, backgroundColor: opts.backgroundColor ?? null });
  return { blob: result, width: size.width, height: size.height, sourceSize: blob.size, resultSize: result.size, reduction: computeReduction(blob.size, result.size), format: opts.format };
}
