import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,readFileSync,existsSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
const script=resolve('prototypes/fourteen-seals/convert-archive-export.mjs');
const mapping=resolve('prototypes/fourteen-seals/archive-section-mapping.json');
test('authorized export converts mapped categories and quarantines unmapped ones',()=>{
 const dir=mkdtempSync(join(tmpdir(),'orbis-converter-'));
 try{
  const input=join(dir,'private-input.json'),output=join(dir,'private-output.json');
  writeFileSync(input,JSON.stringify({records:[
   {title:'Test alchemy',archive_section:'Alchemy & Hermeticism',description:'Synthetic example',source_url:'https://example.org/source'},
   {title:'Test oral history',archive_section:'Indigenous Traditions & Oral Histories',source_url:'https://example.org/other'},
   {title:'Test unsafe URL',archive_section:'Alchemy & Hermeticism',source_url:'javascript:alert(1)'}
  ]}));
  const run=spawnSync(process.execPath,[script,input,mapping,output],{encoding:'utf8'});
  assert.equal(run.status,0,run.stderr);
  const result=JSON.parse(readFileSync(output,'utf8'));
  assert.deepEqual(result.summary,{input:3,mapped:2,review_required:1});
  assert.equal(result.records[0].chamber,'Alchemy & Hermeticism');
  assert.equal(result.records[0].sources[0].url,'https://example.org/source');
  assert.deepEqual(result.records[1].sources,[]);
  assert.equal(result.review_required[0].archive_section,'Indigenous Traditions & Oral Histories');
  const repeat=spawnSync(process.execPath,[script,input,mapping,output],{encoding:'utf8'});
  assert.notEqual(repeat.status,0,'Existing output must not be overwritten');
  assert.ok(existsSync(output));
 }finally{rmSync(dir,{recursive:true,force:true})}
});
test('converter rejects invalid records without writing output',()=>{
 const dir=mkdtempSync(join(tmpdir(),'orbis-converter-'));
 try{
  const input=join(dir,'input.json'),output=join(dir,'output.json');
  writeFileSync(input,JSON.stringify([{title:42,archive_section:'Alchemy & Hermeticism'}]));
  const run=spawnSync(process.execPath,[script,input,mapping,output],{encoding:'utf8'});
  assert.notEqual(run.status,0);
  assert.equal(existsSync(output),false);
 }finally{rmSync(dir,{recursive:true,force:true})}
});
