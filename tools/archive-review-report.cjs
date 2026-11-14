'use strict';
const fs=require('node:fs');
const path=require('node:path');
const {summarizeArchiveReviews}=require('./archive-review-summary.cjs');
function buildArchiveReviewReport(records){
 const summary=summarizeArchiveReviews(records);
 return Object.freeze({total:summary.total,linkOnly:summary.linkOnly,redistributionApproved:summary.redistributionApproved,sourceVerificationNeeded:summary.sourceVerificationNeeded,metadataIssues:summary.metadataIssues,needsAttention:summary.needsAttention});
}
if(require.main===module){
 const file=path.resolve(__dirname,'../data/archive-resources.json');
 try{
  const records=JSON.parse(fs.readFileSync(file,'utf8'));
  process.stdout.write(JSON.stringify(buildArchiveReviewReport(records),null,2)+'\n');
  if(records.length===0)process.exitCode=1;
 }catch(error){console.error('Archive review failed:',error.message);process.exitCode=1;}
}
module.exports={buildArchiveReviewReport};
