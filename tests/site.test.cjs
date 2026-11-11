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
test('homepage includes all fourteen chambers', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  const match = html.match(/const chambers=(\[[^;]+\]);const entries=/);
  assert.ok(match, 'chamber data missing');
  assert.equal(JSON.parse(match[1]).length, 14);
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

test('vendor registration is accessible and requires configured Supabase', () => {
  const html=fs.readFileSync('vendor.html','utf8');
  const js=fs.readFileSync('vendor.js','utf8');
  assert.match(html, /id="account"/);
  assert.match(html, /id="signin"/);
  assert.match(html, /id="application"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(js, /auth\.signUp/);
  assert.match(js, /auth\.signInWithPassword/);
  assert.match(js, /vendor_applications/);
  assert.match(js, /status:'pending'/);
  assert.doesNotMatch(js, /service_role|sb_secret_/);
  assert.ok(fs.existsSync('vendor-config.example.json'));
  assert.match(js, /await fetch/); // vendor.js is an ES module with top-level await
});

test('vendor signup remains disabled until launch gates pass', () => {
  const config=JSON.parse(fs.readFileSync('vendor-config.json','utf8'));
  const js=fs.readFileSync('vendor.js','utf8');
  assert.equal(config.registrationEnabled,false,'registration must remain closed during beta preparation');
  assert.match(config.supabaseUrl,/^https:\/\/[a-z0-9-]+\.supabase\.co$/);
  assert.match(config.publishableKey,/^sb_publishable_/);
  assert.match(js,/config\.registrationEnabled!==true/);
  assert.match(js,/button\[type=submit\]/);
  assert.doesNotMatch(JSON.stringify(config),/sb_secret_|service_role/);
});

test('vendor studio is gated and only drafts or submits for moderation', () => {
 const html=fs.readFileSync('studio.html','utf8');
 const js=fs.readFileSync('studio.js','utf8');
 assert.match(html,/id="studio" hidden/);
 assert.match(js,/config.registrationEnabled!==true/);
 assert.match(js,/eq\('status','approved'\)/);
 assert.match(js,/status:'draft'/);
 assert.match(js,/status:'pending_review'/);
 assert.doesNotMatch(js,/service_role|sb_secret_|innerHTML/);
});

test('administrator review desk is gated and moderated', () => {
 const html=fs.readFileSync('review.html','utf8');
 const js=fs.readFileSync('review.js','utf8');
 assert.match(html,/id="desk" hidden/);
 assert.ok(js.includes('config.registrationEnabled!==true'));
 assert.ok(js.includes('user.app_metadata?.orbis_admin!==true'));
 assert.ok(js.includes("'pending_review'"));
 assert.ok(js.includes("'published'"));
 assert.ok(js.includes('reviewed_at'));
 assert.doesNotMatch(js,/service_role|sb_secret_|innerHTML/);
});
