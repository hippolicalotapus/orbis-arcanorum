// Run with: node --test prototypes/fourteen-seals/tests/editorial-queue.test.mjs
// Requires playwright installed separately: npm install --no-save playwright
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const url = pathToFileURL(resolve('prototypes/fourteen-seals/offline-editorial-queue.html')).href;
const rows = [
  {title:'Alchemy <img src=x onerror=alert(1)>',archive_section:'Alchemy',evidence_class:'unreviewed',rights_status:'unverified',translation_status:'pending',source_name:'Archive A',source_url:'javascript:alert(1)',publication_status:'draft'},
  {title:'A Folklore Tale',archive_section:'Folklore',evidence_class:'documented',rights_status:'cleared',translation_status:'human_reviewed',source_name:'Archive B',source_url:'https://example.org/source',publication_status:'draft'}
];
const load = async (page, data, name='records.json') => {
  await page.locator('#file').setInputFiles({name,mimeType:'application/json',buffer:Buffer.from(typeof data==='string'?data:JSON.stringify(data))});
};
test('offline editorial queue: imports, filters, escapes HTML, rejects unsafe URLs, clears',async()=>{
 const browser=await chromium.launch({headless:true});
 try {
  const page=await browser.newPage({viewport:{width:390,height:844}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);
  await load(page,{records:rows});
  assert.match(await page.locator('#status').innerText(),/Loaded 2 records/);
  assert.equal(await page.locator('article').count(),2);
  assert.equal(await page.locator('article img').count(),0);
  assert.equal(await page.locator('article a').count(),1);
  await page.locator('#priority').selectOption('evidence');
  assert.equal(await page.locator('article').count(),1);
  await page.locator('#priority').selectOption('');
  await page.locator('#section').selectOption('Folklore');
  assert.equal(await page.locator('article').count(),1);
  await page.locator('#section').selectOption('');
  await page.locator('#search').fill('alchemy');
  assert.equal(await page.locator('article').count(),1);
  await page.locator('#search').fill('');
  await page.locator('#priority').selectOption('rights');
  assert.equal(await page.locator('article').count(),1);
  await page.locator('#priority').selectOption('translation');
  assert.equal(await page.locator('article').count(),1);
  await page.locator('#priority').selectOption('');
  assert.equal(await page.locator('article h2').first().innerText(),'Alchemy <img src=x onerror=alert(1)>');
  assert.equal(await page.locator('article a').first().getAttribute('href'),'https://example.org/source');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth),true,'Mobile viewport has horizontal overflow');
  await load(page,'{broken');
  assert.match(await page.locator('#status').innerText(),/Import rejected/);
  assert.equal(await page.locator('article').count(),2);
  await page.locator('#clear').click();
  assert.equal(await page.locator('article').count(),0);
  assert.deepEqual(errors,[]);
 } finally {await browser.close()}
});
test('offline editorial queue rejects oversized files and too many records',async()=>{
 const browser=await chromium.launch({headless:true});
 try {
  const page=await browser.newPage();await page.goto(url);
  await load(page,' '.repeat(5*1024*1024+1));
  assert.match(await page.locator('#status').innerText(),/exceeds 5 MB/);
  await load(page,Array.from({length:10001},()=>({title:'x',archive_section:'a'})));
  assert.match(await page.locator('#status').innerText(),/Import rejected/);
 }finally{await browser.close()}
});
