import { encodeBlob, readImage } from '../image/index.ts';
import { clampTargetFileSize } from './resize.ts';
import type { OutputFormat, ProcessResult } from './types.ts';
import { computeReduction } from './utils.ts';

export async function compressImage(
  blob: Blob,
  opts: {
    format?: OutputFormat;
    quality?: number;
    backgroundColor?: string | null;
    targetFileSize?: number | null;
  },
): Promise<ProcessResult> {
  const { width, height, canvas } = await readImage(blob);
  const format = opts.format ?? 'webp';
  const quality = opts.quality ?? 0.82;

  let target = canvas;
  let outputSize = width;
  let outputHeight = height;
  const targetFileSize = opts.targetFileSize;

  // If the file is still above target after first pass, downscale dimensions.
  if (targetFileSize) {
    const pass = await encodeBlob(canvas, { type: mimeOf(format), quality, backgroundColor: opts.backgroundColor ?? null });
    if (pass.size > targetFileSize) {
      const scaled = clampTargetFileSize({ width, height, min: 320, max: Math.floor(width * 0.8), stride: 2 });
      const tmp = await readImage(blob);
      target = tmp.canvas;
      outputSize = scaled.width;
      outputHeight = scaled.height;
      const pass2 = await encodeBlob(target, { type: mimeOf(format), quality, backgroundColor: opts.backgroundColor ?? null });
      if (pass2.size > targetFileSize) {
        // Progressive pass: reduce quality in steps until under target.
        let q = quality;
        let best = pass2;
        while (q > 0.4 && best.size > targetFileSize) {
          q -= 0.1;
          best = await encodeBlob(target, { type: mimeOf(format), quality: q, backgroundColor: opts.backgroundColor ?? null });
        }
        return finish(target, best, blob, width, height, format);
      }
      return finish(target, pass2, blob, width, height, format);
    }
    return finish(canvas, pass, blob, width, height, format);
  }

  const result = await encodeBlob(canvas, { type: mimeOf(format), quality, backgroundColor: opts.backgroundColor ?? null });
  return finish(canvas, result, blob, width, height, format);
}

function finish(canvas: HTMLCanvasElement, result: Blob, source: Blob, width: number, height: number, format: string): ProcessResult {
  return {
    blob: result,
    width: canvas.width,
    height: canvas.height,
    sourceSize: source.size,
    resultSize: result.size,
    reduction: computeReduction(source.size, result.size),
    format,
  };
}

function mimeOf(format: OutputFormat): 'image/jpeg' | 'image/png' | 'image/webp' {
  return format === 'jpg' ? 'image/jpeg' : format === 'png' ? 'image/png' : 'image/webp';
}
