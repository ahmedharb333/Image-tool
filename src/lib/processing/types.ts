/** Shared processing option/result types. */

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface CropBox extends Point {
  w: number;
  h: number;
}

export type OutputFormat = 'jpg' | 'png' | 'webp';

export interface ProcessResult {
  blob: Blob;
  width: number;
  height: number;
  sourceSize: number;
  resultSize: number;
  reduction: number;
  format: string;
}
