'use strict';
const {prepareArchiveReview}=require('./archive-rights-review.cjs');
function summarizeArchiveReviews(records){
 if(!Array.isArray(records))throw Error('Expected archive records');
 const reviews=records.map(prepareArchiveReview);
 return Object.freeze({total:reviews.length,sourceVerificationNeeded:reviews.filter(x=>x.requiresSourceVerification).length,metadataIssues:reviews.reduce((n,x)=>n+x.issues.length,0),redistributionApproved:0,linkOnly:reviews.length,needsAttention:Object.freeze(reviews.filter(x=>x.requiresSourceVerification||x.issues.length).map(x=>Object.freeze({title:x.title,issues:x.issues,requiresSourceVerification:x.requiresSourceVerification})))});
}
module.exports={summarizeArchiveReviews};
