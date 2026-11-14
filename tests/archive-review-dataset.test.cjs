const {test}=require('node:test');
const assert=require('node:assert/strict');
const records=require('../data/archive-resources.json');
const {summarizeArchiveReviews}=require('../tools/archive-review-summary.cjs');
test('current archive dataset remains link-only and flags unverified sources',()=>{
 const result=summarizeArchiveReviews(records);
 assert.equal(result.total,records.length);
 assert.equal(result.linkOnly,records.length);
 assert.equal(result.redistributionApproved,0);
 assert.equal(result.metadataIssues,0);
 assert.equal(result.sourceVerificationNeeded,records.filter(r=>r.classification!=='Documented').length);
 assert.deepEqual(result.needsAttention.map(r=>r.title),records.filter(r=>r.classification!=='Documented').map(r=>r.title));
});
