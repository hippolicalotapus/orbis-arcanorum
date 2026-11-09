// Approved vendors only; RLS is the source of authorization.
const say=t=>document.querySelector('#status').textContent=t;
const studio=document.querySelector('#studio');
const config=await fetch('./vendor-config.json',{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null);
if(!config||config.registrationEnabled!==true||!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(config.supabaseUrl||'')||!/^sb_publishable_/.test(config.publishableKey||'')){
 say('Vendor studio is closed while security and end-to-end checks are completed.');
}else{
 try{
  const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2.49.10');
  const db=createClient(config.supabaseUrl,config.publishableKey);
  const {data:{user},error:authError}=await db.auth.getUser();
  if(authError||!user){say('Sign in through vendor registration before accessing the studio.');}
  else{
   const {data:profile,error:profileError}=await db.from('vendor_profiles').select('id,display_name,country,specialty,status').eq('owner_id',user.id).eq('status','approved').maybeSingle();
   if(profileError){say('Storefront lookup failed: '+profileError.message);}
   else if(!profile){say('No approved storefront is available for this account.');}
   else{
    studio.hidden=false;
    document.querySelector('#storefront').textContent=profile.display_name;
    document.querySelector('#profile').textContent=profile.specialty+' · '+profile.country;
    const list=document.querySelector('#listings');
    const load=async()=>{
     const {data,error}=await db.from('vendor_listings').select('id,title,status,listing_type').eq('vendor_id',profile.id).order('created_at',{ascending:false});
     list.replaceChildren();
     if(error){say('Could not load listings: '+error.message);return;}
     for(const item of data||[]){
      const li=document.createElement('li');li.textContent=item.title+' ('+item.listing_type+') — '+item.status+' ';
      if(item.status==='draft'||item.status==='rejected'){
       const button=document.createElement('button');button.type='button';button.textContent='Submit for review';
       button.addEventListener('click',async()=>{
        button.disabled=true;
        const {error}=await db.from('vendor_listings').update({status:'pending_review'}).eq('id',item.id).eq('vendor_id',profile.id);
        say(error?'Submission failed: '+error.message:'Listing submitted for moderation.');await load();
       });li.append(button);
      }
      list.append(li);
     }
     if(!data?.length){const li=document.createElement('li');li.textContent='No listings yet.';list.append(li);}
    };
    document.querySelector('#listing').addEventListener('submit',async event=>{
     event.preventDefault();const form=event.currentTarget;const f=new FormData(form);
     const record={vendor_id:profile.id,title:String(f.get('title')).trim(),description:String(f.get('description')).trim(),category:String(f.get('category')).trim(),listing_type:String(f.get('listing_type')),status:'draft'};
     const {error}=await db.from('vendor_listings').insert(record);
     if(error)say('Draft not saved: '+error.message);else{form.reset();say('Private draft saved.');await load();}
    });
    say('Approved storefront loaded. Listings require moderation before publication.');await load();
   }
  }
 }catch(error){say('Vendor studio unavailable: '+error.message);}
}
