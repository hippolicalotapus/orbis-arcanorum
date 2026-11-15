'use strict';
// Conservative navigation resolution. Never modifies catalog records or grants access.
function buildBridge(catalogChambers, cinematicNames) {
  if (!Array.isArray(catalogChambers) || !Array.isArray(cinematicNames)) throw new TypeError('Two arrays required');
  const actual = catalogChambers.map(x => typeof x === 'string' ? x : x?.name);
  if (actual.length !== 14 || cinematicNames.length !== 14 ||
      actual.some(x => typeof x !== 'string' || !x.trim()) ||
      cinematicNames.some(x => typeof x !== 'string' || !x.trim()) ||
      new Set(actual).size !== 14 || new Set(cinematicNames).size !== 14)
    throw new Error('Expected two distinct 14-room manifests');
  return cinematicNames.map((name,index) => {
    const matching = actual.filter(x => x === name);
    return Object.freeze({cinematicNumber:index+1,cinematicName:name,
      catalogChamber:matching.length === 1 ? matching[0] : null,
      status:matching.length === 1 ? 'exact-name-match' : 'editorial-review-required'});
  });
}
function catalogHref(room) {
  if (!room || room.status !== 'exact-name-match' ||
      room.catalogChamber !== room.cinematicName) return './catalog.html';
  return './catalog.html?chamber=' + encodeURIComponent(room.catalogChamber);
}
function validateBridge(bridge,catalogChambers,cinematicNames) {
  const errors=[];
  try {
    const expected=buildBridge(catalogChambers,cinematicNames);
    if (!Array.isArray(bridge) || bridge.length !== expected.length) errors.push('Bridge size mismatch');
    else for(let i=0;i<expected.length;i++) {
      const e=expected[i], r=bridge[i];
      if (!r || r.cinematicNumber !== e.cinematicNumber || r.cinematicName !== e.cinematicName ||
          r.catalogChamber !== e.catalogChamber || r.status !== e.status)
        errors.push('Unverified bridge at cinematic chamber '+(i+1));
    }
  } catch(error) {errors.push(error.message)}
  return {ok:errors.length===0,errors};
}
module.exports={buildBridge,catalogHref,validateBridge};
