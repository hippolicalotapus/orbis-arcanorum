'use strict';
// Offline editorial gate only. Never grants a licence, seller approval or deployment permission.
const SAFE_RIGHTS_NOTE = /(?:link (?:and metadata )?only|reproduction rights require separate review)/i;
const CLASSIFICATIONS = new Set([
  'Documented', 'Documented historical site', 'Disputed',
  'Folklore & Legend', 'Research lead', 'Unverified'
]);
function isSafeLink(url) {
  if (typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && !!parsed.hostname &&
      !parsed.username && !parsed.password && !/\s/.test(url) &&
      !/^(?:localhost|127\.|10\.|192\.168\.|169\.254\.|172\.(?:1[6-9]|2[0-9]|3[01])\.|\[::1\])/.test(parsed.hostname) && !parsed.hostname.endsWith('.local');
  } catch { return false; }
}
function nonEmpty(value) { return typeof value === 'string' && value.trim().length > 0; }
function auditCatalog(records, chambers) {
  const errors = [], warnings = [];
  if (!Array.isArray(records) || !Array.isArray(chambers)) {
    return { ok: false, errors: ['Catalog and chamber manifest must both be arrays'], warnings };
  }
  const chamberNames = new Set(), chamberNumbers = new Set();
  if (chambers.length !== 14) errors.push('Expected exactly fourteen catalog chambers');
  for (const c of chambers) {
    if (!c || !nonEmpty(c.name) || !Number.isInteger(c.number) || c.number < 1 || c.number > 14 ||
        chamberNames.has(c.name) || chamberNumbers.has(c.number)) {
      errors.push('Invalid or duplicate chamber in manifest');
      continue;
    }
    chamberNames.add(c.name); chamberNumbers.add(c.number);
  }
  const seenIds = new Set(), byUrl = new Map();
  let missingLanguage = 0, sourceChecksClaimed = 0;
  for (const [index, record] of records.entries()) {
    const label = `Record ${index + 1}${record && nonEmpty(record.id) ? ` (${record.id})` : ''}`;
    if (!record || typeof record !== 'object' || Array.isArray(record)) {
      errors.push(`${label}: invalid record`); continue;
    }
    if (!nonEmpty(record.id) || seenIds.has(record.id)) errors.push(`${label}: missing or duplicate ID`);
    else seenIds.add(record.id);
    for (const field of ['title','summary','source_status','rights'])
      if (!nonEmpty(record[field])) errors.push(`${label}: missing ${field}`);
    if (!chamberNames.has(record.chamber)) errors.push(`${label}: unknown chamber`);
    if (!CLASSIFICATIONS.has(record.classification)) errors.push(`${label}: invalid classification`);
    if (!isSafeLink(record.source_url)) errors.push(`${label}: unsafe or missing HTTPS source URL`);
    else byUrl.set(record.source_url, (byUrl.get(record.source_url) || []).concat(record.id));
    // Every candidate remains link-only even if an institution's metadata is CC0.
    if (!SAFE_RIGHTS_NOTE.test(record.rights || '') ||
        /(?:permission granted|free to reproduce|commercial reuse permitted|cleared for sale|redistribution approved)/i.test(record.rights || ''))
      errors.push(`${label}: no reliable rights restriction or conflicting permission claim`);
    if (record.reproduction_approved === true || record.sale_approved === true ||
        record.media_embed_approved === true) errors.push(`${label}: unreviewed approval flag in discovery catalog`);
    if (!nonEmpty(record.original_language)) missingLanguage++;
    if (/(?:opened|checked|accessed|reviewed)/i.test(record.source_status || '')) sourceChecksClaimed++;
  }
  const repeatedGateways = [...byUrl.entries()].filter(([,ids]) => ids.length > 1)
    .map(([url,ids]) => ({url, ids}));
  if (repeatedGateways.length) warnings.push(`${repeatedGateways.length} source URLs used by multiple candidate records; often discovery gateways, not duplicate objects`);
  if (missingLanguage) warnings.push(`${missingLanguage} entries do not record an original language; not all items are written texts`);
  return Object.freeze({
    ok: errors.length === 0, errors, warnings,
    counts: Object.freeze({records: records.length, chambers: chamberNames.size,
      linkOnlyRecords: records.length, reproductionApprovals: 0,
      previouslyClaimedSourceChecks: sourceChecksClaimed,
      missingOriginalLanguage: missingLanguage, repeatedGatewayUrls: repeatedGateways.length}),
    repeatedGateways
  });
}
function reviewPartnerSubmission(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw TypeError('Invalid partner submission');
  const gaps = [];
  if (!nonEmpty(input.participantType) || !['collector','merchant','institution','researcher'].includes(input.participantType)) gaps.push('participant type');
  if (!nonEmpty(input.consentReference) || !nonEmpty(input.consentScope) ||
      !/directory display/i.test(input.consentScope || '')) gaps.push('written directory-display consent and scope');
  if (!nonEmpty(input.provenanceReference)) gaps.push('provenance or ownership evidence');
  if (!nonEmpty(input.moderatorReviewReference)) gaps.push('independent moderator review');
  if (input.assets !== undefined && !Array.isArray(input.assets)) gaps.push('valid asset manifest');
  const assets = Array.isArray(input.assets) ? input.assets : [];
  for (const [i,asset] of assets.entries()) {
    if (!asset || !nonEmpty(asset.rightsEvidenceReference) ||
        !nonEmpty(asset.permissionScope) || !/display/i.test(asset.permissionScope))
      gaps.push(`asset ${i + 1} display permission`);
    // A display permission is NOT a commercial reproduction permission.
    if (asset && asset.commercialReproductionRequested === true &&
        (!nonEmpty(asset.commercialRightsReference) ||
         !/commercial reproduction/i.test(asset.permissionScope || '')))
      gaps.push(`asset ${i + 1} commercial reproduction licence`);
  }
  if (input.saleRequested === true && !nonEmpty(input.sellerAuthorityReference))
    gaps.push('independent seller authority');
  // Even complete references require a separate, authenticated human release decision.
  return Object.freeze({readyForHumanReview: gaps.length === 0, missing: Object.freeze(gaps),
    mayPublish: false, maySell: false, mayReproduce: false});
}
function auditNavigation(pages, taxonomy) {
  const errors = [];
  const required = ['homepage','catalogPage','recordPage','fifteenthPage','portalPage'];
  if (!pages || required.some(name => typeof pages[name] !== 'string'))
    return {ok:false, errors:['Missing HTML for navigation audit']};
  const routes = [
    ['homepage to original fourteen-room prototype', pages.homepage, './prototypes/fourteen-seals/index.html'],
    ['homepage to catalog', pages.homepage, './catalog.html'],
    ['homepage to fifteenth room', pages.homepage, './fifteenth-room.html'],
    ['catalog to record', pages.catalogPage, './record.html?id='],
    ['record to chamber-filtered catalog', pages.recordPage, './catalog.html?chamber='],
    ['fifteenth room to original observatory', pages.fifteenthPage, 'index.html?room=15']
  ];
  for (const [label, html, target] of routes)
    if (!html.includes(target)) errors.push('Missing navigation route: '+label);
  for (const id of ['id="observatory"','id="boardPins"'])
    if (!pages.portalPage.includes(id)) errors.push('Original Observatory navigation missing '+id);
  const match = pages.portalPage.match(/const data=(\[\[.*?\]\]);\s*const descriptions=/s);
  let names = [];
  if (!match) errors.push('Fourteen-room array not found');
  else {
    try {
      const decoded=JSON.parse(match[1]);
      names=decoded.map(row=>row[0]);
      if (names.length!==14 || new Set(names).size!==14) errors.push('Expected fourteen unique cinematic destinations');
    } catch { errors.push('Malformed cinematic destination list'); }
  }
  if (!taxonomy || !taxonomy.mapping || !Array.isArray(taxonomy.requires_human_review))
    errors.push('Missing taxonomy editorial mapping');
  else {
    for (const [section, destination] of Object.entries(taxonomy.mapping)) {
      if (!names.includes(destination)) errors.push('Unknown cinematic destination for '+section);
    }
    for (const section of taxonomy.requires_human_review)
      if (Object.hasOwn(taxonomy.mapping,section)) errors.push('Culturally sensitive section mapped without review: '+section);
  }
  return Object.freeze({ok:errors.length===0,errors,cinematicDestinations:names.length});
}
module.exports = {auditCatalog, auditNavigation, reviewPartnerSubmission, isSafeLink};
if (require.main === module) {
  const fs = require('node:fs'), path = require('node:path');
  const root = path.resolve(__dirname, '..');
  const result = auditCatalog(
    JSON.parse(fs.readFileSync(path.join(root,'data/archive-catalog.json'),'utf8')),
    JSON.parse(fs.readFileSync(path.join(root,'data/archive-chambers.json'),'utf8'))
  );
  const read = p => fs.readFileSync(path.join(root,p),'utf8');
  const navigation = auditNavigation({homepage:read('index.html'),catalogPage:read('catalog.html'),
    recordPage:read('record.html'),fifteenthPage:read('fifteenth-room.html'),
    portalPage:read('prototypes/fourteen-seals/index.html')},
    JSON.parse(read('prototypes/fourteen-seals/archive-section-mapping.json')));
  console.log(JSON.stringify({ok:result.ok && navigation.ok, counts:result.counts,
    catalogErrors:result.errors, navigationErrors:navigation.errors, warnings:result.warnings}, null, 2));
  if (!result.ok || !navigation.ok) process.exitCode = 1;
}
