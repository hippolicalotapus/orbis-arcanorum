// Client-side convenience only. Supabase RLS authorizes every decision.
const say=t=>document.querySelector('#status').textContent=t;
const desk=document.querySelector('#desk');
const config=await fetch('./vendor-config.json',{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null);
if(!config||config.registrationEnabled!==true||!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(config.supabaseUrl||'')||!/^sb_publishable_/.test(config.publishableKey||'')){
 say('Review desk is closed until launch security checks are complete.');
}else{
 try{
  const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2.49.10');
  const db=createClient(config.supabaseUrl,config.publishableKey);
  const {data:{user},error}=await db.auth.getUser();
  if(error||!user){say('Administrator sign-in is required.');}
  else if(user.app_metadata?.orbis_admin!==true){say('Administrator authorization required.');}
  else{
   desk.hidden=false;
   const render=async()=>{
    const [a,l]=await Promise.all([
     db.from('vendor_applications').select('id,display_name,country,specialty,description,website_url,status').eq('status','pending').order('created_at'),
     db.from('vendor_listings').select('id,title,description,category,listing_type,status').eq('status','pending_review').order('created_at')
    ]);
    if(a.error||l.error){say('Review queue unavailable: '+(a.error||l.error).message);return;}
    for(const [target,items,table] of [['applications',a.data,'vendor_applications'],['listings',l.data,'vendor_listings']]){
     const host=document.getElementById(target);host.replaceChildren();
     if(!items?.length){const p=document.createElement('p');p.textContent='No pending reviews.';host.append(p);}
     for(const item of items||[]){
      const card=document.createElement('article');
      const title=document.createElement('h3');title.textContent=item.display_name||item.title;card.append(title);
      const desc=document.createElement('p');desc.textContent=item.description;card.append(desc);
      const meta=document.createElement('p');meta.textContent=table==='vendor_applications'?[item.country,item.specialty,item.website_url||''].join(' · '):[item.category,item.listing_type].join(' · ');card.append(meta);
      for(const choice of ['approved','rejected']){
       if(table==='vendor_listings'&&choice==='approved')continue;
       const next=table==='vendor_listings'?'published':choice;
       const button=document.createElement('button');button.textContent=next==='published'?'Publish listing':next==='approved'?'Approve vendor':'Reject';
       button.addEventListener('click',async()=>{
        if(!confirm('Confirm '+button.textContent.toLowerCase()+' for '+(item.display_name||item.title)+'?'))return;
        card.querySelectorAll('button').forEach(b=>b.disabled=true);
        const change=table==='vendor_applications'?{status:next,reviewed_at:new Date().toISOString()}:{status:next};
        const {data,error}=await db.from(table).update(change).eq('id',item.id).eq('status',table==='vendor_applications'?'pending':'pending_review').select('id');
        if(error||!data?.length){say('Decision not saved: '+(error?.message||'No authorized row updated.'));card.querySelectorAll('button').forEach(b=>b.disabled=false);}
        else{say('Decision saved. Review queue refreshed.');await render();}
       });card.append(button);
      }
      host.append(card);
     }
    }
    say('Review queue loaded. All decisions require administrator authorization.');
   };
   await render();
  }
 }catch(error){say('Review desk unavailable: '+error.message);}
}
