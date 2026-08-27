(()=>{
const app=document.getElementById('app');
if(!app)return;
const route=()=>location.pathname.split('/').filter(Boolean)[0]||'home';
const isLoading=()=>/Loading live news/i.test(app.textContent||'');
function renderFallback(){
  if(!isLoading())return;
  try{
    const key=route();
    app.className='';
    if(key==='home'){
      app.innerHTML=home(F);
      bindHero();
      startHero();
    }else if(key==='daily-brief'){
      app.innerHTML=dailyBrief(F);
    }else if(key!=='about'){
      app.innerHTML=section(F,key);
    }
  }catch{
    app.className='simple';
    app.innerHTML='<div>News is refreshing…</div>';
  }
}
setTimeout(renderFallback,700);
setTimeout(renderFallback,1800);
})();
