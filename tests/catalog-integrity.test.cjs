const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

test('archive catalog JSON is parseable and twelve chambers are preserved', () => {
  const catalog = JSON.parse(fs.readFileSync('data/twelve-archives-catalog.json', 'utf8'));
  assert.ok(catalog && typeof catalog === 'object');
  assert.ok(fs.existsSync('data/archive-resources.json'));
  const resources = JSON.parse(fs.readFileSync('data/archive-resources.json', 'utf8'));
  assert.ok(Array.isArray(resources));
  assert.ok(resources.every(item => typeof item.title === 'string' && item.title.trim().length > 0));
});
