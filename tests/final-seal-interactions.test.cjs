'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const script=fs.readFileSync(path.resolve(__dirname,'../final-seal.js'),'utf8');
function harness({reducedMotion=false,paused=false,query=''}={}){
 const controls=Object.fromEntries(['open','skip','enter','status'].map(k=>[k,{hidden:k==='enter'||k==='skip',disabled:false,textContent:'',handlers:{},addEventListener(type,fn){this.handlers[type]=fn},click(){this.handlers.click?.()},focus(){this.focused=true}}]));
 const host={dataset:{state:'sealed'},handlers:{},querySelector(sel){return controls[sel.slice(12,-1)]},addEventListener(type,fn){this.handlers[type]=fn}};
 const changes={};let timerId=0;const timers=new Map();const clicked=[];
 const document={hidden:false,handlers:{},body:{classList:{contains:k=>paused&&k==='motion-paused'}},querySelectorAll:()=>[host],addEventListener(type,fn){this.handlers[type]=fn},getElementById:id=>({click(){clicked.push(id)}})};
 const reduced={matches:reducedMotion,addEventListener(type,fn){changes[type]=fn}};
 const sandbox={document,matchMedia:()=>reduced,location:{search:query},URLSearchParams,setTimeout(fn){timers.set(++timerId,fn);return timerId},clearTimeout(id){timers.delete(id)},MutationObserver:class{constructor(fn){this.fn=fn;changes.mutation=fn}observe(){}}};
 vm.runInNewContext(script,sandbox);
 return {host,controls,document,reduced,changes,clicked,timers,flush(){for(const fn of [...timers.values()])fn()}};
}
test('opening, skip, replay and animation completion preserve usable controls',()=>{
 const h=harness();h.controls.open.click();assert.equal(h.host.dataset.state,'opening');assert.equal(h.controls.open.disabled,true);assert.equal(h.controls.enter.hidden,true);
 h.controls.skip.click();assert.equal(h.host.dataset.state,'ready');assert.equal(h.controls.enter.hidden,false);assert.equal(h.controls.enter.focused,true);
 h.controls.open.click();assert.equal(h.host.dataset.state,'opening');h.host.handlers.animationend({animationName:'final-right-open'});assert.equal(h.host.dataset.state,'ready');
});
test('reduced motion opens immediately and backgrounding finishes opening',()=>{
 const a=harness({reducedMotion:true});a.controls.open.click();assert.equal(a.host.dataset.state,'ready');assert.equal(a.timers.size,0);
 const b=harness();b.controls.open.click();b.document.hidden=true;b.document.handlers.visibilitychange();assert.equal(b.host.dataset.state,'ready');
});
test('reviewer shortcut invokes the preserved observatory route',()=>{const h=harness({query:'?room=15'});assert.deepEqual(h.clicked,['skip','observatoryAccess'])});
