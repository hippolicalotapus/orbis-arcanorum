import {test} from 'node:test';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {mkdirSync} from 'node:fs';
const url=pathToFileURL(resolve('prototypes/fourteen-seals/index.html')).href;
const upload=async(page,records)=>{
 await page.locator('#archiveImport').setInputFiles({name:'synthetic-local-test.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({records}))});
 await page.waitForFunction(()=>document.querySelector('#archiveImport').value==='');
};
const ready=async page=>page.waitForFunction(()=>document.querySelector('#detail').dataset.journey==='ready');

test('opening completes before entry; skip, reduced motion and cancellation remain reliable',async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:1000},reducedMotion:'no-preference'});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(url);await page.locator('#skip').click();
  await page.locator('#grid .tile').first().click();
  assert.equal(await page.locator('#enterReadingRoom').isDisabled(),true);
  await page.locator('#reveal').click();
  assert.equal(await page.locator('#detail').getAttribute('data-journey'),'opening');
  assert.equal(await page.locator('#mechanism').getAttribute('aria-busy'),'true');
  assert.match(await page.locator('#progress').innerText(),/^0 of 14/);
  await ready(page);
  assert.equal(await page.locator('#enterReadingRoom').isEnabled(),true);
  assert.match(await page.locator('#progress').innerText(),/^1 of 14/);
  await page.locator('#enterReadingRoom').click();
  assert.equal(await page.locator('#readingRoom').isVisible(),true);
  assert.equal(await page.locator('#mechanism').isVisible(),false);
  assert.equal(await page.locator('#readingTitle').evaluate(node=>node===document.activeElement),true);
  await page.locator('#returnEntrance').click();
  assert.equal(await page.locator('#mechanism').isVisible(),true);
  assert.equal(await page.locator('#enterReadingRoom').evaluate(node=>node===document.activeElement),true);
  await page.locator('#nextChamber').click();
  await page.locator('#reveal').click();await page.locator('#skipOpening').click();
  assert.equal(await page.locator('#enterReadingRoom').isEnabled(),true);
  assert.match(await page.locator('#progress').innerText(),/^2 of 14/);
  await page.locator('#nextChamber').click();
  await page.locator('#reveal').click();
  await page.locator('#nextChamber').click();
  await page.waitForTimeout(3200); // Verify the cancelled opening's delayed completion cannot affect another chamber.
  assert.equal(await page.locator('#detailTitle').innerText(),'Ancient Religions & Mythology');
  assert.equal(await page.locator('#enterReadingRoom').isDisabled(),true);
  assert.match(await page.locator('#progress').innerText(),/^2 of 14/);
  await page.locator('#reveal').click();
  await page.locator('#motionToggle').click();
  await ready(page);
  assert.equal(await page.locator('#enterReadingRoom').isEnabled(),true);
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.locator('#nextChamber').click();await page.locator('#reveal').click();
  assert.equal(await page.locator('#enterReadingRoom').isEnabled(),true);
  assert.deepEqual(errors,[]);
 }finally{await browser.close()}
});

