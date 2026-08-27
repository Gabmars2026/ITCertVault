(()=>{
  const publisherPaths=new Set(['/bleepingcomputer/','/hacker-news/','/securityweek/','/ars-security/']);
  const normalizeHref=a=>{try{const u=new URL(a.getAttribute('href')||'',location.href);return u.origin===location.origin?u.pathname.replace(/\/+$/,'/'):(u.origin+u.pathname).replace(/\/+$/,'/')}catch{return (a.getAttribute('href')||'').trim().toLowerCase()}};

  function cleanNav(){
    const nav=document.querySelector('.nav');
    if(!nav)return;

    nav.querySelectorAll('.nav-group').forEach(group=>{
      const label=(group.querySelector('summary')?.textContent||'').trim().toUpperCase();
      const seen=new Set();
      group.querySelectorAll('.nav-menu a').forEach(a=>{
        const href=normalizeHref(a);
        const text=(a.textContent||'').trim().toLowerCase();
        let remove=false;

        if(label!=='PUBLISHERS'&&publisherPaths.has(href))remove=true;
        if(/downdetector\.com/i.test(href)||/live outages/i.test(text))remove=true;

        const key=href+'|'+text;
        if(seen.has(key))remove=true;
        else seen.add(key);

        if(remove)a.remove();
      });
    });

    const topSeen=new Set();
    nav.querySelectorAll('.ain-nav-shell > a.ain-nav-link').forEach(a=>{
      const key=normalizeHref(a);
      if(topSeen.has(key))a.remove();
      else topSeen.add(key);
    });
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',cleanNav,{once:true});else cleanNav();
  setTimeout(cleanNav,50);
  setTimeout(cleanNav,500);
})();
