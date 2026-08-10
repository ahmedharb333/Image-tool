/**
 * Public image-utility API (browser). Also re-exports pure helpers so the
 * decision logic is unit-testable in node without a DOM.
 */

export type Codec = 'jpeg' | 'png' | 'webp';

/**
 * Pure decision: which codec to use for a target format, given whether the
 * image has transparency. Pure/stateless — node-testable.
 */
export function pickCodec(format: string, _wantsTransparency: boolean): Codec {
  switch (format.toLowerCase()) {
    case 'jpg':
    case 'jpeg':
      return 'jpeg';
    case 'webp':
      return 'webp';
    case 'png':
    case 'gif':
    case 'bmp':
    default:
      return 'png';
  }
}

export { toCanvas, readImage, readImageDimensions } from './decoders.ts';
export { encodeBlob, newImageCanvas, canUseToBlob, encodePng, encodeLossy } from './encoders.ts';
