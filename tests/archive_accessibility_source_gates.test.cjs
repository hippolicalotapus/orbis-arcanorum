const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');

test('all archive pages keep document language and viewport',()=>{
 for(const page of ['index.html','catalog.html','orders.html']){
  const html=fs.readFileSync(page,'utf8');
  assert.match(html,/<html lang="en">/i);
  assert.match(html,/<meta name="viewport"/i);
 }
});
test('editorial resource links are HTTPS and never include credentials',()=>{
 const records=JSON.parse(fs.readFileSync('data/archive-resources.json','utf8'));
 for(const record of records){
  const url=new URL(record.url);
  assert.equal(url.protocol,'https:');
  assert.equal(url.username,'');
  assert.equal(url.password,'');
 }
});
test('private vendor configuration has no active registration',()=>{
 const config=JSON.parse(fs.readFileSync('vendor-config.json','utf8'));
 assert.equal(config.registrationEnabled,false);
});
