const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
test('catalog validates remote source links before assigning href',()=>{
 const html=fs.readFileSync('catalog.html','utf8');
 assert.match(html,/Array\.isArray\(data\)/);
 assert.match(html,/url\.protocol==='https:'/);
 assert.match(html,/!url\.username&&!url\.password/);
 assert.match(html,/items=data\.filter/);
});
test('catalog source records currently use credential-free HTTPS links',()=>{
 const items=JSON.parse(fs.readFileSync('data/twelve-archives-catalog.json','utf8'));
 assert.ok(items.length>0);
 for(const item of items){const u=new URL(item.source_url);assert.equal(u.protocol,'https:');assert.equal(u.username,'');assert.equal(u.password,'');}
});
