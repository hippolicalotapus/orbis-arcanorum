// Pure local research filter; never fetches, downloads or publishes sources.
export function filterResearchLeads(items,{term='',chamber='',classification=''}={}){
 if(!Array.isArray(items))throw new TypeError('Research catalog must be an array');
 const query=String(term).trim().toLocaleLowerCase();
 return items.filter(item=>{
  if(!item||typeof item!=='object')return false;
  if(typeof item.title!=='string'||typeof item.summary!=='string'||typeof item.chamber!=='string'||typeof item.classification!=='string')return false;
  let source;
  try{source=new URL(item.source_url)}catch{return false}
  if(source.protocol!=='https:'||source.username||source.password)return false;
  return (!chamber||item.chamber===chamber)&&(!classification||item.classification===classification)&&[item.title,item.summary,item.chamber,item.classification].some(value=>value.toLocaleLowerCase().includes(query));
 });
}
