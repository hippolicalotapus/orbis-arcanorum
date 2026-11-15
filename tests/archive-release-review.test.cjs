'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {auditCatalog,auditNavigation,reviewPartnerSubmission,isSafeLink}=require('../tools/archive-release-review.cjs');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const records=JSON.parse(read('data/archive-catalog.json'));
const chambers=JSON.parse(read('data/archive-chambers.json'));
test('all archive records satisfy metadata, chamber and rights gates',()=>{
  const result=auditCatalog(records,chambers);
  assert.deepEqual(result.errors,[]);
  assert.equal(result.counts.records,360);
  assert.equal(result.counts.chambers,14);
  assert.equal(result.counts.reproductionApprovals,0);
});
test('original cinematic navigation and fifteenth room remain connected',()=>{
  const pages={homepage:read('index.html'),catalogPage:read('catalog.html'),
    recordPage:read('record.html'),fifteenthPage:read('fifteenth-room.html'),
    portalPage:read('prototypes/fourteen-seals/index.html')};
  const taxonomy=JSON.parse(read('prototypes/fourteen-seals/archive-section-mapping.json'));
  const x=auditNavigation(pages,taxonomy);
  assert.deepEqual(x.errors,[]);
  assert.equal(x.cinematicDestinations,14);
});
test('research-lead evidence filter remains available',()=>{
  assert.match(read('catalog.html'),/<option>Research lead<\/option>/);
  assert.ok(records.some(x=>x.classification==='Research lead'));
});
test('unsupported sales claims and duplicate IDs fail closed',()=>{
  assert.equal(auditCatalog([records[0],records[0]],chambers).ok,false);
  assert.equal(auditCatalog([{...records[0],sale_approved:true}],chambers).ok,false);
});
test('external URLs must be HTTPS and not private network addresses',()=>{
  assert.equal(isSafeLink('https://www.loc.gov/'),true);
  for(const url of ['http://example.org','javascript:alert(1)','https://localhost/item','https://u:p@example.org'])
    assert.equal(isSafeLink(url),false);
});
test('collector consent cannot authorize reproduction or publication on its own',()=>{
  const x=reviewPartnerSubmission({participantType:'collector',consentReference:'consent',
    consentScope:'directory display',provenanceReference:'provenance',moderatorReviewReference:'review',
    assets:[{rightsEvidenceReference:'display-license',permissionScope:'display'}]});
  assert.equal(x.readyForHumanReview,true);
  assert.equal(x.mayPublish,false);
  assert.equal(x.maySell,false);
  assert.equal(x.mayReproduce,false);
});
test('commercial reproduction requires separate rights evidence',()=>{
  const x=reviewPartnerSubmission({participantType:'merchant',consentReference:'consent',
    consentScope:'directory display',provenanceReference:'provenance',moderatorReviewReference:'review',
    assets:[{rightsEvidenceReference:'display-license',permissionScope:'display',commercialReproductionRequested:true}]});
  assert.equal(x.readyForHumanReview,false);
  assert.ok(x.missing.includes('asset 1 commercial reproduction licence'));
});
