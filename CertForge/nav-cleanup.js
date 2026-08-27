(()=>{
  function cleanNav(){
    document.querySelectorAll('.nav .nav-group').forEach(group=>{
      const label=(group.querySelector('summary')?.textContent||'').trim().toUpperCase();
      if(label!=='TECHNOLOGY')return;
      group.querySelectorAll('.nav-menu a').forEach(a=>{
        if(/downdetector|live outages/i.test(a.textContent||''))a.remove();
      });
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',cleanNav,{once:true});else cleanNav();
  setTimeout(cleanNav,50);
  setTimeout(cleanNav,500);
})();
