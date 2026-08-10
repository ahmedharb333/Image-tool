/**
 * Global processing limits — all configurable in one place.
 * Values are in bytes and pixels.
 */

export const LIMITS = {
  /** Maximum accepted input file size (25 MB). */
  maxFileSize: 25 * 1024 * 1024,
  /** Maximum allowed image dimension in pixels. */
  maxDimension: 12000,
  /** Files above this threshold show a memory warning in the UI. */
  largeFileThreshold: 8 * 1024 * 1024,
  /** Maximum number of files per batch (reserved for P3). */
  maxBatchCount: 20,
  /** Maximum total input size per batch (reserved for P3). */
  maxBatchTotalSize: 100 * 1024 * 1024,
} as const;

export function isLargeFile(bytes: number): boolean {
  return bytes > LIMITS.largeFileThreshold;
}
