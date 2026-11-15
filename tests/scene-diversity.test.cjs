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

test('each of the remaining original portals has its own frame and narrow-phone height is fluid',()=>{
 const html=fs.readFileSync('prototypes/fourteen-seals/index.html','utf8');
 const css=fs.readFileSync('prototypes/fourteen-seals/scene-variants.css','utf8');
 assert.match(html,/b\.dataset\.opening=PortalOpenings\.specs\[i\]\[0\]/);
 const names=['insignia','tablets','storybook','chains','constellations','tracks','lantern','reliquary','hourglass','astrolabe','vault'];
 const shapes=new Set();
 for(const name of names){
  const selector='#chambers .grid .tile[data-opening="'+name+'"]';
  assert.ok(css.includes(selector),'missing frame for '+name);
  const declaration=css.slice(css.indexOf(selector)).match(/^[^{]*\{border-radius:([^;}]+)\}/);
  assert.ok(declaration,'missing frame radius for '+name);
  shapes.add(declaration[1]);
 }
 assert.equal(shapes.size,names.length,'every original frame must have a distinct silhouette');
 assert.ok(css.includes('@media(max-width:520px)'));
 assert.ok(css.includes('height:clamp(345px,115vw,510px)'));
 assert.ok(css.includes('height:clamp(335px,112vw,430px)'));
});
