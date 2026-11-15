'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
function routes(){
 const context={window:{},URLSearchParams};
 vm.runInNewContext(fs.readFileSync('prototypes/fourteen-seals/research-routes.js','utf8'),context);
 return context.window.PortalResearch;
}
test('all fourteen portal research links resolve to existing catalog records without remapping them',()=>{
 const research=routes(),records=JSON.parse(fs.readFileSync('data/archive-catalog.json','utf8'));
 const original=JSON.stringify(records);
 assert.equal(research.routes.length,14);
 for(let i=0;i<14;i++){
  const url=new URL(research.href(i),'https://orbis.example/prototypes/fourteen-seals/index.html');
  assert.equal(url.origin,'https://orbis.example');assert.equal(url.pathname,'/catalog.html');
  const c=url.searchParams.get('chamber'),q=url.searchParams.get('q'),cl=url.searchParams.get('classification');
  const found=records.filter(r=>(!c||r.chamber===c)&&(!cl||r.classification===cl)&&(!q||[r.title,r.chamber,r.summary,r.classification].some(v=>v.toLowerCase().includes(q.toLowerCase()))));
  assert.ok(found.length>0,'Portal '+(i+1)+' must lead to actual research');
  assert.ok(research.routes[i].label.length>0);
 }
 assert.equal(JSON.stringify(records),original);
});
test('matching chambers keep their canonical category while thematic portals use suggested searches',()=>{
 const research=routes();
 assert.equal(new URL(research.href(0),'https://orbis.example').searchParams.get('chamber'),'Secret Societies & Orders');
 assert.equal(new URL(research.href(3),'https://orbis.example').searchParams.get('chamber'),'Ancient Religions & Mythology');
 assert.equal(new URL(research.href(4),'https://orbis.example').searchParams.get('q'),'folklore');
 assert.equal(new URL(research.href(13),'https://orbis.example').searchParams.get('classification'),'Disputed');
 assert.equal(research.href(99),'../../catalog.html');
});
test('changing chambers updates the visible research link and unknown topics fall back to the whole catalog',()=>{
 const research=routes(),link={};
 for(let i=0;i<14;i++){
  research.update(link,i);
  assert.equal(link.href,research.href(i));assert.equal(link.textContent,research.routes[i].label+' →');
 }
 research.update(link,99);
 assert.equal(link.href,'../../catalog.html');assert.equal(link.textContent,'Browse the research catalog →');
});
