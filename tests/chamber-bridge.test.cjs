'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {buildBridge,catalogHref,validateBridge}=require('../tools/chamber-bridge.cjs');
const c=['Secret Societies & Orders','Grimoires & Magical Texts','Alchemy & Hermeticism','Ancient Religions & Mythology','Paranormal Investigations','Unverified Mysteries','Witchcraft & Folk Magic','Mystical Symbols & Languages','Rare Manuscripts & Artifacts','Esoteric People & Biographies','Occult Locations & Archaeology','Documentaries, Lectures & Audio','Sacred Archives','The Lost Histories'];
const p=['Secret Societies & Orders','Grimoires & Magical Texts','Alchemy & Hermeticism','Ancient Religions & Mythology','Myths & Legends','Lost Civilizations','Forbidden Knowledge','Celestial Mysteries','Cryptids & Unexplained','Paranormal & Hauntings','Artifacts & Relics','Prophecies & Texts','Esoteric Sciences','Questionable & Disputed'];
test('all fourteen cinematic entrances survive, four exact matches',()=>{
 const b=buildBridge(c,p);assert.equal(b.length,14);assert.equal(b.filter(x=>x.status==='exact-name-match').length,4);
 assert.equal(b.filter(x=>x.status==='editorial-review-required').length,10);
 assert.equal(validateBridge(b,c,p).ok,true);
});
test('exact links are encoded and uncertain names fail closed',()=>{
 const b=buildBridge(c,p);assert.equal(catalogHref(b[0]),'./catalog.html?chamber=Secret%20Societies%20%26%20Orders');
 assert.equal(catalogHref(b[5]),'./catalog.html');
});
test('a mismatched catalog target is never accepted',()=>{
 const b=buildBridge(c,p).map(x=>({...x}));b[5].catalogChamber='The Lost Histories';b[5].status='exact-name-match';
 assert.equal(validateBridge(b,c,p).ok,false);assert.equal(catalogHref(b[5]),'./catalog.html');
});
test('duplicate and incomplete manifests cannot silently remap chambers',()=>{
 assert.throws(()=>buildBridge(c.slice(1),p));
 assert.throws(()=>buildBridge(c,[...p.slice(0,13),p[0]]));
});
