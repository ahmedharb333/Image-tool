import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTitle, absoluteUrl, metaRobots, breadcrumbJsonLd } from '../src/lib/seo.ts';

test('seo: title is brand-aware', () => {
  assert.equal(buildTitle('ضغط الصور'), 'ضغط الصور | أدوات وردلي');
  assert.equal(buildTitle('أدوات وردلي'), 'أدوات وردلي — أدوات مجانية داخل متصفحك — للصور والمستندات وأكثر، دون رفع أي ملف');
});

test('seo: absoluteUrl uses the configured site URL', () => {
  assert.equal(absoluteUrl('/tools/compress-image/'), 'https://tools.worldly.pro/tools/compress-image/');
});

test('seo: robots meta reflects index status', () => {
  assert.equal(metaRobots(false), 'index, follow');
  assert.equal(metaRobots(true), 'noindex, nofollow');
});

test('seo: breadcrumb JSON-LD is well-formed', () => {
  const ld = breadcrumbJsonLd([{ name: 'الرئيسية', path: '/' }, { name: 'الأدوات', path: '/tools/' }]);
  assert.equal(ld.itemListElement.length, 2);
  assert.equal(ld.itemListElement[0].position, 1);
  assert.equal(ld.itemListElement[1].item, 'https://tools.worldly.pro/tools/');
});
