# Orbis Arcanorum — Sponsor and Vendor Launch Controls
Updated: 2026-11-09
Status: internal working draft; NOT a live sales contract or payment checkout.

## Four parallel workstreams
1. **Functional website:** Validate sign-up, email verification, applicant-only reads, admin approvals, approved-directory sync, unauthorized denial, responsive mobile and accessibility. Do not merge until end-to-end evidence is recorded.
2. **Archive expansion:** Add original-language title and romanization, language/script, historical era, source institution, provenance, translation status, rights and confidence separately. Record unverified claims as claims. Verify each source page before publishing.
3. **Recruitment:** Approach only independently verified public business contacts. Record duplicates and opt-outs. No unsolicited bulk messages, invented partnerships or scraping private groups.
4. **Revenue:** Start with inquiry-based, clearly labeled founding sponsorships. Do not accept money until deliverables, duration, invoicing, cancellation/refund terms and payment provider are confirmed.

## Sponsorship preflight (all required before accepting payment)
- [ ] Placement page and exact ad label exist in production
- [ ] Creative asset rights and sponsor identity verified
- [ ] Written deliverables: placement location, start/end dates, approval procedure
- [ ] Fees, taxes where applicable, invoicing, payment method and refund/cancellation policy reviewed
- [ ] Sponsor explicitly acknowledges no guaranteed traffic, clicks, leads or sales
- [ ] Sponsor has no influence on archival evidence ratings or editorial coverage
- [ ] Payment provider permits the specific business category
- [ ] Contact email and privacy notice tested

## Private prospect tracking fields (no personal contacts in public GitHub)
Organization | Public website | Category | Public contact channel | Evidence of legitimacy | Contact history checked | First contacted | Response | Next action | Opt-out | Proposed offer | Agreement | Payment status

## QA evidence template
Test ID | Environment and commit | User role | Preconditions | Steps | Expected | Observed | Pass/fail | Timestamp | Cleanup completed

## Current limitations
- 95 catalog records are research records, not 95 individually validated historical objects.
- Vendor signup and admin approval have not been verified with real browser sessions.
- No approved paid sponsor, checkout or verified revenue.
- Supabase leaked-password screening remains disabled under the owner's no-paid-upgrade decision; compensate with available safeguards and document residual risk.
- Netlify production and preview remain private. Avoid extra builds until the consolidated release candidate is ready.
