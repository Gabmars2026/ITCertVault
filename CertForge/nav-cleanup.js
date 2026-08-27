(()=>{
  if(!document.querySelector('link[data-ain-mobile-nav-fix]')){
    const l=document.createElement('link');l.rel='stylesheet';l.href='/mobile-nav-fix.css?v=20260827p';l.dataset.ainMobileNavFix='1';document.head.appendChild(l);
  }
  const menus={
    SECURITY:[
      ['/cybersecurity/','Cybersecurity'],
      ['/securityweek/','SecurityWeek'],
      ['/dark-reading/','Dark Reading'],
      ['/the-record/','The Record'],
      ['/cybernews/','Cybernews']
    ],
    PUBLISHERS:[
      ['/bleepingcomputer/','BleepingComputer'],
      ['/hacker-news/','The Hacker News'],
      ['/ars-security/','Ars Technica Security'],
      ['/techpowerup/','TechPowerUp'],
      ['/the-register/','The Register']
    ],
    TECHNOLOGY:[
      ['/it-news/','IT News'],
      ['/hardware/','Hardware'],
      ['/sysadmin/','Sysadmin'],
      ['/business/','Business & Big Tech']
    ]
  };
  const isMobile=()=>matchMedia('(max-width:980px)').matches;

  function makeMenu(group,items){
    const box=group.querySelector('.nav-menu');
    if(!box)return;
    box.innerHTML=items.map(([href,label])=>`<a href="${href}">${label}</a>`).join('');
  }

  function closeMobile(nav){
    nav?.classList.remove('mobile-open');
    document.body.classList.remove('ain-mobile-menu-open');
    document.querySelector('.mobile-nav-toggle')?.setAttribute('aria-expanded','false');
    nav?.querySelectorAll('.nav-group[open]').forEach(g=>g.removeAttribute('open'));
  }

  function syncMobileTop(){
    const header=document.querySelector('.top');
    if(!header)return;
    const bottom=Math.max(0,Math.round(header.getBoundingClientRect().bottom));
    document.documentElement.style.setProperty('--ain-mobile-nav-top',bottom+'px');
  }

  function bindMobileNav(){
    const nav=document.querySelector('.nav');
    const current=document.querySelector('.mobile-nav-toggle');
    if(!nav||!current)return false;
    if(current.dataset.ainMobileBound==='1')return true;

    const btn=current.cloneNode(true);
    btn.dataset.ainMobileBound='1';
    btn.setAttribute('aria-expanded','false');
    btn.setAttribute('aria-controls','ain-mobile-navigation');
    current.replaceWith(btn);
    const shell=nav.querySelector('.ain-nav-shell');
    if(shell)shell.id='ain-mobile-navigation';

    btn.addEventListener('click',e=>{
      if(!isMobile())return;
      e.preventDefault();
      e.stopPropagation();
      syncMobileTop();
      const open=!nav.classList.contains('mobile-open');
      nav.classList.toggle('mobile-open',open);
      document.body.classList.toggle('ain-mobile-menu-open',open);
      btn.setAttribute('aria-expanded',String(open));
      if(!open)nav.querySelectorAll('.nav-group[open]').forEach(g=>g.removeAttribute('open'));
    });

    nav.addEventListener('click',e=>{
      if(!isMobile())return;
      const link=e.target.closest('a[href]');
      if(link)closeMobile(nav);
    });

    document.addEventListener('click',e=>{
      if(!isMobile()||!nav.classList.contains('mobile-open'))return;
      if(nav.contains(e.target)||btn.contains(e.target))return;
      closeMobile(nav);
    });

    document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMobile(nav)});
    window.addEventListener('resize',()=>{
      syncMobileTop();
      if(!isMobile())closeMobile(nav);
    },{passive:true});
    window.addEventListener('orientationchange',()=>setTimeout(syncMobileTop,80),{passive:true});
    syncMobileTop();
    return true;
  }

  function cleanNav(){
    const nav=document.querySelector('.nav');
    if(!nav)return;
    nav.querySelectorAll('.nav-group').forEach(group=>{
      const label=(group.querySelector('summary')?.textContent||'').trim().toUpperCase();
      if(menus[label])makeMenu(group,menus[label]);
      const seen=new Set();
      group.querySelectorAll('.nav-menu a').forEach(a=>{
        let key='';
        try{const u=new URL(a.href,location.href);key=(u.origin===location.origin?u.pathname:u.origin+u.pathname).replace(/\/+$/,'/').toLowerCase()}catch{key=(a.getAttribute('href')||'').trim().toLowerCase()}
        if(!key||seen.has(key))a.remove();else seen.add(key);
      });
    });
    nav.querySelectorAll('.outages-nav').forEach(a=>a.textContent='OUTAGES');
    const topSeen=new Set();
    nav.querySelectorAll('.ain-nav-shell > a.ain-nav-link').forEach(a=>{
      let key=a.getAttribute('href')||'';
      try{const u=new URL(a.href,location.href);key=u.origin===location.origin?u.pathname:u.href}catch{}
      if(topSeen.has(key))a.remove();else topSeen.add(key);
    });
    bindMobileNav();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',cleanNav,{once:true});else cleanNav();
  setTimeout(cleanNav,40);
  setTimeout(cleanNav,350);
  setTimeout(cleanNav,1000);
})();
