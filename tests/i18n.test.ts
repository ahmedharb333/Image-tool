import { test } from 'node:test';
import assert from 'node:assert/strict';
import { localizedPath } from '../src/lib/i18n.ts';

test('i18n: Arabic (default) paths are served at root', () => {
  assert.equal(localizedPath('ar', '/tools/'), '/tools/');
  assert.equal(localizedPath('ar', 'tools/'), '/tools/');
  assert.equal(localizedPath('ar', '/'), '/');
});
