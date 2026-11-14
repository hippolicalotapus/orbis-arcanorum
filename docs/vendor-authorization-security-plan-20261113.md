# Vendor authorization repair — read-only audit and acceptance plan

Status: **NOT APPLIED**. Based on read-only Supabase inspection, 2026-11-13. Do not deploy this document as SQL.

## Verified database shape
- vendor_applications: id, applicant_id, display_name, country, specialty, description, website_url, status, created_at, reviewed_at.
- vendor_profiles: id, owner_id, display_name, country, specialty, description, website_url, status, created_at, updated_at.
- vendor_listings: id, vendor_id, title, description, category, listing_type, status, created_at, updated_at.
- authenticated has SELECT and INSERT on applications, SELECT on profiles, and SELECT/INSERT/DELETE on listings at the table level. **Important correction (verified by information_schema.column_privileges): column-level UPDATE privileges already exist** for application status/reviewed_at and listing category/description/listing_type/status/title/updated_at. The absence of table-wide UPDATE is intentional or at least compatible with least privilege; do not assume updates are blocked solely because role_table_grants omits UPDATE.
- Existing UPDATE RLS policies distinguish admin reviews and vendor-owned draft edits. Admin recognition uses app_metadata.orbis_admin, not user-editable metadata.

## Security decision required before implementation
Avoid a blanket table-level UPDATE grant. It would expose every mutable column to every authenticated user at the SQL privilege layer, leaving RLS as the only barrier to edits of ownership and status. Prefer a trusted server-side approval transaction for application status, vendor provisioning, and listing publication. Keep privileged credentials off public clients. Establish idempotency, auditing, and an explicit admin identity check.

For vendor draft editing, design a narrow column-level UPDATE grant for title, description, category, listing_type, and updated_at only, with existing owner/status RLS plus independent negative tests. Status transitions to pending_review need a separately reviewed mechanism; a general status grant would permit attempts at inappropriate transitions, even if RLS is expected to block them. Do not grant owner_id, vendor_id, applicant_id, or other identity columns to clients.

## Required role-separated test matrix
1. Anonymous: can view only approved vendor profiles and published listings; cannot submit, edit, approve or see drafts.
2. Applicant A: can create a pending application with their own ID and view it; cannot read applicant B or self-approve.
3. Applicant B: cannot read or modify applicant A's application.
4. Approved vendor: can create a draft, edit own allowed fields, submit for review through a constrained transition, cannot edit another vendor's listing or publish directly.
5. Suspended vendor: cannot create or modify listings.
6. Administrator: can review applications and pending listings through a trusted, audited path; provisioning creates one correctly owned profile; repeated approval does not duplicate it.
7. Every role: cannot change ownership fields, bypass status transitions, or view unapproved archive material.

## Verification gate
Use disposable users and rollback/cleanup. Inspect RLS, grants, policy behavior, audit trail and Supabase security advisors. Enable leaked-password protection before signup. Only after the matrix passes should a separate approved change introduce narrowly scoped database privileges. No live changes were made by this audit.
