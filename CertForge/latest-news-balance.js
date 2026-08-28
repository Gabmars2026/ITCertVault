(()=>{
  const TARGET=6;
  let tries=0,working=false,done=false;
  const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const ago=x=>{const t=+new Date(x);if(!Number.isFinite(t))return'just now';const m=Math.max(1,Math.floor((Date.now()-t)/60000));return m<60?m+'m ago':m<1440?Math.floor(m/60)+'h ago':Math.floor(m/1440)+'d ago'};
  function image(n,i){if(/^https?:\/\//i.test(n.image||''))return n.image;const p=new URLSearchParams({article:String(n.link||''),seed:String(n.id||n.title||i),variant:'latest-'+i});return '/api/article-image?'+p.toString()}
  function card(n,i){const src=image(n,i),link=esc(n.link||'/all-news/'),source=esc(n.source||'AI News'),title=esc(n.title||'Latest AI news'),desc=esc(n.description||'Latest artificial intelligence news and analysis.');return `<article class="card latest-balance-card"><a class="art" href="${link}" target="_blank" rel="noreferrer"><img class="news-img" src="${esc(src)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer"></a><div class="body"><div class="meta">${source} · ${ago(n.publishedAt)}</div><h3><a href="${link}" target="_blank" rel="noreferrer">${title}</a></h3><p>${desc}</p><div class="foot"><a href="${link}" target="_blank" rel="noreferrer">${source} · Read source ↗</a><span>♡</span></div></div></article>`}
  async function fill(){
    if(done||working)return;
    const grid=document.querySelector('.center .grid');
    if(!grid){if(++tries<35)setTimeout(fill,180);return}
    const existing=[...grid.querySelectorAll('.card')];
    if(existing.length>=TARGET){done=true;return}
    working=true;
    try{
      const r=await fetch('/api/news?category=home&page=1',{cache:'no-store'});
      if(!r.ok)throw new Error('news '+r.status);
      const j=await r.json(),news=Array.isArray(j.news)?j.news:[];
      const links=new Set([...grid.querySelectorAll('.card a.art[href]')].map(a=>a.href));
      const titles=new Set([...grid.querySelectorAll('.card h3')].map(h=>h.textContent.trim().toLowerCase()));
      const add=[];
      for(const n of news){
        if(add.length>=TARGET-existing.length)break;
        if(!n||!n.link||!n.title)continue;
        let absolute;try{absolute=new URL(n.link,location.origin).href}catch{absolute=n.link}
        const title=String(n.title).trim().toLowerCase();
        if(links.has(absolute)||titles.has(title))continue;
        links.add(absolute);titles.add(title);add.push(n);
      }
      if(add.length)grid.insertAdjacentHTML('beforeend',add.map((n,i)=>card(n,existing.length+i)).join(''));
      done=grid.querySelectorAll('.card').length>=TARGET;
      if(add.length)window.dispatchEvent(new CustomEvent('ainn:latest-balanced'));
    }catch(e){console.warn('Latest AI News balance skipped',e)}finally{
      working=false;
      if(!done&&++tries<35)setTimeout(fill,300);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(fill,80),{once:true});else setTimeout(fill,80);
})();