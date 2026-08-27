(function(){
  var app=document.getElementById('app');
  if(!app||location.pathname!=='/')return;
  var CACHE_KEY='ainn-instant-home-v1';
  function esc(v){return String(v||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function ago(v){var d=new Date(v),m=Math.max(1,Math.floor((Date.now()-d.getTime())/60000));return m<60?m+'m ago':m<1440?Math.floor(m/60)+'h ago':Math.floor(m/1440)+'d ago'}
  function img(n,i){if(n&&n.image)return n.image;var f=['https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80'];return f[i%f.length]}
  function card(n,i){return '<article class="card"><a class="art" href="'+esc(n.link)+'" target="_blank" rel="noreferrer"><img class="news-img" src="'+esc(img(n,i))+'" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer"></a><div class="body"><div class="meta">'+esc(n.source)+' · '+ago(n.publishedAt)+'</div><h3><a href="'+esc(n.link)+'" target="_blank" rel="noreferrer">'+esc(n.title)+'</a></h3><p>'+esc(n.description||'')+'</p><div class="foot"><a href="'+esc(n.link)+'" target="_blank" rel="noreferrer">'+esc(n.source)+' · Read source ↗</a><span>♡</span></div></div></article>'}
  function render(items,label){
    if(!items||!items.length)return;
    var hero=items[0],cards=items.slice(1,10);
    app.className='';
    app.innerHTML='<main class="section instant-home"><div class="sectionhero"><div><span class="live">● LIVE FEED</span><h1>'+esc(hero.title)+'</h1><p>'+esc(hero.description||'Latest AI, IT and cybersecurity news updated automatically.')+'</p><a class="back" href="'+esc(hero.link)+'" target="_blank" rel="noreferrer">Read top story ↗</a></div><div class="stat"><strong>'+items.length+'</strong><span>stories ready</span><small>'+esc(label||'Live news')+'</small></div></div><div class="sectiongrid">'+cards.map(card).join('')+'</div></main>';
  }
  try{var cached=JSON.parse(localStorage.getItem(CACHE_KEY)||'null');if(cached&&cached.news&&cached.news.length)render(cached.news,'Cached while refreshing')}catch(e){}
  var timer;
  var timeout=new Promise(function(_,reject){timer=setTimeout(function(){reject(new Error('timeout'))},2200)});
  var live=fetch('/api/news?category=home',{cache:'default'}).then(function(r){if(!r.ok)throw new Error('bad response');return r.json()});
  Promise.race([live,timeout]).then(function(j){clearTimeout(timer);if(j&&j.news&&j.news.length){try{localStorage.setItem(CACHE_KEY,JSON.stringify({ts:Date.now(),news:j.news.slice(0,20)}))}catch(e){}render(j.news.slice(0,20),'Updated live')}}).catch(function(){clearTimeout(timer)});
})();
