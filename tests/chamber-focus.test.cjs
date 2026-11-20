'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync('prototypes/fourteen-seals/index.html','utf8');
const code=html.slice(html.indexOf('let openingState='),html.indexOf('$("reveal").onclick='));
function harness(){
 const document={activeElement:null};
 const node=()=>({dataset:{},disabled:false,textContent:'',classList:{add(){},remove(){}},setAttribute(){},focus(){document.activeElement=this}});
 const nodes=Object.fromEntries(['detail','reveal','enterReadingRoom','skipOpening','mechanism','journeyStatus','grid'].map(id=>[id,node()]));
 nodes.grid.children=[node()];
 const sandbox={document,$:id=>nodes[id],clearTimeout(){},visits:new Set(),currentChamber:0,updateProgress(){}};
 vm.createContext(sandbox);vm.runInContext(code,sandbox);
 return {document,nodes,run:expression=>vm.runInContext(expression,sandbox)};
}
test('a completed chamber entrance preserves focus when Skip disappears',()=>{
 const h=harness();h.run('openingState="opening"');h.nodes.skipOpening.focus();h.run('finishOpening()');
 assert.equal(h.document.activeElement,h.nodes.enterReadingRoom);
 assert.equal(h.nodes.enterReadingRoom.disabled,false);
 assert.equal(h.nodes.detail.dataset.journey,'ready');
});
test('chamber completion does not steal focus from adjacent navigation',()=>{
 const h=harness();h.run('openingState="opening"');const navigation={};h.document.activeElement=navigation;h.run('finishOpening()');
 assert.equal(h.document.activeElement,navigation);
});
test('a cancelled opening cannot move focus or unlock chamber entry',()=>{
 const h=harness();h.run('cancelOpening()');const atlasTile={};h.document.activeElement=atlasTile;h.run('finishOpening()');
 assert.equal(h.document.activeElement,atlasTile);
 assert.equal(h.nodes.enterReadingRoom.disabled,true);
 assert.equal(h.nodes.detail.dataset.journey,'sealed');
});
