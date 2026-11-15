const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

// Only browser/network boundaries are substituted: filtering, normalization,
// rendering and event handlers execute directly from the shipped page script.
const script=fs.readFileSync('vendors.html','utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
class Element {
 constructor(tagName='div'){this.tagName=tagName;this.children=[];this.value='';this.textContent='';this.listeners={};}
 append(...children){this.children.push(...children);}
 replaceChildren(...children){this.children=[...children];}
 addEventListener(type,handler){this.listeners[type]=handler;}
 dispatch(type){this.listeners[type]();}
}
const approved=(overrides={})=>({display_name:'Moon Books',country:'Estonia',specialty:'Books',website_url:'https://shop.example/catalog',status:'approved',...overrides});
async function page(data,{ok=true,reject=false}={}){
 const nodes=Object.fromEntries(['search','country','specialty','results','count'].map(id=>[id,new Element()]));
 nodes.country.append(new Element('option'));nodes.specialty.append(new Element('option'));
 let request;
 const context=vm.createContext({URL,document:{getElementById:id=>nodes[id],createElement:tag=>new Element(tag)},fetch:async url=>{
  request=new URL(url);
  if(reject)throw new Error('offline');
  return {ok,status:ok?200:503,json:async()=>data};
 }});
 vm.runInContext(script,context,{filename:'vendors.html'});
 await new Promise(resolve=>setImmediate(resolve));
 return {nodes,request};
}
const cards=nodes=>nodes.results.children.filter(n=>n.tagName==='article');
const names=nodes=>cards(nodes).map(n=>n.children[0].textContent);
const links=nodes=>cards(nodes).flatMap(n=>n.children.filter(c=>c.tagName==='a'));

test('only explicitly approved records populate cards and filter options',async()=>{
 const {nodes,request}=await page([approved(),approved({display_name:'Pending shop',country:'Hidden country',specialty:'Hidden specialty',status:'pending'}),approved({display_name:'Rejected shop',status:'rejected'}),approved({display_name:'No status',status:undefined}),approved({display_name:'Truthy approval',status:true})]);
 assert.deepEqual(names(nodes),['Moon Books']);
 assert.deepEqual(nodes.country.children.map(n=>n.value),['','Estonia']);
 assert.deepEqual(nodes.specialty.children.map(n=>n.value),['','Books']);
 assert.match(nodes.count.textContent,/^1 /);
 assert.equal(request.searchParams.get('status'),'eq.approved');
 assert.ok(request.searchParams.get('select').split(',').includes('status'),'response must include status for client validation');
});

test('malformed rows are skipped while valid rows still render and remain searchable',async()=>{
 const {nodes}=await page([null,42,[],{},approved({display_name:null}),approved({country:3}),approved({specialty:{}}),approved({display_name:' '}),approved({country:''}),approved({specialty:' '}),approved({display_name:'x'.repeat(121)}),approved({country:'x'.repeat(101)}),approved({specialty:'x'.repeat(121)}),approved({display_name:'  Moon Books  ',country:' Estonia ',specialty:' Books '})]);
 assert.deepEqual(names(nodes),['Moon Books']);
 nodes.search.value='  BOOKS ';nodes.search.dispatch('input');
 assert.deepEqual(names(nodes),['Moon Books']);
 assert.match(nodes.count.textContent,/^1 /);
});

test('storefront anchors require a parsed absolute HTTPS URL without credentials',async()=>{
 const urls=['http://shop.example','javascript:alert(1)','//shop.example','https://','https://?q=shop','https://user:secret@shop.example','https://shop.example:bad','https://shop.example\n.evil.example',{},null,'HTTPS://shop.example/catalog'];
 const {nodes}=await page(urls.map((website_url,i)=>approved({display_name:'Shop '+i,website_url})));
 assert.equal(cards(nodes).length,urls.length,'unsafe optional links do not hide approved participants');
 assert.deepEqual(links(nodes).map(a=>a.href),['https://shop.example/catalog']);
 assert.equal(links(nodes)[0].target,'_blank');
 assert.equal(links(nodes)[0].rel,'noopener noreferrer nofollow');
});

test('search and country/specialty events combine filters and show the no-match state',async()=>{
 const {nodes}=await page([approved(),approved({display_name:'Alpine Objects',country:'Austria',specialty:'Relics',website_url:null}),approved({display_name:'<img src=x onerror=alert(1)>',specialty:'Relics',website_url:null})]);
 nodes.country.value='Estonia';nodes.country.dispatch('change');
 assert.deepEqual(names(nodes),['Moon Books','<img src=x onerror=alert(1)>']);
 nodes.specialty.value='Relics';nodes.specialty.dispatch('change');
 assert.deepEqual(names(nodes),['<img src=x onerror=alert(1)>']);
 assert.equal(cards(nodes)[0].children[0].children.length,0,'names render as text, never parsed HTML');
 nodes.search.value='no match';nodes.search.dispatch('input');
 assert.deepEqual(names(nodes),[]);assert.match(nodes.count.textContent,/^0 /);
 assert.equal(nodes.results.children[0].className,'empty');
 assert.match(nodes.results.children[0].textContent,/No participants match/);
 nodes.search.value='';nodes.country.value='';nodes.specialty.value='';nodes.search.dispatch('input');
 assert.equal(cards(nodes).length,3);
});

test('empty and all-unapproved responses show no live listings',async()=>{
 for(const data of [[],[approved({status:'pending'})],[null,{}]]){
  const {nodes}=await page(data);assert.deepEqual(names(nodes),[]);
  assert.match(nodes.count.textContent,/^0 /);assert.match(nodes.results.children[0].textContent,/No vendor listings are live yet/);
 }
});

test('non-array, HTTP and network failures show the unavailable state without cards',async()=>{
 for(const [data,options] of [[{},{}],[[],{ok:false}],[[],{reject:true}]]){
  const {nodes}=await page(data,options);assert.deepEqual(names(nodes),[]);
  assert.match(nodes.count.textContent,/Unable to load/);assert.match(nodes.results.children[0].textContent,/temporarily unavailable/);
 }
});
