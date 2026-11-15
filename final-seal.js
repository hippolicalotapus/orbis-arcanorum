/* A local visual journey only; the existing Fifteenth Room visit gate is separate. */
(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 for(const host of document.querySelectorAll('[data-final-seal]')){
  const open=host.querySelector('[data-final-open]'),skip=host.querySelector('[data-final-skip]'),enter=host.querySelector('[data-final-enter]'),status=host.querySelector('[data-final-status]');let timer=null;
  function ready(){const restoreFocus=document.activeElement===skip;clearTimeout(timer);timer=null;host.dataset.state='ready';open.disabled=false;open.textContent='Replay entrance';skip.hidden=true;enter.hidden=false;status.textContent='The final seal is open. The Keeper’s Observatory awaits.';if(restoreFocus)enter.focus();}
  open.addEventListener('click',()=>{if(host.dataset.state==='opening')return;host.dataset.state='opening';open.disabled=true;skip.hidden=false;enter.hidden=true;status.textContent='Fourteen seals align. The final doors are opening…';if(reduced.matches||document.body.classList.contains('motion-paused')){ready();return}timer=setTimeout(ready,2800);});
  skip.addEventListener('click',()=>{ready();enter.focus();});
  host.addEventListener('animationend',event=>{if(event.animationName==='final-right-open'&&host.dataset.state==='opening')ready();});
  reduced.addEventListener('change',()=>{if(reduced.matches&&host.dataset.state==='opening')ready();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&host.dataset.state==='opening')ready();});
  new MutationObserver(()=>{if(document.body.classList.contains('motion-paused')&&host.dataset.state==='opening')ready();}).observe(document.body,{attributes:true,attributeFilter:['class']});
 }
 // The original Observatory remains available through its existing reviewer entrance.
 if(new URLSearchParams(location.search).get('room')==='15'){
  document.getElementById('skip')?.click();document.getElementById('observatoryAccess')?.click();
 }
})();
