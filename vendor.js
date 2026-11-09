// Orbis Arcanorum vendor registration. Only a public publishable key belongs here.
const status=document.querySelector('#status');
const account=document.querySelector('#account');
const signin=document.querySelector('#signin');
const application=document.querySelector('#application');
const say=(message)=>{status.textContent=message;};
let client;
const config=await fetch('./vendor-config.json',{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null);
if(!config || !/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(config.supabaseUrl||'') || !/^sb_publishable_/.test(config.publishableKey||'')){
  say('Registration is not yet connected. The site administrator must configure the public Supabase connection.');
  for(const button of document.querySelectorAll('button[type=submit]'))button.disabled=true;
}else if(config.registrationEnabled!==true){
  say('Vendor registration is temporarily closed while security and end-to-end tests are completed.');
  for(const button of document.querySelectorAll('button[type=submit]'))button.disabled=true;
}else{
  try{
    const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2.49.10');
    client=createClient(config.supabaseUrl,config.publishableKey);
    const refresh=async()=>{
      const {data:{user},error}=await client.auth.getUser();
      if(error && error.name!=='AuthSessionMissingError')say('Session check failed: '+error.message);
      application.hidden=!user;
      if(user){
        const {data,error:readError}=await client.from('vendor_applications').select('status').eq('applicant_id',user.id).maybeSingle();
        if(readError){say('Could not load application: '+readError.message);return;}
        if(data){application.hidden=true;say('Signed in. Your vendor application status is: '+data.status+'.');}
        else say('Signed in. Complete your vendor application below.');
      }
    };
    account.addEventListener('submit',async event=>{
      event.preventDefault();
      const fields=new FormData(account);
      const {error}=await client.auth.signUp({email:String(fields.get('email')),password:String(fields.get('password')),options:{emailRedirectTo:new URL('./vendor.html',location.href).href}});
      say(error?'Registration failed: '+error.message:'Account request received. Confirm your email if required, then sign in.');
      if(!error)await refresh();
    });
    signin.addEventListener('submit',async event=>{
      event.preventDefault();const fields=new FormData(signin);
      const {error}=await client.auth.signInWithPassword({email:String(fields.get('email')),password:String(fields.get('password'))});
      if(error)say('Sign-in failed: '+error.message);else await refresh();
    });
    document.querySelector('#signout').addEventListener('click',async()=>{await client.auth.signOut();application.hidden=true;say('Signed out.');});
    application.addEventListener('submit',async event=>{
      event.preventDefault();
      const {data:{user},error:userError}=await client.auth.getUser();
      if(userError||!user){say('Sign in before submitting.');return;}
      const f=new FormData(application);
      const record={applicant_id:user.id,display_name:String(f.get('display_name')).trim(),country:String(f.get('country')).trim(),specialty:String(f.get('specialty')).trim(),description:String(f.get('description')).trim(),website_url:String(f.get('website_url')||'').trim()||null,status:'pending'};
      const {error}=await client.from('vendor_applications').insert(record);
      if(error)say('Application not submitted: '+error.message);
      else{application.reset();await refresh();}
    });
    await refresh();
  }catch(error){say('Unable to load registration service: '+error.message);}
}
