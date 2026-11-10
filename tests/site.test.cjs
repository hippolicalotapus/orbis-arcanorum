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

test('Grand Archive hero has an original accessible image asset', () => {
 const html=fs.readFileSync('index.html','utf8');
 assert.match(html, /src="\.\/assets\/grand-archive\.svg"/);
 assert.match(html, /class="archive-illustration"[^>]+alt="[^"]+"/);
 const asset=fs.readFileSync('assets/grand-archive.svg','utf8');
 assert.match(asset, /<svg/);
 assert.match(asset, /<title/);
 assert.match(asset, /<desc/);
});

test('preserved historical archive and research leads remain accessible', () => {
 const html=fs.readFileSync('index.html','utf8');
 for(const path of ['archives/index.html','archives/research-leads.json','data/archive-resources.json']) {
  assert.ok(fs.existsSync(path),'missing preserved collection: '+path);
  assert.ok(html.includes('./'+path),'missing homepage access: '+path);
 }
 const historical=JSON.parse(fs.readFileSync('archives/research-leads.json','utf8'));
 assert.equal(historical.records.length,26);
 const catalog=JSON.parse(fs.readFileSync('data/archive-catalog.json','utf8'));
 assert.ok(catalog.length>=360,'archive catalog shrank unexpectedly');
 const chambers=JSON.parse(fs.readFileSync('data/archive-chambers.json','utf8'));
 assert.equal(chambers.length,14);
});

test('Akashic catalog supports review-stage filtering without modifying source records', () => {
 const html=fs.readFileSync('catalog.html','utf8');
 assert.match(html, /id="review"/);
 assert.match(html, /rv\.addEventListener\('change',render\)/);
 assert.match(html, /Research status: /);
 assert.match(html, /Historical research collection/);
 const records=JSON.parse(fs.readFileSync('data/archive-catalog.json','utf8'));
 assert.equal(records.length,360);
 assert.ok(records.every(r=>r.id&&r.title&&r.source_url&&r.source_status));
});

test('individual dossiers are linked and preserve source provenance', () => {
 const page=fs.readFileSync('record.html','utf8');
 const catalog=fs.readFileSync('catalog.html','utf8');
 assert.match(page, /id="metadata"/);
 assert.match(page, /Source review status/);
 assert.match(page, /Rights and reproduction/);
 assert.match(page, /encodeURIComponent\(item.id\)/);
 assert.match(catalog, /record\.html\?id=/);
 assert.match(page, /archive-catalog\.json/);
});

test('dossiers expose transparent cross-chamber discovery', () => {
 const page=fs.readFileSync('record.html','utf8');
 assert.match(page, /Discover related mysteries across the archives/);
 assert.match(page, /item\.chamber!==entry\.chamber/);
 assert.match(page, /shared catalog terms/);
 assert.match(page, /not verified historical relationships/);
 assert.match(page, /encodeURIComponent\(item.id\)/);
});

test('constellation explorer is connected and uses source-led catalog data', () => {
 const page=fs.readFileSync('constellation.html','utf8');
 const home=fs.readFileSync('index.html','utf8');
 const dossier=fs.readFileSync('record.html','utf8');
 assert.match(page, /id="network"/);
 assert.match(page, /id="list"/);
 assert.match(page, /archive-catalog\.json/);
 assert.match(page, /not evidence of a historical association/);
 assert.match(home, /constellation\.html/);
 assert.match(dossier, /constellation\.html\?id=/);
});

test('constellation mobile layout and full catalog selection remain usable', () => {
 const html=fs.readFileSync('constellation.html','utf8');
 assert.match(html, /position:static!important/);
 assert.doesNotMatch(html, /\.slice\(0,120\)/);
 assert.match(html, /@media\(max-width:700px\)/);
 const records=JSON.parse(fs.readFileSync('data/archive-catalog.json','utf8'));
 assert.equal(records.length,360);
});

test('release gate validates navigation, scripts and external-link protections across public pages', () => {
 const pages=['index.html','orders.html','catalog.html','record.html','constellation.html','vendors.html','register.html','collectors-vault.html','antiquarian-atelier.html','advertise.html','lost-histories.html'];
 for(const page of pages){
  const html=fs.readFileSync(page,'utf8');
  assert.match(html, /<html lang="en">/i,page+' missing language');
  assert.match(html, /<meta name="viewport"/i,page+' missing viewport');
  for(const [,path] of html.matchAll(/href="\.\/([^"#?]+)(?:[?#][^"]*)?"/g))assert.ok(fs.existsSync(path),page+' broken local link: '+path);
  for(const [,script] of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)){
   if(/<script[^>]*type="module"/.test(html)&&page==='register.html')continue;
   new vm.Script(script,{filename:page});
  }
  for(const tag of html.match(/<a\b[^>]*target="_blank"[^>]*>/g)||[])assert.match(tag,/rel="[^"]*noopener/,page+' unsafe external link');
 }
});

