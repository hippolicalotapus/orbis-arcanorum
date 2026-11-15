'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const script=fs.readFileSync('record.html','utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
const records=[
 {id:'lead',title:'Rosicrucian manifestos',chamber:'Orders',classification:'Documented',summary:'Historical manifestos and sources',source_status:'Verification pending',rights:'Link only',source_url:'https://example.org/lead'},
 {id:'related',title:'Rosicrucian commentary',chamber:'Orders',classification:'Disputed',summary:'Historical sources and commentary',source_status:'Source page checked',rights:'Link only',source_url:'https://example.org/related'}
];
function node(){return {href:'./catalog.html',textContent:'',children:[],append(...items){this.children.push(...items)}}}
async function harness(search){
 const ids=Object.fromEntries(['status','title','summary','metadata','source','related','chamber-link','constellation-link','return-catalog','catalog-breadcrumb'].map(id=>[id,node()]));
 const document={getElementById:id=>ids[id],createElement:node};
 vm.runInNewContext(script,{document,location:{search},URLSearchParams,fetch:async()=>({ok:true,json:async()=>records})});
 for(let i=0;i<3;i++)await new Promise(resolve=>setImmediate(resolve));
 return ids;
}
test('dossier return and breadcrumb restore the original filtered result set',async()=>{
 const ids=await harness('?id=lead&chamber=Orders&q=Rosicrucian&classification=Documented&review=pending');
 for(const id of ['return-catalog','catalog-breadcrumb']){
  const url=new URL(ids[id].href,'https://orbis.example/record.html');
  assert.equal(url.pathname,'/catalog.html');assert.equal(url.searchParams.get('q'),'Rosicrucian');
  assert.equal(url.searchParams.get('chamber'),'Orders');assert.equal(url.searchParams.get('classification'),'Documented');assert.equal(url.searchParams.get('review'),'pending');
  assert.equal(url.searchParams.has('id'),false);
 }
});
test('following related dossiers keeps the starting research context',async()=>{
 const ids=await harness('?id=lead&q=Rosicrucian&review=pending');
 assert.equal(ids.related.children.length,1);
 const link=new URL(ids.related.children[0].href,'https://orbis.example/record.html');
 assert.equal(link.searchParams.get('id'),'related');assert.equal(link.searchParams.get('q'),'Rosicrucian');assert.equal(link.searchParams.get('review'),'pending');
 const next=await harness(link.search);
 assert.equal(new URL(next['return-catalog'].href,'https://orbis.example').searchParams.get('q'),'Rosicrucian');
});
test('direct dossier entry ignores arbitrary return destinations and keeps a safe catalog fallback',async()=>{
 const ids=await harness('?id=lead&return=https://elsewhere.example/private&campaign=secret');
 assert.equal(ids['return-catalog'].href,'./catalog.html');assert.equal(ids['catalog-breadcrumb'].href,'./catalog.html');
 assert.equal(new URL(ids.related.children[0].href,'https://orbis.example').searchParams.has('return'),false);
});
test('an unavailable dossier still offers the original filtered catalog route',async()=>{
 const ids=await harness('?id=missing&q=Rosicrucian');
 assert.equal(ids.status.textContent,'Record not found');
 assert.equal(new URL(ids['return-catalog'].href,'https://orbis.example').searchParams.get('q'),'Rosicrucian');
});
