import {test} from 'node:test';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {mkdirSync} from 'node:fs';

const url=pathToFileURL(resolve('prototypes/fourteen-seals/index.html')).href;

test('engraved portals fit narrow phones, tablets and desktop without network assets',async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({reducedMotion:'reduce'});
  const requests=[];
  page.on('request',request=>{if(/^https?:/.test(request.url()))requests.push(request.url())});
  for(const width of [320,390,430,768,1280]){
   await page.setViewportSize({width,height:844});
   await page.goto(url);
   await page.locator('#skip').click();
   assert.equal(await page.locator('#grid .tile').count(),14);
   assert.equal(await page.locator('#grid .portal-art svg').count(),14);
   const icons=await page.locator('#grid .portal-art svg').evaluateAll(nodes=>nodes.map(node=>node.innerHTML));
   assert.equal(new Set(icons).size,14,'Every chamber has a distinct engraving');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`Overflow at ${width}px`);
   for(const tile of await page.locator('#grid .tile').all()){
    const box=await tile.boundingBox();
    assert.ok(box.width>=44&&box.height>=44,'Portal touch target');
    assert.equal(await tile.evaluate(node=>node.scrollHeight<=node.clientHeight&&node.scrollWidth<=node.clientWidth),true,'Clipped portal content');
   }
   assert.equal(await page.locator('#importPanel').evaluate(node=>node.getBoundingClientRect().top>document.querySelector('#grid').getBoundingClientRect().bottom),true);
   if(width===390){
    mkdirSync('test-artifacts',{recursive:true});
    await page.screenshot({path:'test-artifacts/fourteen-portals-mobile.png',fullPage:true});
   }
  }
  assert.deepEqual(requests,[],'Offline portal browsing must not request remote assets or data');
 }finally{await browser.close()}
});

test('keyboard chamber navigation restores focus, preserves notes and counts unique seals',async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(url);
  await page.locator('#skip').click();
  assert.equal(await page.locator('#atlasTitle').evaluate(node=>node===document.activeElement),true);
  const portal=page.locator('#grid .tile').nth(7);
  await portal.focus();await page.keyboard.press('Enter');
  assert.equal(await page.locator('#detailTitle').innerText(),'Celestial Mysteries');
  assert.equal(await page.locator('#detailTitle').evaluate(node=>node===document.activeElement),true);
  assert.equal(await page.locator('#mechanismGlyph svg').count(),1);
  await page.locator('#reviewRecord').fill('Synthetic note — navigation regression');
  await page.locator('#reviewNotes').fill('Preserve this unsaved form when returning to the atlas.');
  await page.locator('#reveal').click();
  await page.locator('#reveal').click();await page.locator('#reveal').click();
  await page.locator('#back').click();
  assert.equal(await portal.evaluate(node=>node===document.activeElement),true);
  assert.match(await page.locator('#progress').innerText(),/^1 of 14/);
  assert.equal(await portal.getAttribute('data-visited'),'true');
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('#reviewRecord').inputValue(),'Synthetic note — navigation regression');
  assert.equal(await page.locator('#reviewNotes').inputValue(),'Preserve this unsaved form when returning to the atlas.');
  await page.locator('#back').click();
  await page.locator('#observatoryAccess').click();
  assert.equal(await page.locator('#observatoryAccess').getAttribute('aria-expanded'),'true');
  await page.locator('#closeObservatory').click();
  assert.equal(await page.locator('#observatoryAccess').getAttribute('aria-expanded'),'false');
  assert.equal(await page.locator('#observatoryAccess').evaluate(node=>node===document.activeElement),true);
  assert.deepEqual(errors,[]);
 }finally{await browser.close()}
});

test('chamber interiors cycle through fourteen guides, wrap, reveal and return to local tools',async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:1000},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(url);await page.locator('#skip').click();
  const names=await page.locator('#grid .tile h3').allTextContents();
  await page.locator('#grid .tile').first().click();
  const scopes=[];
  for(let i=0;i<14;i++){
   assert.equal(await page.locator('#detailTitle').innerText(),names[i]);
   assert.equal(await page.locator('#chamberTopics li').count(),3);
   scopes.push(await page.locator('#chamberScope').innerText());
   assert.equal(await page.locator('#reveal').getAttribute('aria-expanded'),'false');
   await page.locator('#reveal').click();
   assert.equal(await page.locator('#reveal').getAttribute('aria-expanded'),'true');
   assert.equal(await page.locator('#scroll').evaluate(node=>getComputedStyle(node).visibility),'visible');
   await page.locator('#nextChamber').click();
  }
  assert.equal(new Set(scopes).size,14);
  assert.equal(await page.locator('#detailTitle').innerText(),names[0]);
  await page.locator('#previousChamber').click();
  assert.equal(await page.locator('#detailTitle').innerText(),names[13]);
  await page.locator('#returnAtlas').click();
  assert.equal(await page.locator('#grid .tile').nth(13).evaluate(node=>node===document.activeElement),true);
  await page.locator('#grid .tile').nth(7).click();
  assert.match(await page.locator('#recordResults').innerText(),/does not query the live archive/);
  await page.locator('#recordResults button').click();
  assert.equal(await page.locator('#archiveImport').evaluate(node=>node===document.activeElement),true);
  assert.equal(await page.locator('#chambers').isVisible(),true);
  assert.deepEqual(errors,[]);
 }finally{await browser.close()}
});

test('actual chamber webpage screenshots and interior responsiveness',async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({reducedMotion:'reduce'});
  mkdirSync('test-artifacts',{recursive:true});
  for(const width of [320,390,768]){
   await page.setViewportSize({width,height:1000});
   await page.goto(url);await page.locator('#skip').click();
   if(width===390)await page.screenshot({path:'test-artifacts/atlas-mobile-viewport.png'});
   for(let i=0;i<14;i++){
    await page.locator('#grid .tile').nth(i).click();
    await page.locator('#reveal').click();
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`Interior ${i+1} at ${width}px overflows`);
    if(width===390&&[1,7].includes(i)){
     await page.evaluate(()=>window.scrollTo(0,0));
     await page.screenshot({path:`test-artifacts/${i===7?'celestial':'grimoire'}-chamber-mobile.png`});
    }
    await page.locator('#returnAtlas').click();
   }
  }
 }finally{await browser.close()}
});
