import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  clampTargetFileSize,
  computeResize,
  computeCrop,
  rotationToAngle,
  parseDimensionInput,
  parsePercentInput,
} from '../src/lib/processing/index.ts';

test('processing: clampTargetFileSize honors aspect ratio and bounds', () => {
  const r = clampTargetFileSize({ width: 4000, height: 3000, min: 320, max: 2000, stride: 2 });
  assert.ok(r.width <= 2000);
  assert.equal(r.height, Math.round((r.width / 4000) * 3000));
  assert.ok(r.width % 2 === 0);
});

test('processing: clampTargetFileSize enforces minimum', () => {
  const r = clampTargetFileSize({ width: 100, height: 80, min: 320, max: 2000, stride: 1 });
  assert.ok(r.width >= 320);
});

test('processing: computeResize pixel mode', () => {
  assert.deepEqual(computeResize(1000, 500, { mode: 'pixel', width: 800 }), { width: 800, height: 400 });
  assert.deepEqual(computeResize(1000, 500, { mode: 'pixel', height: 250 }), { width: 500, height: 250 });
  assert.deepEqual(computeResize(1000, 500, { mode: 'pixel', width: 800, height: 800 }), { width: 800, height: 800 });
});

test('processing: computeResize percent mode', () => {
  assert.deepEqual(computeResize(1000, 500, { mode: 'percent', percent: 50 }), { width: 500, height: 250 });
  assert.deepEqual(computeResize(1000, 500, { mode: 'percent', percent: 150 }), { width: 1500, height: 750 });
});

test('processing: computeResize max mode caps the longer side', () => {
  assert.deepEqual(computeResize(4000, 3000, { mode: 'max', max: 2000 }), { width: 2000, height: 1500 });
  assert.deepEqual(computeResize(200, 800, { mode: 'max', max: 400 }), { width: 100, height: 400 });
});

test('processing: computeCrop clamps to image bounds and locks ratio', () => {
  const r = computeCrop(1000, 800, { x: -50, y: 100, w: 2000, h: 500 });
  assert.ok(r.x >= 0);
  assert.ok(r.x + r.w <= 1000);
  assert.ok(r.h <= 800);

  const locked = computeCrop(1000, 800, { x: 100, y: 100, w: 400, h: 400, lockRatio: true, baseRatio: 1 });
  assert.ok(Math.abs(locked.w - locked.h) <= 1);
});

test('processing: rotationToAngle normalizes degrees', () => {
  assert.equal(rotationToAngle(0), 0);
  assert.equal(rotationToAngle(90), 90);
  assert.equal(rotationToAngle(450), 90);
  assert.equal(rotationToAngle(-90), 270);
});

test('processing: dimension and percent parsing', () => {
  assert.equal(parseDimensionInput('800'), 800);
  assert.equal(parseDimensionInput('0'), null);
  assert.equal(parseDimensionInput('abc'), null);
  assert.equal(parsePercentInput('50'), 50);
  assert.equal(parsePercentInput('150'), 150);
  assert.equal(parsePercentInput('-5'), null);
});
