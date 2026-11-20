const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

for(const page of ['index.html','catalog.html','orders.html']){
 test(page+' keeps internal navigation relative and local',()=>{
  const html=fs.readFileSync(page,'utf8');
  for(const [,target] of html.matchAll(/href=["']\.\/([^"'#?]+)["']/g)){
   assert.ok(fs.existsSync(target),page+': missing '+target);
  }
 });
}
test('registration and vendor publishing remain disabled during private development',()=>{
 const config=JSON.parse(fs.readFileSync('vendor-config.json','utf8'));
 assert.equal(config.registrationEnabled,false);
 for(const page of ['vendor.js','studio.js','review.js']){
  const code=fs.readFileSync(page,'utf8');
  assert.doesNotMatch(code,/service_role|sb_secret_/);
  assert.match(code,/registrationEnabled/);
 }
});
test('archive catalogue records retain HTTPS sources and classifications',()=>{
 const items=JSON.parse(fs.readFileSync('data/archive-resources.json','utf8'));
 assert.ok(Array.isArray(items)&&items.length>0);
 for(const item of items){
  assert.equal(new URL(item.url).protocol,'https:');
  assert.ok(['Documented','Disputed','Unverified','Folklore & Legend'].includes(item.classification));
 }
});
