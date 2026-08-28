(()=>{
  const TARGET=6;
  let tries=0,working=false,done=false;
  const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const ago=x=>{const t=+new Date(x);if(!Number.isFinite(t))return'just now';const m=Math.max(1,Math.floor((Date.now()-t)/60000));return m<60?m+'m ago':m<1440?Math.floor(m/60)+'h ago':Math.floor(m/1440)+'d ago'};
  const normTitle=s=>String(s||'').toLowerCase().replace(/&(?:nbsp|amp);/g,' ').replace(/[^a-z0-9]+/g,' ').trim();
  function canonical(href){
    try{
      const u=new URL(href,location.origin);
      u.hash='';
      [...u.searchParams.keys()].forEach(k=>{if(/^(utm_|fbclid$|gclid$|mc_|ref$|source$)/i.test(k))u.searchParams.delete(k)});
      if(u.pathname.length>1)u.pathname=u.pathname.replace(/\/+$/,'');
      return u.href;
    }catch{return String(href||'').trim()}
  }
  function image(n,i){if(/^https?:\/\//i.test(n.image||''))return n.image;const p=new URLSearchParams({article:String(n.link||''),seed:String(n.id||n.title||i),variant:'latest-'+i});return '/api/article-image?'+p.toString()}
  function card(n,i){const src=image(n,i),link=esc(n.link||'/all-news/'),source=esc(n.source||'AI News'),title=esc(n.title||'Latest AI news'),desc=esc(n.description||'Latest artificial intelligence news and analysis.');return `<article class="card latest-balance-card"><a class="art" href="${link}" target="_blank" rel="noreferrer"><img class="news-img" src="${esc(src)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer"></a><div class="body"><div class="meta">${source} · ${ago(n.publishedAt)}</div><h3><a href="${link}" target="_blank" rel="noreferrer">${title}</a></h3><p>${desc}</p><div class="foot"><a href="${link}" target="_blank" rel="noreferrer">${source} · Read source ↗</a><span>♡</span></div></div></article>`}
  function dedupeExisting(grid){
    const seenLinks=new Set(),seenTitles=new Set();
    let removed=0;
    for(const item of [...grid.querySelectorAll('.card')]){
      const a=item.querySelector('a.art[href],h3 a[href]');
      const h=item.querySelector('h3');
      const link=canonical(a?.href||'');
      const title=normTitle(h?.textContent||'');
      const duplicate=(link&&seenLinks.has(link))||(title&&seenTitles.has(title));
      if(duplicate){item.remove();removed++;continue}
      if(link)seenLinks.add(link);
      if(title)seenTitles.add(title);
    }
    return removed;
  }
  async function fill(){
    if(done||working)return;
    const grid=document.querySelector('.center .grid');
    if(!grid){if(++tries<40)setTimeout(fill,160);return}
    const removed=dedupeExisting(grid);
    let existing=[...grid.querySelectorAll('.card')];
    if(existing.length>=TARGET){done=true;if(removed)window.dispatchEvent(new CustomEvent('ainn:latest-balanced'));return}
    working=true;
    try{
      const r=await fetch('/api/news?category=home&page=1',{cache:'no-store'});
      if(!r.ok)throw new Error('news '+r.status);
      const j=await r.json(),news=Array.isArray(j.news)?j.news:[];
      const links=new Set([...grid.querySelectorAll('.card a.art[href],.card h3 a[href]')].map(a=>canonical(a.href)).filter(Boolean));
      const titles=new Set([...grid.querySelectorAll('.card h3')].map(h=>normTitle(h.textContent)).filter(Boolean));
      const add=[];
      for(const n of news){
        if(add.length>=TARGET-existing.length)break;
        if(!n||!n.link||!n.title)continue;
        const link=canonical(n.link),title=normTitle(n.title);
        if((link&&links.has(link))||(title&&titles.has(title)))continue;
        if(link)links.add(link);if(title)titles.add(title);add.push(n);
      }
      if(add.length)grid.insertAdjacentHTML('beforeend',add.map((n,i)=>card(n,existing.length+i)).join(''));
      dedupeExisting(grid);
      done=grid.querySelectorAll('.card').length>=TARGET;
      if(add.length||removed)window.dispatchEvent(new CustomEvent('ainn:latest-balanced'));
    }catch(e){console.warn('Latest AI News balance skipped',e)}finally{
      working=false;
      if(!done&&++tries<40)setTimeout(fill,260);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(fill,50),{once:true});else setTimeout(fill,50);
})();