const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
test('both fifteenth-room routes load the same responsive cinematic component',()=>{
 for(const p of ['fifteenth-room.html','prototypes/fourteen-seals/index.html']){const h=fs.readFileSync(p,'utf8');assert.ok(h.includes('data-final-seal'),p+' must expose final seal');assert.ok(h.includes('final-seal.css'));assert.ok(h.includes('final-seal.js'));}
 const css=fs.readFileSync('final-seal.css','utf8');assert.match(css,/prefers-reduced-motion/);assert.match(css,/@keyframes final-left-open/);assert.match(css,/@keyframes final-right-open/);
 new vm.Script(fs.readFileSync('final-seal.js','utf8'));
});
