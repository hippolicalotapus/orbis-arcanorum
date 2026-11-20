const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const base='prototypes/fourteen-seals';
test('homepage exposes the recovered cinematic archive',()=>{
 const html=fs.readFileSync('index.html','utf8');
 assert.match(html,/href="\.\/prototypes\/fourteen-seals\/index.html"/);
});
test('recovered original portal scripts and all artwork references are intact',()=>{
 const html=fs.readFileSync(base+'/index.html','utf8');
 for(const m of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))if(m[1].trim())new vm.Script(m[1]);
 const sandbox={window:{}};vm.runInNewContext(fs.readFileSync(base+'/portal-openings.js','utf8'),sandbox);
 const p=sandbox.window.PortalOpenings;
 assert.equal(p.specs.length,14);assert.equal(new Set(p.specs.map(x=>x[0])).size,14);assert.equal(p.markup.length,14);
 const assets=JSON.parse(html.match(/const portalAssets=(\[[^;]+\]);/)[1]);
 assert.equal(new Set(assets).size,14);
 for(const name of assets)for(const suffix of ['', '-card']){
  let bytes=fs.readFileSync(path.join(base,'assets/portals',name+suffix+(name.endsWith('-v2')?'.svg':'.webp')));
  if(name.endsWith('-v2'))bytes=Buffer.from(bytes.toString().match(/base64,([^"]+)/)[1],'base64');
  assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');
  assert.equal(bytes.readUInt32LE(4)+8,bytes.length,'complete image bytes');
 }
 for(const name of ['book','hourglass','parchment','vessel'])assert.ok(fs.statSync(path.join(base,'assets/props',name+'.webp')).size>1000);
 assert.match(html,/id="observatory"/);assert.match(html,/id="boardPins"/);
});
