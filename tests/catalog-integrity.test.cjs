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

test('curated catalog entries have unique identifiers and valid source links', () => {
  const records = JSON.parse(fs.readFileSync('data/twelve-archives-catalog.json', 'utf8'));
  assert.ok(Array.isArray(records) && records.length > 0);
  const ids = new Set();
  for (const record of records) {
    assert.ok(typeof record.id === 'string' && record.id.trim(), 'missing record id');
    assert.ok(!ids.has(record.id), 'duplicate record id: ' + record.id);
    ids.add(record.id);
    assert.ok(typeof record.chamber === 'string' && record.chamber.trim(), 'missing chamber');
    assert.ok(typeof record.title === 'string' && record.title.trim(), 'missing title');
    assert.equal(new URL(record.source_url).protocol, 'https:', 'non-HTTPS source');
    assert.ok(typeof record.rights === 'string' && record.rights.trim(), 'missing rights review');
  }
});

test('all fourteen archive chambers have research records and homepage navigation', () => {
  const records = JSON.parse(fs.readFileSync('data/twelve-archives-catalog.json', 'utf8'));
  const chambers = new Set(records.map(record => record.chamber));
  assert.equal(chambers.size, 14, 'Expected fourteen populated archives');
  for (const name of ['The Sacred Archives', 'The Lost Histories']) assert.ok(chambers.has(name));
  const home = fs.readFileSync('index.html', 'utf8');
  const catalog = fs.readFileSync('catalog.html', 'utf8');
  for (const name of chambers) assert.ok(home.includes(name), 'Missing homepage chamber: ' + name);
  assert.ok(catalog.includes('Fourteen Archives'));
});
