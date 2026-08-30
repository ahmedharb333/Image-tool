import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TOOLS } from '../src/config/tools.ts';

test('config: registry contains the expected tools', () => {
  const slugs = TOOLS.map((t) => t.slug).sort();
  assert.deepEqual(slugs, [
    'compress-image',
    'convert-image',
    'crop-image',
    'document-to-markdown',
    'resize-image',
  ]);
});

test('config: slugs and ids are unique', () => {
  const slugs = TOOLS.map((t) => t.slug);
  const ids = TOOLS.map((t) => t.id);
  assert.equal(new Set(slugs).size, slugs.length);
  assert.equal(new Set(ids).size, ids.length);
});

test('config: all tools are active and have non-empty formats', () => {
  for (const t of TOOLS) {
    assert.equal(t.active, true, t.slug);
    assert.ok(t.formats.length > 0, t.slug);
  }
});

test('config: every related slug exists in the registry', () => {
  const slugs = new Set(TOOLS.map((t) => t.slug));
  for (const t of TOOLS) {
    for (const r of t.related) assert.ok(slugs.has(r), `${t.slug} -> ${r}`);
  }
});

test('config: every tool has an Arabic title and description', () => {
  for (const t of TOOLS) {
    assert.ok(t.title.ar.length > 0, t.slug);
    assert.ok(t.description.ar.length > 0, t.slug);
  }
});
