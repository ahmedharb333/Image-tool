import { encodeBlob, readImage } from '../image/index.ts';
import { computeReduction } from './utils.ts';
import type { OutputFormat, ProcessResult } from './types.ts';

export async function convertImage(
  blob: Blob,
  opts: { format: OutputFormat; quality?: number; backgroundColor?: string | null },
): Promise<ProcessResult> {
  const { canvas } = await readImage(blob);
  const type = opts.format === 'jpg' ? 'image/jpeg' : opts.format === 'png' ? 'image/png' : 'image/webp';
  const result = await encodeBlob(canvas, { type, quality: opts.quality ?? 0.85, backgroundColor: opts.backgroundColor ?? null });
  return {
    blob: result,
    width: canvas.width,
    height: canvas.height,
    sourceSize: blob.size,
    resultSize: result.size,
    reduction: computeReduction(blob.size, result.size),
    format: opts.format,
  };
}
