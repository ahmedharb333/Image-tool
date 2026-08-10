import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  readSignature,
  detectImageMime,
  mimeToExtension,
  sanitizeFilename,
  extensionOf,
  buildOutputFilename,
  formatBytes,
  reductionPercent,
  validateImageFile,
} from '../src/lib/file.ts';

const sig = (bytes: number[]) => new Uint8Array(bytes).buffer;

test('file: detects real image signatures', () => {
  assert.equal(detectImageMime(sig([0xff, 0xd8, 0xff, 0xe0, 0, 0])), 'image/jpeg');
  assert.equal(detectImageMime(sig([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a])), 'image/png');
  const webp = [0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50];
  assert.equal(detectImageMime(sig(webp)), 'image/webp');
  assert.equal(detectImageMime(sig([0x4d, 0x5a, 0x90, 0x00])), null);
  assert.equal(detectImageMime(sig([0x00, 0x00, 0x00, 0x00])), null);
});

test('file: readSignature returns hex prefix', () => {
  assert.equal(readSignature(sig([0xff, 0xd8, 0xff])), 'ffd8ff');
});

test('file: mime maps to canonical extension', () => {
  assert.equal(mimeToExtension('image/jpeg'), 'jpg');
  assert.equal(mimeToExtension('image/png'), 'png');
  assert.equal(mimeToExtension('image/webp'), 'webp');
  assert.equal(mimeToExtension('application/pdf'), 'bin');
});

test('file: sanitizeFilename strips unsafe characters', () => {
  assert.equal(sanitizeFilename('../../etc\\passwd.jpg'), 'etcpasswd.jpg');
  assert.equal(sanitizeFilename('  صورة  مسافات  .png '), 'صورة  مسافات  .png');
  assert.equal(sanitizeFilename('..'), 'image');
});

test('file: extensionOf extracts lowercase extension', () => {
  assert.equal(extensionOf('photo.JPG'), 'jpg');
  assert.equal(extensionOf('no-ext'), '');
  assert.equal(extensionOf('.hidden'), '');
});

test('file: buildOutputFilename preserves base and adds suffix', () => {
  assert.equal(buildOutputFilename('photo.jpg', 'compressed', 'jpg'), 'photo-compressed.jpg');
  assert.equal(buildOutputFilename('أرشيف حلو.png', 'resized', 'webp'), 'أرشيف حلو-resized.webp');
});

test('file: formatBytes renders Latin digits', () => {
  assert.equal(formatBytes(512), '512 B');
  assert.equal(formatBytes(2048), '2.0 KB');
  assert.equal(formatBytes(3 * 1024 * 1024), '3.0 MB');
  assert.equal(formatBytes(0), '0 B');
});

test('file: reductionPercent is clamped and rounded', () => {
  assert.equal(reductionPercent(1000, 400), 60);
  assert.equal(reductionPercent(1000, 1200), 0);
  assert.equal(reductionPercent(0, 0), 0);
});

test('file: validateImageFile rejects spoofed, oversized and unsupported files', () => {
  const png = sig([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const spoof = validateImageFile(['png'], 'evil.png', 100, 100000, sig([0x4d, 0x5a, 0x90, 0x00]));
  assert.equal(spoof.valid, false);
  assert.ok(spoof.errors.length > 0);
  const ok = validateImageFile(['png'], 'photo.png', 100, 100000, png);
  assert.equal(ok.valid, true);
  assert.equal(ok.detectedMime, 'image/png');
  const mismatch = validateImageFile(['jpg'], 'photo.jpg', 100, 100000, png);
  assert.equal(mismatch.valid, false);
  const big = validateImageFile(['png'], 'photo.png', 200000, 100000, png);
  assert.equal(big.valid, false);
  const unsupported = validateImageFile(['png'], 'photo.tiff', 100, 100000, png);
  assert.equal(unsupported.valid, false);
});
