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

test('new Sacred and Lost Histories research leads remain distinct and source-linked', () => {
  const records = JSON.parse(fs.readFileSync('data/twelve-archives-catalog.json', 'utf8'));
  for (const id of ['oa-085','oa-086','oa-087','oa-088']) {
    const item = records.find(record => record.id === id);
    assert.ok(item, 'Missing research lead ' + id);
    assert.ok(['The Sacred Archives','The Lost Histories'].includes(item.chamber));
    assert.equal(new URL(item.source_url).protocol, 'https:');
    assert.match(item.source_status, /Research lead/);
    assert.match(item.rights, /Link only/);
  }
});

test('historical placeholder audit is complete and does not mislabel leads as verified', () => {
  const audit = JSON.parse(fs.readFileSync('data/historical-placeholder-audit.json','utf8'));
  assert.equal(audit.total_historical_entries,360);
  assert.equal(audit.template_placeholders,124);
  assert.equal(audit.flagged_entries.length,124);
  assert.equal(new Set(audit.flagged_entries.map(item=>item.id)).size,124);
  assert.ok(audit.flagged_entries.every(item=>item.reason.includes('not verified')));
});

test('recovered historical catalog preserves 360 entries and quarantines placeholders', () => {
  const records=JSON.parse(fs.readFileSync('data/archive-catalog-recovery.json','utf8'));
  assert.equal(records.length,360);
  assert.equal(new Set(records.map(item=>item.id)).size,360);
  assert.equal(records.filter(item=>item.editorial_review==='placeholder_research_backlog').length,121);
  assert.equal(records.filter(item=>item.editorial_review==='item_catalog_verified_rights_pending').length,3);
  assert.equal(records.filter(item=>item.editorial_review==='source_review_required').length,236);
  assert.ok(records.every(item=>item.editorial_review!=='verified'));
});

test('replacement queue exactly matches quarantined historical placeholders', () => {
  const records=JSON.parse(fs.readFileSync('data/archive-catalog-recovery.json','utf8'));
  const queue=JSON.parse(fs.readFileSync('data/placeholder-replacement-queue.json','utf8'));
  const expected=records.filter(item=>['placeholder_research_backlog','item_catalog_verified_rights_pending'].includes(item.editorial_review));
  assert.equal(queue.length,124);
  assert.deepEqual(queue.map(item=>item.id).sort(),expected.map(item=>item.id).sort());
  assert.equal(queue.filter(item=>item.review_state==='needs_specific_source').length,121);
  assert.equal(queue.filter(item=>item.review_state==='item_catalog_verified_rights_pending').length,3);
  assert.ok(queue.every(item=>['replace_placeholder','review_rights_and_full_text'].includes(item.priority)));
});
