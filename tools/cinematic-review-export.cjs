'use strict';
// Local editorial export only: no network, publication, sales or media reproduction.
function prepareReviewExport(records, bridge, isSafeLink) {
  if (!Array.isArray(records) || !Array.isArray(bridge) || typeof isSafeLink !== 'function')
    throw new TypeError('Records, chamber bridge, and link validator are required');
  const known=new Map();
  for (const room of bridge) if(room.status==='exact-name-match' && room.catalogChamber===room.cinematicName) {
    if(known.has(room.catalogChamber)) throw Error('Duplicate exact mapping');
    known.set(room.catalogChamber,room.cinematicName);
  }
  const result={version:1,preview_only:true,license_granted:false,records:[],review_required:[]};
  const ids=new Set();
  for(const [i,record] of records.entries()) {
    if(!record || typeof record.id!=='string' || !record.id || ids.has(record.id))
      throw Error('Invalid or duplicate record ID at '+(i+1));
    ids.add(record.id);
    if(typeof record.title!=='string'||!record.title.trim()||typeof record.chamber!=='string'||
       typeof record.summary!=='string'||typeof record.rights!=='string'||
       !/(?:link (?:and metadata )?only|reproduction rights require separate review)/i.test(record.rights)||
       record.sale_approved===true||record.reproduction_approved===true||record.media_embed_approved===true)
      throw Error('Unsafe metadata or rights at '+record.id);
    const destination=known.get(record.chamber);
    if(!destination) {result.review_required.push({id:record.id,chamber:record.chamber,reason:'Unresolved cinematic classification'});continue;}
    if(!isSafeLink(record.source_url))
      throw Error('Unsafe source URL at '+record.id);
    result.records.push({title:record.title,summary:record.summary,chamber:destination,
      sources:[{url:record.source_url,label:'External research source (link only)'}]});
  }
  return result;
}
module.exports={prepareReviewExport};
if(require.main===module){
 const fs=require('node:fs'),path=require('node:path');
 const root=path.resolve(__dirname,'..');
 const records=JSON.parse(fs.readFileSync(path.join(root,'data/archive-catalog.json'),'utf8'));
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'data/archive-chambers.json'),'utf8'));
 const html=fs.readFileSync(path.join(root,'prototypes/fourteen-seals/index.html'),'utf8');
 const match=html.match(/const data=(\[\[.*?\]\]);\s*const descriptions=/s);
 if(!match)throw Error('Original cinematic manifest not found');
 const {buildBridge}=require('./chamber-bridge.cjs');
 const {isSafeLink,auditCatalog}=require('./archive-release-review.cjs');
 const audit=auditCatalog(records,manifest);
 if(!audit.ok)throw Error('Catalog audit failed: '+audit.errors.join('; '));
 const bridge=buildBridge(manifest,JSON.parse(match[1]).map(row=>row[0]));
 process.stdout.write(JSON.stringify(prepareReviewExport(records,bridge,isSafeLink),null,2)+'\n');
}
