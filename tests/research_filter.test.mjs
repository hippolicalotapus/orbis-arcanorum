import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {filterResearchLeads} from '../research-filter.mjs';
const catalog=JSON.parse(readFileSync('data/twelve-archives-catalog.json','utf8'));
test('catalog search supports chamber and evidence classification filters',()=>{
 const first=catalog[0];
 const results=filterResearchLeads(catalog,{chamber:first.chamber,classification:first.classification});
 assert.ok(results.length>0);
 assert.ok(results.every(item=>item.chamber===first.chamber&&item.classification===first.classification));
});
test('search rejects unsafe URLs before returning results',()=>{
 const item={...catalog[0],source_url:'javascript:alert(1)'};
 assert.deepEqual(filterResearchLeads([item]),[]);
});
test('search is case insensitive and does not change source records',()=>{
 const first=catalog[0];
 const result=filterResearchLeads([first],{term:first.title.toUpperCase()});
 assert.equal(result.length,1);
 assert.equal(result[0],first);
});
