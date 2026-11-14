const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
test('manuscript laboratory and excavation use distinct compositions and scene layers',()=>{
 const h=fs.readFileSync('prototypes/fourteen-seals/index.html','utf8');
 assert.ok(h.includes('scene-variants.css'));
 for(const name of ['grimoires-v2','alchemy-v2','civilizations-v2'])assert.ok(h.includes('"'+name+'"'));
 const box={window:{}};vm.runInNewContext(fs.readFileSync('prototypes/fourteen-seals/portal-openings.js','utf8'),box);
 for(const [i,cls] of [[1,'fx-folio'],[2,'fx-lab-vapour'],[5,'fx-excavation-dust']])assert.ok(box.window.PortalOpenings.markup[i].includes(cls));
 const css=fs.readFileSync('prototypes/fourteen-seals/scene-variants.css','utf8');
 for(const name of ['manuscript','laboratory','excavation'])assert.ok(css.includes('[data-scene='+name+']'));
});
