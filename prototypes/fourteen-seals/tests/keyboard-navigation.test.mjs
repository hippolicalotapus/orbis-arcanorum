import {test} from 'node:test';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {mkdirSync} from 'node:fs';

const url=pathToFileURL(resolve('prototypes/fourteen-seals/index.html')).href;

test('Escape returns from reading room to chamber, then chamber to atlas',async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);await page.locator('#skip').click();
  const tile=page.locator('#grid .tile').nth(7);
  await tile.click();
  await page.locator('#reviewRecord').fill('Navigation regression note');
  await page.locator('#reveal').click();
  await page.locator('#enterReadingRoom').click();
  assert.equal(await page.locator('#readingRoom').isVisible(),true);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#readingRoom').isVisible(),false);
  assert.equal(await page.locator('#detail').isVisible(),true);
  assert.equal(await page.locator('#enterReadingRoom').evaluate(el=>el===document.activeElement),true);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#chambers').isVisible(),true);
  assert.equal(await tile.evaluate(el=>el===document.activeElement),true);
  await tile.click();
  assert.equal(await page.locator('#reviewRecord').inputValue(),'Navigation regression note');
  assert.deepEqual(errors,[]);
 }finally{await browser.close()}
});

test('Escape closes the observatory and restores access-button focus',async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  await page.goto(url);await page.locator('#skip').click();
  await page.locator('#observatoryAccess').click();
  assert.equal(await page.locator('#observatory').isVisible(),true);
  assert.equal(await page.locator('#observatory').evaluate(el=>el===document.activeElement),true);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#observatory').isVisible(),false);
  assert.equal(await page.locator('#observatoryAccess').evaluate(el=>el===document.activeElement),true);
 }finally{await browser.close()}
});

test('Escape inside review notes does not discard chamber context',async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  await page.goto(url);await page.locator('#skip').click();
  await page.locator('#grid .tile').first().click();
  await page.locator('#reviewNotes').fill('An unfinished private review');
  await page.locator('#reviewNotes').focus();
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#detail').isVisible(),true);
  assert.equal(await page.locator('#reviewNotes').inputValue(),'An unfinished private review');
 }finally{await browser.close()}
});

test('modified Escape shortcuts do not navigate away',async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  await page.goto(url);await page.locator('#skip').click();
  await page.locator('#grid .tile').first().click();
  await page.keyboard.press('Control+Escape');
  assert.equal(await page.locator('#detail').isVisible(),true);
  await page.keyboard.press('Shift+Escape');
  assert.equal(await page.locator('#detail').isVisible(),true);
 }finally{await browser.close()}
});

test('all fourteen chamber exits restore the corresponding atlas tile',async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(url);await page.locator('#skip').click();
  const tiles=page.locator('#grid .tile');
  assert.equal(await tiles.count(),14);
  mkdirSync('test-artifacts',{recursive:true});
  await page.screenshot({path:'test-artifacts/orbis-navigation-atlas-390.png',fullPage:true});
  for(let i=0;i<14;i++){
   await tiles.nth(i).click();
   assert.equal(await page.locator('#detail').isVisible(),true);
   if(i===0)await page.screenshot({path:'test-artifacts/orbis-navigation-chamber-390.png',fullPage:true});
   assert.equal(await page.locator('#detailTitle').innerText(),await tiles.nth(i).locator('h3').innerText());
   await page.locator('#detailTitle').focus();
   await page.keyboard.press('Escape');
   assert.equal(await page.locator('#chambers').isVisible(),true,'Atlas must be visible after chamber '+(i+1));
   assert.equal(await tiles.nth(i).evaluate(node=>node===document.activeElement),true,'Focus must return to chamber '+(i+1));
  }
  assert.deepEqual(errors,[]);
 }finally{await browser.close()}
});

test('Escape exits active chamber even when all seals have unlocked the Observatory',async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  await page.goto(url);await page.locator('#skip').click();
  for(let i=0;i<14;i++){
   await page.locator('#grid .tile').nth(i).click();
   await page.locator('#reveal').click();
   await page.locator('#back').click();
  }
  assert.equal(await page.locator('#observatory').isVisible(),false,'Unlock must not interrupt the atlas');
  await page.locator('#grid .tile').first().click();
  await page.locator('#detailTitle').focus();
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#detail').isVisible(),false);
  assert.equal(await page.locator('#chambers').isVisible(),true);
  assert.equal(await page.locator('#observatory').isVisible(),false,'Returning to atlas must not force open the Observatory');
  assert.equal(await page.locator('#grid .tile').first().evaluate(node=>node===document.activeElement),true);
 }finally{await browser.close()}
});

test('unlocked Observatory can close and reopen without losing discovered seals',async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  await page.goto(url);await page.locator('#skip').click();
  for(let i=0;i<14;i++){
   await page.locator('#grid .tile').nth(i).click();
   await page.locator('#reveal').click();
   await page.locator('#back').click();
  }
  assert.match(await page.locator('#progress').innerText(),/14 of 14/);
  assert.equal(await page.locator('#observatory').isVisible(),false,'Unlock should not force the Observatory open');
  await page.locator('#observatoryAccess').click();
  await page.locator('#closeObservatory').click();
  assert.equal(await page.locator('#observatory').isVisible(),false);
  await page.locator('#observatoryAccess').click();
  assert.equal(await page.locator('#observatory').isVisible(),true);
  assert.match(await page.locator('#progress').innerText(),/14 of 14/);
 }finally{await browser.close()}
});
