const {test}=require('node:test');
const assert=require('node:assert/strict');
const records=require('../data/archive-resources.json');
const {buildArchiveReviewReport}=require('../tools/archive-review-report.cjs');
test('actual dataset produces a rights-safe audit report',()=>{
 const report=buildArchiveReviewReport(records);
 assert.equal(report.total,records.length);
 assert.equal(report.linkOnly,records.length);
 assert.equal(report.redistributionApproved,0);
 assert.equal(report.sourceVerificationNeeded,records.filter(x=>x.classification!=='Documented').length);
 assert.equal(report.metadataIssues,0);
});
