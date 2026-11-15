'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync('catalog.html','utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const records=[
 {id:'lead',title:'Rosicrucian manifestos',chamber:'Orders',classification:'Documented',summary:'Historical sources',source_status:'Verification pending',source_url:'https://example.org/lead'},
 {id:'reviewed',title:'Rosicrucian commentary',chamber:'Orders',classification:'Disputed',summary:'Later commentary',source_status:'Source page checked',source_url:'https://example.org/reviewed'},
 {id:'other',title:'Alchemical manuscript',chamber:'Alchemy',classification:'Documented',summary:'Laboratory sources',source_status:'Verification pending',source_url:'https://example.org/other'}
];
function node(){return {value:'',children:[],options:[],handlers:{},hidden:false,disabled:false,textContent:'',append(...items){this.children.push(...items);this.options.push(...items)},replaceChildren(...items){this.children=[...items]},addEventListener(name,fn){this.handlers[name]=fn},focus(){this.focused=true}}}
async function harness(search=''){
 const ids=Object.fromEntries(['query','chamber','classification','review','results','count','clear-filters','active-chamber'].map(id=>[id,node()]));
 ids.chamber.options=[{value:''}];ids.classification.options=['','Documented','Disputed','Unverified','Folklore & Legend'].map(value=>({value}));ids.review.options=['','checked','pending'].map(value=>({value}));
 const location={href:'https://orbis.example/catalog.html'+search,search};
 const history={replaceState(state,title,url){location.href=String(url);location.search=new URL(location.href).search}};
 const document={getElementById:id=>ids[id],createElement:()=>node()};
 const sandbox={document,location,history,URL,URLSearchParams,localStorage:{getItem(){return null},setItem(){}},fetch:async url=>({ok:true,json:async()=>url.includes('chambers')?[{number:1,name:'Orders',status:'populated'},{number:2,name:'Alchemy',status:'populated'}]:records})};
 vm.runInNewContext(script,sandbox);
 for(let i=0;i<3;i++)await new Promise(resolve=>setImmediate(resolve));
 return {ids,location,dispatch:(id,event)=>ids[id].handlers[event]()};
}
test('shared catalog URL restores search, evidence and review filters together',async()=>{
 const h=await harness('?chamber=Orders&q=Rosicrucian&classification=Documented&review=pending');
 assert.equal(h.ids.query.value,'Rosicrucian');
 assert.equal(h.ids.classification.value,'Documented');assert.equal(h.ids.review.value,'pending');
 assert.equal(h.ids.count.textContent,'1 of 3 research leads');
 assert.equal(h.ids['active-chamber'].textContent,'Viewing chamber: Orders');
});
test('changing filters writes a reloadable URL while retaining unrelated parameters',async()=>{
 const h=await harness('?campaign=friend');
 h.ids.query.value='Rosicrucian';h.dispatch('query','input');
 h.ids.chamber.value='Orders';h.dispatch('chamber','change');
 h.ids.classification.value='Documented';h.dispatch('classification','change');
 h.ids.review.value='pending';h.dispatch('review','change');
 const params=new URL(h.location.href).searchParams;
 assert.equal(params.get('q'),'Rosicrucian');assert.equal(params.get('chamber'),'Orders');
 assert.equal(params.get('classification'),'Documented');assert.equal(params.get('review'),'pending');assert.equal(params.get('campaign'),'friend');
 const reloaded=await harness(new URL(h.location.href).search);
 assert.equal(reloaded.ids.count.textContent,'1 of 3 research leads');
});
test('clear removes every catalog filter from the URL and restores all results',async()=>{
 const h=await harness('?campaign=friend&chamber=Orders&q=Rosicrucian&classification=Documented&review=pending');
 h.dispatch('clear-filters','click');
 assert.equal(h.location.search,'?campaign=friend');assert.equal(h.ids.count.textContent,'3 of 3 research leads');
 assert.equal(h.ids.query.focused,true);assert.equal(h.ids['clear-filters'].disabled,true);
});
test('unknown selection values do not turn a shared URL into an empty catalog',async()=>{
 const h=await harness('?chamber=Missing&classification=Unknown&review=Unknown');
 assert.equal(h.ids.chamber.value,'');assert.equal(h.ids.classification.value,'');assert.equal(h.ids.review.value,'');
 assert.equal(h.ids.count.textContent,'3 of 3 research leads');
});
