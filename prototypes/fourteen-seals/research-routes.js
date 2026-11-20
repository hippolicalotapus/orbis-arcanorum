/* Public catalog navigation is separate from private reading-room imports. */
window.PortalResearch={
 routes:[
  {label:'Browse Secret Societies & Orders',params:{chamber:'Secret Societies & Orders'}},
  {label:'Browse Grimoires & Magical Texts',params:{chamber:'Grimoires & Magical Texts'}},
  {label:'Browse Alchemy & Hermeticism',params:{chamber:'Alchemy & Hermeticism'}},
  {label:'Browse Ancient Religions & Mythology',params:{chamber:'Ancient Religions & Mythology'}},
  {label:'Search folklore sources',params:{q:'folklore'}},
  {label:'Search civilization sources',params:{q:'civilization'}},
  {label:'Search manuscript sources',params:{q:'manuscript'}},
  {label:'Search astrology sources',params:{q:'astrology'}},
  {label:'Explore Loch Ness reports',params:{q:'Loch Ness'}},
  {label:'Search haunting reports',params:{q:'haunting'}},
  {label:'Search relic sources',params:{q:'relic'}},
  {label:'Search prophecy sources',params:{q:'prophecy'}},
  {label:'Search philosophy sources',params:{q:'philosophy'}},
  {label:'Review disputed research',params:{classification:'Disputed'}}
 ],
 href(index){
  const route=this.routes[index];
  return '../../catalog.html'+(route?'?'+new URLSearchParams(route.params):'');
 },
 update(link,index){
  const route=this.routes[index];
  link.href=this.href(index);
  link.textContent=route?route.label+' →':'Browse the research catalog →';
 }
};
