import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pickCodec } from '../src/lib/image/index.ts';

test('codec: pickCodec resolves format + transparency correctly', () => {
  assert.equal(pickCodec('jpg', false), 'jpeg');
  assert.equal(pickCodec('jpeg', false), 'jpeg');
  assert.equal(pickCodec('png', true), 'png');
  assert.equal(pickCodec('png', false), 'png');
  assert.equal(pickCodec('webp', false), 'webp');
  assert.equal(pickCodec('webp', true), 'webp');
  assert.equal(pickCodec('gif', true), 'png');
  assert.equal(pickCodec('gif', false), 'png');
});

test('codec: unknown formats fall back to png', () => {
  assert.equal(pickCodec('tiff', false), 'png');
  assert.equal(pickCodec('', false), 'png');
});
