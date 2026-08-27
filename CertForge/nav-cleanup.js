(()=>{
  const menus={
    SECURITY:[
      ['/cybersecurity/','Cybersecurity'],
      ['/securityweek/','SecurityWeek'],
      ['/dark-reading/','Dark Reading'],
      ['/the-record/','The Record']
    ],
    PUBLISHERS:[
      ['/bleepingcomputer/','BleepingComputer'],
      ['/hacker-news/','The Hacker News'],
      ['/ars-security/','Ars Technica Security'],
      ['/techpowerup/','TechPowerUp']
    ],
    TECHNOLOGY:[
      ['/it-news/','IT News'],
      ['/hardware/','Hardware'],
      ['/sysadmin/','Sysadmin'],
      ['/business/','Business & Big Tech']
    ]
  };

  function makeMenu(group,items){
    const box=group.querySelector('.nav-menu');
    if(!box)return;
    box.innerHTML=items.map(([href,label])=>`<a href="${href}">${label}</a>`).join('');
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
    const topSeen=new Set();
    nav.querySelectorAll('.ain-nav-shell > a.ain-nav-link').forEach(a=>{
      let key=a.getAttribute('href')||'';
      try{const u=new URL(a.href,location.href);key=u.origin===location.origin?u.pathname:u.href}catch{}
      if(topSeen.has(key))a.remove();else topSeen.add(key);
    });
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',cleanNav,{once:true});else cleanNav();
  setTimeout(cleanNav,40);
  setTimeout(cleanNav,350);
})();
