# Orbis Arcanorum — unpublished archive and rights review (2026-11-14)

**Status:** Internal editorial working paper. Not an approval to publish, deploy, market, reproduce or sell anything.

## Verified repository inventory
- The development catalog contains 360 unique record IDs across 14 distinct research chambers.
- Evidence labels after normalization: 121 Documented, 230 Research lead, 5 Unverified, 2 Disputed and 2 Folklore & Legend.
- The catalog's Research lead filter is enabled. Three historical-site entries (oa-222 through oa-224) use the existing Documented label so all entries remain searchable with established evidence filters.
- Source citations remain research leads except where item-level checking is explicitly recorded. An HTTPS URL is not proof of source quality or permission.
- The original 14 cinematic destinations and the fifteenth-room route are retained. The cinematic labels differ from the catalog taxonomy; the existing provisional mapping is **not** authority to recategorize or expose a record.

## Rights and provenance release checklist
1. **Research lead:** Keep institutional search-page links and original summaries; do not copy source images, scans, translations, audio or paid materials into the site by default.
2. **Collector:** Obtain written informed directory/exhibition consent, asset-specific display permission, ownership/provenance evidence, requested attribution, and appropriate community authorization for sensitive material.
3. **Supplier/merchant:** Verify business identity and seller authority independently. Do not show a supplier as endorsed, approved or live until human moderation records consent and profile review.
4. **Reproductions and paid listings:** Require a separate item-specific written commercial reproduction licence (including print, digital redistribution, transformations, edition limits, territories, expiry, and sublicensing terms as applicable). Display permission alone is insufficient. Validate authenticity, cultural restrictions, ownership and seller authority separately.
5. **Privacy:** Keep collectors' addresses, storage sites, private ownership documents and unpublished contact details out of public datasets.
6. **Publication gate:** A passing offline structural test is **not** a human approval for publication or sales. No deploy, publish, payments, or paid queries from this review.

## Navigation and integration caveat
The historical research catalog and cinematic prototype each have fourteen named destinations but their names are not identical. The prototype's section mapping is for **navigation preview only**, with culturally sensitive or ambiguous traditions held for human review. Do not silently merge the two taxonomies. Preserve all fourteen cinematic entrances and the existing hidden fifteenth-room experience while preparing an explicitly approved mapping.

## Testing
The offline `tools/archive-release-review.cjs` gate and its Node test file check IDs, classifications, source-link policy, partner permissions and the 14+1 navigation skeleton. Local fixture checks were executed separately, because this environment could not clone the full GitHub repository (network DNS unavailable). Repository-wide test execution should be performed locally by a machine with the full checkout using `node --test tests/archive-release-review.test.cjs` and `node tools/archive-release-review.cjs`. Do not trigger GitHub Actions to run them.

## Outstanding editorial work
- Add item-level source permalinks, accessed dates, creators, language, edition, jurisdiction and provenance only when independently confirmed.
- Review 230 research leads before promoting any to a stronger evidence class.
- Verify explicit rights from each institution/artist/collector; do not infer reuse from age, search-page appearance or metadata licensing.
- Resolve the catalog-to-cinematic chamber mapping with separate treatment for culturally sensitive traditions.
