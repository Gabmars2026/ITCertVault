(()=>{
  function cleanNav(){
    document.querySelectorAll('.nav .nav-group').forEach(group=>{
      const label=(group.querySelector('summary')?.textContent||'').trim().toUpperCase();
      group.querySelectorAll('.nav-menu a').forEach(a=>{
        const text=(a.textContent||'').trim();
        if(label==='TECHNOLOGY'&&/downdetector|live outages/i.test(text))a.remove();
        if(label==='SECURITY'&&/ars technica security|securityweek/i.test(text))a.remove();
      });
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',cleanNav,{once:true});else cleanNav();
  setTimeout(cleanNav,50);
  setTimeout(cleanNav,500);
})();
