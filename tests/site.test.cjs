const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const pages = ['index.html', 'orders.html'];
for (const page of pages) {
  test(page + ' exists and has a valid inline script', () => {
    const html = fs.readFileSync(page, 'utf8');
    assert.match(html, /<!doctype html>/i);
    assert.match(html, /<html lang="en">/i);
    assert.match(html, /<meta name="viewport"/i);
    assert.match(html, /<\/html>/i);
    const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
    assert.ok(scripts.length > 0, 'expected inline JavaScript');
    scripts.forEach(s => new vm.Script(s[1], { filename: page }));
  });
  test(page + ' local links point to existing files', () => {
    const html = fs.readFileSync(page, 'utf8');
    const links = [...html.matchAll(/href="\.\/([^"#?]+)"/g)].map(x => x[1]);
    links.forEach(link => assert.ok(fs.existsSync(link), 'missing link target: ' + link));
  });
  test(page + ' includes accessible search and result status', () => {
    const html = fs.readFileSync(page, 'utf8');
    assert.match(html, /type="search"/);
    assert.match(html, /role="status"/);
    assert.doesNotMatch(html, /\.innerHTML\s*=/);
  });
}
test('archive manifest and catalog contain fourteen consistent chambers', () => {
  const chambers = JSON.parse(fs.readFileSync('data/archive-chambers.json', 'utf8'));
  const entries = JSON.parse(fs.readFileSync('data/archive-catalog.json', 'utf8'));
  assert.equal(chambers.length, 14);
  const names = chambers.map(c => c.name);
  assert.equal(new Set(names).size, 14);
  assert.equal(new Set(entries.map(e => e.id)).size, entries.length);
  for (const entry of entries) assert.ok(names.includes(entry.chamber), 'unknown chamber: ' + entry.chamber);
  assert.match(fs.readFileSync('index.html', 'utf8'), /archive-chambers\.json/);
});
test('research resource catalog has valid URLs and classifications', () => {
  const data = JSON.parse(fs.readFileSync('data/archive-resources.json', 'utf8'));
  assert.ok(data.length > 0);
  for (const item of data) {
    assert.ok(item.title);
    assert.ok(['Documented','Disputed','Unverified','Folklore & Legend'].includes(item.classification));
    assert.equal(new URL(item.url).protocol, 'https:');
  }
});

const additionalPages = ['catalog.html','vendors.html','register.html','collectors-vault.html','antiquarian-atelier.html','advertise.html','lost-histories.html'];
for (const page of additionalPages) {
  test(page + ' exists with basic structure and valid local links', () => {
    const html = fs.readFileSync(page, 'utf8');
    assert.match(html, /<!doctype html>/i);
    assert.match(html, /<html lang="en">/i);
    assert.match(html, /<title>/i);
    const links = [...html.matchAll(/href="\.\/([^"#?]+)"/g)].map(x => x[1]);
    links.forEach(link => assert.ok(fs.existsSync(link), page + ' missing link: ' + link));
  });
}
test('homepage connects the five core experiences', () => {
  const html = fs.readFileSync('index.html','utf8');
  for (const page of ['catalog.html','vendors.html','collectors-vault.html','antiquarian-atelier.html'])
    assert.ok(html.includes('./'+page), 'missing homepage link: '+page);
});
test('Atelier discloses collector edition inclusions and no active checkout', () => {
  const html = fs.readFileSync('antiquarian-atelier.html','utf8');
  assert.match(html, /original unretouched scan/);
  assert.match(html, /No checkout is active/);
  assert.match(html, /fine-art paper print/i);
});