test('local reading room searches safely, pages every record and preserves imported data and notes',async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:1000},reducedMotion:'reduce'});
  await page.goto(url);await page.locator('#skip').click();
  const records=Array.from({length:25},(_,i)=>({title:'Synthetic reading record '+String(i+1).padStart(3,'0'),chamber:'Grimoires & Magical Texts',summary:i===24?'Unique final-page marker':'Controlled local test fixture.',sources:[{url:'javascript:alert(1)',label:'Blocked test URL'}]}));
  records.push({title:'Synthetic record in another chamber',chamber:'Alchemy & Hermeticism',summary:'Must not appear in the grimoire search.'});
  await upload(page,records);
  await page.locator('#grid .tile').nth(1).click();
  await page.locator('#reviewNotes').fill('Synthetic unsaved note retained through the reading flow.');
  await page.locator('#reveal').click();await page.locator('#enterReadingRoom').click();
  assert.equal(await page.locator('#recordResults article').count(),12);
  assert.match(await page.locator('#recordPageStatus').innerText(),/Page 1 of 3/);
  await page.locator('#nextRecords').click();await page.locator('#nextRecords').click();
  assert.equal(await page.locator('#recordResults article').count(),1);
  assert.match(await page.locator('#recordPageStatus').innerText(),/25–25 of 25/);
  await page.locator('#recordSearch').fill('UNIQUE FINAL-PAGE');
  assert.equal(await page.locator('#recordResults article').count(),1);
  assert.match(await page.locator('#readingStatus').innerText(),/1 of 25 local records/);
  assert.equal(await page.locator('#recordResults a').count(),0);
  await page.locator('#recordSearch').fill('<img src=x onerror=alert(1)>');
  assert.equal(await page.locator('#recordResults img').count(),0);
  assert.match(await page.locator('#recordResults').innerText(),/No records match/);
  await page.locator('#clearRecordSearch').click();
  assert.equal(await page.locator('#recordResults article').count(),12);
  for(const width of [320,390,430,768]){
   await page.setViewportSize({width,height:1000});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`Reading room overflow at ${width}px`);
  }
  await page.locator('#returnEntrance').click();
  assert.equal(await page.locator('#reviewNotes').inputValue(),'Synthetic unsaved note retained through the reading flow.');
  await page.locator('#returnAtlas').click();
  const large=Array.from({length:241},(_,i)=>({title:'Synthetic bulk record '+i,chamber:'Grimoires & Magical Texts',summary:i===240?'Beyond old 200 record cap':'Synthetic bulk test'}));
  await upload(page,large);await page.locator('#grid .tile').nth(1).click();
  await page.locator('#reveal').click();await page.locator('#enterReadingRoom').click();
  assert.match(await page.locator('#recordPageStatus').innerText(),/Page 1 of 21/);
  await page.locator('#recordSearch').fill('Beyond old 200 record cap');
  assert.equal(await page.locator('#recordResults article h4').innerText(),'Synthetic bulk record 240');
  await page.locator('#returnAtlas').click();
  assert.equal(await page.locator('[data-record-count]').filter({hasText:'241 imported records'}).count(),1);
 }finally{await browser.close()}
});

test('actual opening-to-reading-room video and mobile webpage screenshots',async()=>{
 const browser=await chromium.launch({headless:true});
 mkdirSync('test-artifacts',{recursive:true});
 const context=await browser.newContext({viewport:{width:390,height:1000},reducedMotion:'no-preference',recordVideo:{dir:'test-artifacts/journey-video-temp',size:{width:390,height:1000}}});
 try{
  const page=await context.newPage();const video=page.video();
  await page.goto(url);await page.locator('#skip').click();
  await upload(page,[
   {title:'Synthetic test record — source comparison',chamber:'Grimoires & Magical Texts',summary:'Controlled playtest fixture for this reading room. This is not a published archive record.',sources:[{url:'https://example.org/test-source',label:'Example test source'}]},
   {title:'Synthetic test record — provenance worksheet',chamber:'Grimoires & Magical Texts',summary:'A second controlled record for testing local search and navigation.',sources:[]}
  ]);
  await page.locator('#grid .tile').nth(1).click();await page.locator('#chamberImage').evaluate(img=>img.decode());
  await page.locator('#reveal').click();await ready(page);
  await page.locator('#enterReadingRoom').click();
  await page.locator('#recordSearch').fill('source comparison');
  await page.evaluate(()=>window.scrollTo(0,0));
  await page.screenshot({path:'test-artifacts/reading-room-mobile.png'});
  await page.locator('#readingRoom').screenshot({path:'test-artifacts/reading-room-panel.png'});
  await page.waitForTimeout(1200); // Keep the resulting reading view visible in the actual browser recording.
  await context.close();await video.saveAs('test-artifacts/portal-to-reading-room.webm');
 }finally{await context.close();await browser.close()}
});
