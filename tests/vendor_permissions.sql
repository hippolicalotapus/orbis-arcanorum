-- Run with a read-only SQL session against Orbis Arcanorum.
-- Validates privilege-layer safeguards; role-separated RLS integration tests are still required.
select 'application status update permitted' as test, has_column_privilege('authenticated','public.vendor_applications','status','UPDATE') as passed
union all select 'review timestamp update permitted',has_column_privilege('authenticated','public.vendor_applications','reviewed_at','UPDATE')
union all select 'application owner immutable',not has_column_privilege('authenticated','public.vendor_applications','applicant_id','UPDATE')
union all select 'listing status update permitted',has_column_privilege('authenticated','public.vendor_listings','status','UPDATE')
union all select 'listing owner immutable',not has_column_privilege('authenticated','public.vendor_listings','vendor_id','UPDATE')
union all select 'no direct vendor profile creation',not has_table_privilege('authenticated','public.vendor_profiles','INSERT');
