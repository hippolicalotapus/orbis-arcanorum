// Run from repository root: node --test prototypes/fourteen-seals/tests/chamber-mapping.test.mjs
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const root='prototypes/fourteen-seals/';
const html=readFileSync(root+'index.html','utf8');
const taxonomy=JSON.parse(readFileSync(root+'archive-section-mapping.json','utf8'));
const match=html.match(/const data=(\[\[.*?\]\]);\s*const descriptions=/s);
assert.ok(match,'Fourteen-chamber declaration must be present');
const chambers=JSON.parse(match[1]); // JSON-compatible chamber literals
test('exactly fourteen distinct destination chambers',()=>{
 assert.equal(chambers.length,14);
 assert.equal(new Set(chambers.map(c=>c[0])).size,14);
});
test('every mapped source section resolves to a real chamber',()=>{
 for(const [source,destination] of Object.entries(taxonomy.mapping)){
  assert.ok(chambers.some(c=>c[0]===destination),source+' points to unknown chamber '+destination);
 }
});
test('review-required categories remain unmapped',()=>{
 for(const section of taxonomy.requires_human_review){
  assert.equal(Object.hasOwn(taxonomy.mapping,section),false,section+' was prematurely mapped');
 }
 assert.equal(new Set(taxonomy.requires_human_review).size,taxonomy.requires_human_review.length);
});
test('all documented 34 source sections are accounted for exactly once',()=>{
 assert.equal(Object.keys(taxonomy.mapping).length,26);
 assert.equal(taxonomy.requires_human_review.length,8);
 assert.equal(Object.keys(taxonomy.mapping).length+taxonomy.requires_human_review.length,34);
});
