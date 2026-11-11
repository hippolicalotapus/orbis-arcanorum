import {test} from 'node:test';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {mkdirSync,statSync} from 'node:fs';

const url=pathToFileURL(resolve('prototypes/fourteen-seals/index.html')).href;
mkdirSync('test-artifacts',{recursive:true});

test('fourteen distinct fantasy scenes load locally; full artwork matches each chamber',async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:1000},reducedMotion:'reduce'});
  const errors=[],external=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('request',request=>{if(/^https?:/.test(request.url()))external.push(request.url())});
  await page.goto(url);await page.locator('#skip').click();
  const openings=[];
  const names=await page.locator('#grid .tile h3').allTextContents();
  const images=page.locator('#grid .portal-image');
  assert.equal(await images.count(),14);
  const sources=await images.evaluateAll(nodes=>nodes.map(node=>node.getAttribute('src')));
  assert.equal(new Set(sources).size,14,'Each chamber must have its own artwork');
  let totalBytes=0;
  for(let i=0;i<14;i++){
   await images.nth(i).scrollIntoViewIfNeeded();
   await images.nth(i).evaluate(img=>img.decode());
   assert.ok(await images.nth(i).evaluate(img=>img.naturalWidth>=384&&img.naturalHeight>=384));
   const card=resolve('prototypes/fourteen-seals',sources[i]);
   const full=card.replace('-card.webp','.webp');
   assert.ok(statSync(card).size<150000,'Card download budget');
   assert.ok(statSync(full).size<500000,'Interior download budget');
   totalBytes+=statSync(card).size+statSync(full).size;
   await page.locator('#grid .tile').nth(i).click();
   await page.locator('#chamberImage').evaluate(img=>img.decode());
   assert.equal(await page.locator('#detailTitle').innerText(),names[i]);
   openings.push(await page.locator('#mechanism').getAttribute('data-opening'));
   assert.equal(await page.locator('.opening-fx').count(),1);
   assert.equal(await page.locator('#chamberImage').getAttribute('src'),sources[i].replace('-card.webp','.webp'));
   assert.equal(await page.locator('#mechanismGlyph').isVisible(),false);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
   if([1,2,7].includes(i)){
    await page.evaluate(()=>window.scrollTo(0,0));
    await page.screenshot({path:`test-artifacts/fantasy-${['orders','grimoires','alchemy','religions','legends','civilizations','forbidden','celestial'][i]}-mobile.png`});
   }
   await page.locator('#returnAtlas').click();
  }
  assert.equal(new Set(openings).size,14,'All fourteen portals need different opening mechanisms');
  assert.ok(totalBytes<6000000,'All artwork including thumbnails stays below 6 MB');
  await page.evaluate(()=>window.scrollTo(0,0));
  await page.screenshot({path:'test-artifacts/fantasy-atlas-mobile.png'});
  await page.screenshot({path:'test-artifacts/fantasy-atlas-full.png',fullPage:true});
  assert.deepEqual(external,[],'Browsing the local fantasy prototype makes no server request');
  assert.deepEqual(errors,[]);
 }finally{await browser.close()}
});

test('atmosphere and entry motion work, can be paused, and honor reduced motion',async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:1000},reducedMotion:'no-preference'});
  await page.goto(url);await page.locator('#skip').click();
  await page.locator('#grid .tile').first().scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>document.querySelector('.portal-scene').classList.contains('scene-visible'));
  assert.equal(await page.locator('.portal-fog').first().evaluate(node=>getComputedStyle(node).animationPlayState),'running');
  await page.locator('#motionToggle').click();
  assert.equal(await page.locator('#motionToggle').getAttribute('aria-pressed'),'true');
  assert.equal(await page.locator('.portal-fog').first().evaluate(node=>getComputedStyle(node).animationName),'none');
  await page.locator('#motionToggle').click();
  await page.locator('#grid .tile').nth(7).click();
  await page.locator('#chamberImage').evaluate(img=>img.decode());
  await page.locator('#reveal').click();
  await page.waitForFunction(()=>getComputedStyle(document.querySelector('.fx-starfield')).animationName==='stars-align');
  assert.notEqual(await page.locator('.fx-starfield').evaluate(node=>getComputedStyle(node).transform),'none');
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForFunction(()=>document.querySelector('#motionToggle').disabled);
  assert.equal(await page.locator('#mechanism .portal-fog').evaluate(node=>getComputedStyle(node).animationName),'none');
  assert.equal(await page.locator('#chamberImage').evaluate(node=>getComputedStyle(node).transitionDuration),'0s');
  assert.equal(await page.locator('.opening-fx').evaluate(node=>getComputedStyle(node).opacity),'0');
  assert.equal(await page.locator('.fx-starfield').evaluate(node=>getComputedStyle(node).animationName),'none');
 }finally{await browser.close()}
});

test('every chamber plays its own themed opening sequence',async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:1000},reducedMotion:'no-preference'});
  const failed=[];page.on('requestfailed',request=>failed.push(request.url()));
  for(const prop of ['parchment','book','hourglass','vessel'])assert.ok(statSync(resolve('prototypes/fourteen-seals/assets/props',prop+'.webp')).size<200000);
  await page.goto(url);await page.locator('#skip').click();
  const sequences=[];
  for(let i=0;i<14;i++){
   await page.locator('#grid .tile').nth(i).click();
   await page.locator('#chamberImage').evaluate(img=>img.decode());
   await page.locator('#reveal').click();
   await page.waitForFunction(()=>Number(getComputedStyle(document.querySelector('.opening-fx')).opacity)>.1);
   const animations=await page.locator('.opening-fx *').evaluateAll(nodes=>nodes.map(node=>getComputedStyle(node).animationName).filter(name=>name!=='none'));
   assert.ok(animations.length>0,`Chamber ${i+1} has no themed animation`);
   sequences.push([...new Set(animations)].sort().join('|'));
   if([1,2,6,11].includes(i)){
    await page.waitForTimeout(500); // Capture a visible intermediate state, not a conceptual mockup.
    await page.screenshot({path:`test-artifacts/opening-sequence-${i+1}.png`});
   }
   await page.locator('#returnAtlas').click();
  }
  assert.equal(new Set(sequences).size,14,'A common zoom cannot stand in for fourteen different openings');
  assert.deepEqual(failed,[],'Every opening prop must load successfully');
 }finally{await browser.close()}
});

test('record actual webpage entry animation for visual review',async()=>{
 const browser=await chromium.launch({headless:true});
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'no-preference',recordVideo:{dir:'test-artifacts/video-temp',size:{width:390,height:844}}});
 try{
  const page=await context.newPage();const video=page.video();
  await page.goto(url);await page.locator('#skip').click();
  for(const index of [1,6,7,11]){
   await page.locator('#grid .tile').nth(index).click();
   await page.locator('#chamberImage').evaluate(img=>img.decode());
   await page.evaluate(()=>window.scrollTo(0,200));
   await page.waitForTimeout(500); // Deliberate timing for recording the real opening sequence.
   await page.locator('#reveal').click();
   await page.waitForTimeout(2800);
   await page.locator('#returnAtlas').click();
  }
  await context.close();
  await video.saveAs('test-artifacts/fantasy-entry-animation.webm');
 }finally{await context.close();await browser.close()}
});
