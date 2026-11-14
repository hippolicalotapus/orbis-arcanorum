'use strict';
(function(root){
 const listings=Object.freeze([{name:'Fictional Archive Bookseller',country:'Canada',specialty:'Historical books',website:'https://example.org/books'},{name:'Fictional Artifact Collector',country:'United Kingdom',specialty:'Collector displays',website:'https://example.org/collectors'}]);
 function safeVendor(v){const u=new URL(v.website);if(u.protocol!=='https:'||u.username||u.password||!u.hostname)throw Error('Unsafe vendor link');return {...v,website:u.href,fictional:true,linkOnly:true}}
 function filter(q){const term=String(q||'').toLowerCase().trim();return listings.filter(v=>[v.name,v.country,v.specialty].some(s=>s.toLowerCase().includes(term)))}
 function render(doc,q){const target=doc.getElementById('vendor-results');if(!target)return;target.replaceChildren();for(const v of filter(q)){const item=safeVendor(v),card=doc.createElement('article'),title=doc.createElement('h2'),p=doc.createElement('p'),link=doc.createElement('a');title.textContent=item.name;p.textContent=item.country+' · '+item.specialty+' · Fictional listing, external link only';link.textContent='Visit demonstration website';link.href=item.website;link.rel='noopener noreferrer';link.target='_blank';card.append(title,p,link);target.append(card)}if(!target.children.length)target.textContent='No matching fictional listings.'}
 function setup(doc){const search=doc.getElementById('vendor-search');if(!search)return;search.addEventListener('input',()=>render(doc,search.value));render(doc,search.value)}
 if(root&&root.document){if(root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',()=>setup(root.document));else setup(root.document)}
 if(typeof module!=='undefined'&&module.exports)module.exports={safeVendor,filter,render,setup};
})(typeof window!=='undefined'?window:null);
