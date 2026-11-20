import {test} from 'node:test';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {resolve} from 'node:path';
import {mkdirSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
const url=pathToFileURL(resolve('prototypes/fourteen-seals/index.html')).href;
test('14 chambers: import, editorial quarantine, clear and observatory on mobile',async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);
  await page.locator('#skip').click();
  assert.equal(await page.locator('#grid .tile').count(),14);
  const fixture={records:[
   {title:'Synthetic alchemical text',chamber:'Alchemy & Hermeticism',summary:'A controlled test record',sources:[{url:'https://example.org/source',label:'Source'}]},
   {title:'Synthetic legend',chamber:'Myths & Legends',summary:'Another controlled record',sources:[]}
  ],review_required:[{title:'Withheld example',archive_section:'Indigenous Traditions & Oral Histories'}]};
  const upload=async data=>{await page.locator('#archiveImport').setInputFiles({name:'synthetic.json',mimeType:'application/json',buffer:Buffer.from(typeof data==='string'?data:JSON.stringify(data))});await page.waitForFunction(()=>document.querySelector('#archiveImport').value==='',{timeout:10000});};
  await upload(fixture);
  assert.match(await page.locator('#importStatus').innerText(),/Loaded 2 records across 2 chambers/);
  assert.match(await page.locator('#importStatus').innerText(),/1 record withheld/);
  assert.equal(await page.locator('[data-record-count]').filter({hasText:'1 imported record'}).count(),2);
  mkdirSync('test-artifacts',{recursive:true});
  await page.screenshot({path:'test-artifacts/fourteen-chambers-mobile.png',fullPage:true});
  await page.locator('#grid .tile').filter({hasText:'Alchemy & Hermeticism'}).click();
  assert.equal(await page.locator('#recordResults article').count(),1);
  assert.equal(await page.locator('#recordResults article h4').innerText(),'Synthetic alchemical text');
  assert.equal(await page.locator('#recordResults a').getAttribute('href'),'https://example.org/source');
  await page.locator('#back').click();
  await page.locator('#observatoryAccess').click();
  assert.equal(await page.locator('#boardPins .pin').count(),14);
  await page.locator('#boardPins .pin').first().click();
  assert.equal(await page.locator('#boardInfo button').count(),1);
  await page.locator('#closeObservatory').click();
  await page.locator('#clearImport').click();
  assert.equal(await page.locator('[data-record-count]').filter({hasText:'0 imported records'}).count(),14);
  // Failed imports must never erase a previously valid private review session.
  await upload(fixture);
  await upload('{broken');
  assert.match(await page.locator('#importStatus').innerText(),/Import rejected/);
  assert.equal(await page.locator('[data-record-count]').filter({hasText:'1 imported record'}).count(),2);
  // The renderer must treat research titles as text and reject executable links.
  await upload({records:[{title:'<img src=x onerror=alert(1)>',chamber:'Alchemy & Hermeticism',summary:'<script>alert(1)</script>',sources:[{url:'javascript:alert(1)',label:'Unsafe'}]}]});
  await page.locator('#grid .tile').filter({hasText:'Alchemy & Hermeticism'}).click();
  assert.equal(await page.locator('#recordResults img').count(),0);
  assert.equal(await page.locator('#recordResults script').count(),0);
  assert.equal(await page.locator('#recordResults a').count(),0);
  await page.locator('#back').click();
  // A malformed chamber must be rejected without replacing the previous valid import.
  await upload({records:[{title:'Unmapped test',chamber:'Not A Real Chamber'}]});
  assert.match(await page.locator('#importStatus').innerText(),/Unknown chamber/);
  assert.equal(await page.locator('[data-record-count]').filter({hasText:'1 imported record'}).count(),1);
  // Oversized imports are rejected and the file input resets for retries.
  await upload(' '.repeat(5*1024*1024+1));
  assert.match(await page.locator('#importStatus').innerText(),/exceeds 5 MB/);
  assert.equal(await page.locator('#archiveImport').inputValue(),'');
  await upload('{broken');
  assert.match(await page.locator('#importStatus').innerText(),/Import rejected/);
  await upload(fixture);
  assert.match(await page.locator('#importStatus').innerText(),/Loaded 2 records/);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),true,'Mobile horizontal overflow');
  assert.deepEqual(errors,[]);
 }finally{await browser.close()}
});
