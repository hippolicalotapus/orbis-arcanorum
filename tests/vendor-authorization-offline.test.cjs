// Offline authorization model only. NOT a live Supabase RLS test.
const test=require('node:test');const assert=require('node:assert/strict');
const owner='vendor-a';
const mayReadApplication=(r,app)=>r.admin||r.id===app.applicant;
const mayApprove=(r)=>r.admin===true;
const mayEditListing=(r,l)=>r.vendorApproved===true&&r.id===l.owner&&['draft','rejected'].includes(l.status);
const mayReadListing=(r,l)=>l.status==='published'||r.admin===true||(r.id===l.owner&&r.vendorApproved===true);
test('applicant A cannot read applicant B',()=>assert.equal(mayReadApplication({id:'a',admin:false},{applicant:'b'}),false));
test('applicant cannot self approve',()=>assert.equal(mayApprove({id:'a',admin:false}),false));
test('admin can review',()=>assert.equal(mayApprove({id:'admin',admin:true}),true));
test('approved vendor can edit own draft',()=>assert.equal(mayEditListing({id:owner,vendorApproved:true},{owner,status:'draft'}),true));
test('vendor cannot edit another draft',()=>assert.equal(mayEditListing({id:'vendor-b',vendorApproved:true},{owner,status:'draft'}),false));
test('suspended vendor cannot edit',()=>assert.equal(mayEditListing({id:owner,vendorApproved:false},{owner,status:'draft'}),false));
test('public cannot see draft',()=>assert.equal(mayReadListing({id:null,admin:false},{owner,status:'draft'}),false));
test('public can see published',()=>assert.equal(mayReadListing({id:null,admin:false},{owner,status:'published'}),true));