test('mobile homepage entrance keeps text readable and reaches all chambers', () => {
 const html=fs.readFileSync('index.html','utf8');
 assert.match(html, /class="hero-content"/);
 assert.match(html, /class="hero-action" href="#chambers"/);
 assert.match(html, /<section id="chambers" aria-label="Research archive chambers">/);
 assert.match(html, /\.hero-content h1\{/);
 assert.match(html, /@media\(max-width:650px\)\{\.hero\{/);
 assert.match(html, /\.hero:before\{display:none!important\}/);
 const chambers=JSON.parse(fs.readFileSync('data/archive-chambers.json','utf8'));
 assert.equal(chambers.length,14);
});

test('source review filter cannot mark pending leads as verified', () => {
 const html=fs.readFileSync('catalog.html','utf8');
 const match=html.match(/function isSourceChecked\(status\)\{[\s\S]*?\}\s*function render\(/);
 assert.ok(match,'source review classifier is present');
 const classify=new Function('status',match[0].replace(/^function isSourceChecked\(status\)\{/,'').replace(/\}\s*function render\($/,''));
 for(const pending of ['Research lead — item-level verification pending','not verified','not independently verified','source not checked','discovery lead'])assert.equal(classify(pending),false,pending);
 for(const checked of ['Source page checked','Source reviewed','independently verified'])assert.equal(classify(checked),true,checked);
 assert.match(html,/Verification incomplete \/ pending/);
});

test('all chambers link to their filtered catalog and homepage records link to dossiers', () => {
 const home=fs.readFileSync('index.html','utf8');
 const catalog=fs.readFileSync('catalog.html','utf8');
 assert.match(home, /catalog\.html\?chamber=/);
 assert.match(home, /encodeURIComponent\(name\)/);
 assert.match(home, /record\.html\?id=/);
 assert.match(home, /encodeURIComponent\(x\.id\)/);
 assert.match(catalog, /URLSearchParams\(location\.search\)\.get\('chamber'\)/);
 const chambers=JSON.parse(fs.readFileSync('data/archive-chambers.json','utf8'));
 const records=JSON.parse(fs.readFileSync('data/archive-catalog.json','utf8'));
 assert.equal(chambers.length,14);
 assert.equal(records.length,360);
 for(const chamber of chambers)assert.ok(records.some(x=>x.chamber===chamber.name),'missing records for '+chamber.name);
});

test('research dossier offers contextual chamber and constellation navigation', () => {
 const html=fs.readFileSync('record.html','utf8');
 assert.match(html, /id="chamber-link"/);
 assert.match(html, /id="constellation-link"/);
 assert.match(html, /catalog\.html\?chamber=/);
 assert.match(html, /encodeURIComponent\(entry\.chamber\)/);
 assert.match(html, /constellation\.html\?id=/);
 assert.match(html, /encodeURIComponent\(entry\.id\)/);
});

test('research dossiers provide mobile readable layout and return navigation', () => {
 const html=fs.readFileSync('record.html','utf8');
 assert.match(html, /aria-label="Breadcrumb"/);
 assert.match(html, /id="return-catalog"/);
 assert.match(html, /@media\(max-width:650px\)/);
 assert.match(html, /\.related\{grid-template-columns:1fr\}/);
 assert.match(html, /id="chamber-link"/);
 assert.match(html, /id="constellation-link"/);
});

test('catalog mobile filters can be cleared and chamber selection persists in URL', () => {
 const html=fs.readFileSync('catalog.html','utf8');
 assert.match(html, /id="clear-filters"/);
 assert.match(html, /id="active-chamber"/);
 assert.match(html, /history\.replaceState\(null,'',url\)/);
 assert.match(html, /url\.searchParams\.set\('chamber',c\.value\)/);
 assert.match(html, /url\.searchParams\.delete\('chamber'\)/);
 assert.match(html, /q\.value='';c\.value='';cl\.value='';rv\.value=''/);
 assert.match(html, /@media\(max-width:750px\)/);
});
