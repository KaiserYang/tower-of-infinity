(() => {
 const body=document.body, base=body.dataset.base;
 let saved;try{saved=localStorage.getItem('toi-language');}catch{}
 if(body.dataset.negotiate){
  const language=['en','es'].includes(saved)?saved:(navigator.language||'en').toLowerCase().startsWith('es')?'es':'en';
  const suffix=body.dataset.page==='home'?'':body.dataset.page+'/';
  const target=base+language+'/'+suffix;
  if(location.pathname!==target)location.replace(target+location.search+location.hash);
 }
 document.querySelectorAll('[data-language]').forEach(a=>a.addEventListener('click',()=>{try{localStorage.setItem('toi-language',a.dataset.language);}catch{} if(location.hash)a.href+=location.hash;}));
 document.querySelectorAll('[data-year]').forEach(el=>el.textContent=String(new Date().getFullYear()));
 const track=document.querySelector('.gallery-track');
 document.querySelectorAll('[data-gallery]').forEach(button=>button.addEventListener('click',()=>{
  const card=track?.querySelector('figure');if(!card)return;
  track.scrollBy({left:Number(button.dataset.gallery)*(card.getBoundingClientRect().width+24),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 }));
})();
