// Offline-only converter for authorized private editorial exports.
// Usage: node convert-archive-export.mjs input.json archive-section-mapping.json output.json
// Never fetches Supabase, publishes records, or modifies the input.
import {readFileSync,writeFileSync} from 'node:fs';
const [inputPath,mapPath,outputPath]=process.argv.slice(2);
if(!inputPath||!mapPath||!outputPath){console.error('Usage: node convert-archive-export.mjs input.json archive-section-mapping.json output.json');process.exit(2)}
const raw=JSON.parse(readFileSync(inputPath,'utf8'));
const records=Array.isArray(raw)?raw:raw.records;
const taxonomy=JSON.parse(readFileSync(mapPath,'utf8'));
if(!Array.isArray(records)||records.length>10000)throw Error('Expected an array of at most 10,000 records');
const mapped=[],review=[];
for(const [index,r] of records.entries()){
 if(!r||typeof r.title!=='string'||typeof r.archive_section!=='string')throw Error('Invalid record '+(index+1));
 const chamber=taxonomy.mapping[r.archive_section];
 if(!chamber){review.push({index:index+1,title:r.title,archive_section:r.archive_section,reason:'Unmapped: requires editorial review'});continue}
 const source=typeof r.source_url==='string'&&/^https?:\/\//i.test(r.source_url)?[{url:r.source_url,label:typeof r.source_name==='string'?r.source_name:'Original source'}]:[];
 mapped.push({title:r.english_title||r.title,chamber,summary:r.english_description||r.description||'',sources:source});
}
writeFileSync(outputPath,JSON.stringify({records:mapped,review_required:review,summary:{input:records.length,mapped:mapped.length,review_required:review.length}},null,2)+'\n',{flag:'wx',mode:0o600});
console.log(JSON.stringify({input:records.length,mapped:mapped.length,review_required:review.length,output:outputPath}));
