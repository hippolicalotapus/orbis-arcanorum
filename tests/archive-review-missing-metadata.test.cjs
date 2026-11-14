const {test}=require('node:test');
const assert=require('node:assert/strict');
const {summarizeArchiveReviews}=require('../tools/archive-review-summary.cjs');
test('missing rights and review date are counted without approving redistribution',()=>{
 const result=summarizeArchiveReviews([{title:'Unreviewed source',url:'https://example.org/item',classification:'Unverified',rights:' ',reviewed:''}]);
 assert.equal(result.total,1);
 assert.equal(result.metadataIssues,2);
 assert.equal(result.sourceVerificationNeeded,1);
 assert.equal(result.redistributionApproved,0);
 assert.equal(result.linkOnly,1);
 assert.deepEqual(result.needsAttention[0].issues,['missing rights note','missing review date']);
});
