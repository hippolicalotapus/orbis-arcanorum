/* Physical fantasy opening effects. Templates contain only trusted, static markup. */
window.PortalOpenings={
 specs:[
  ['insignia','Turn the bronze insignia'],
  ['scroll','Break the seal and unroll the parchment'],
  ['reaction','Activate the alchemical vessel'],
  ['tablets','Slide the temple tablets into alignment'],
  ['storybook','Open the enchanted storybook'],
  ['sand','Brush away the burial sand'],
  ['chains','Unlock the chained volume'],
  ['constellations','Align the constellations'],
  ['tracks','Follow the hidden tracks'],
  ['lantern','Raise the lantern and reveal the room'],
  ['reliquary','Lift the relic case lid'],
  ['hourglass','Turn the hourglass'],
  ['astrolabe','Rotate the astrolabe rings'],
  ['vault','Unlock and open the evidence vault']
 ],
 markup:[
  '<div class="fx-medallion fx-photo"></div>',
  '<div class="fx-folio"><div class="fx-folio-leaf"></div><div class="fx-folio-dust"></div></div>',
  '<div class="fx-lab-vapour"><div class="fx-steam s1"></div><div class="fx-steam s2"></div><div class="fx-steam s3"></div></div><div class="fx-furnace-glow"></div>',
  '<div class="fx-slab left fx-photo"></div><div class="fx-slab right fx-photo"></div>',
  '<div class="fx-book"><div class="fx-pages"></div><div class="fx-cover fx-photo"></div></div>',
  '<div class="fx-excavation-dust"><div class="fx-dust-bank"></div><div class="fx-dust-bank second"></div></div><div class="fx-expedition-light"></div>',
  '<div class="fx-book chained"><div class="fx-cover fx-photo"></div></div><div class="fx-chain">'+Array.from({length:8},()=>'<div class="fx-link"></div>').join('')+'</div><div class="fx-lock"></div>',
  '<div class="fx-starfield">'+Array.from({length:7},(_,i)=>'<div class="fx-star s'+i+'"></div>').join('')+'<div class="fx-orbit orbit-one"></div><div class="fx-orbit orbit-two"></div></div>',
  '<div class="fx-trail">'+Array.from({length:5},(_,i)=>'<div class="fx-track t'+i+'"></div>').join('')+'</div>',
  '<div class="fx-lantern"><div class="fx-lantern-glass"></div></div><div class="fx-lantern-beam"></div>',
  '<div class="fx-case"><div class="fx-case-base"></div><div class="fx-case-lid"></div><div class="fx-case-light"></div></div>',
  '<div class="fx-hourglass"><div class="fx-hourglass-glass"></div><div class="fx-sand-upper"></div><div class="fx-sand-lower"></div><div class="fx-sand-stream"></div></div>',
  '<div class="fx-astrolabe fx-photo"><div class="fx-ring r1"></div><div class="fx-ring r2"></div><div class="fx-ring r3"></div></div>',
  '<div class="fx-vault fx-photo"><div class="fx-vault-wheel"></div></div>'
 ],
 mount(host,index,asset){
  host.querySelector('.opening-fx')?.remove();
  host.dataset.opening=this.specs[index][0];
  host.style.setProperty('--opening-texture','url("'+asset+'")');
  const effect=document.createElement('div');effect.className='opening-fx';effect.setAttribute('aria-hidden','true');
  effect.innerHTML=this.markup[index];host.append(effect);
 }
};
