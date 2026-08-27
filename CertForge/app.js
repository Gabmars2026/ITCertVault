const REF='/api/reference-image';
const STYLE_FIX='/media-fix.css';
if(!document.querySelector(`link[href="${STYLE_FIX}"]`)){const l=document.createElement('link');l.rel='stylesheet';l.href=STYLE_FIX;document.head.appendChild(l)}

const FALLBACK_IMAGES=[
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1800&q=90',
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1800&q=90',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1800&q=90',
  'https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=1800&q=90',
  'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=1800&q=90',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1800&q=90'
];
const M={breaking:['Breaking AI News','The newest high-signal AI announcements and developments as they appear.',[]],chatgpt:['ChatGPT & OpenAI','OpenAI, ChatGPT, Codex, Sora, agents and model releases.',['openai','chatgpt','gpt','codex','sora']],claude:['Claude & Anthropic','Anthropic, Claude models, Claude Code, research and product updates.',['anthropic','claude']],gemini:['Gemini & Google AI','Gemini, Google DeepMind and Google AI product announcements.',['gemini','google','deepmind']],'ai-models':['AI Models','New frontier and open-weight language, reasoning and multimodal models.',['model','llm','reasoning','multimodal','llama','qwen','mistral','deepseek']],'ai-video':['AI Video','Generative video, editing models and creative video tools.',['video','sora','veo','runway','kling','luma']],'ai-images':['AI Images','Image generation, editing, design models and visual AI tools.',['image','midjourney','flux','stable diffusion','visual']],coding:['AI Coding','Coding agents, developer tools, IDE assistants and software-generation models.',['code','coding','developer','github','copilot','cursor','codex']],hardware:['AI Hardware','GPUs, accelerators, data centers, chips and AI infrastructure.',['nvidia','amd','intel','gpu','chip','compute','data center']],robotics:['AI Robotics','Humanoid robots, autonomous systems and embodied AI.',['robot','robotics','humanoid','autonomous']],business:['AI Business','Funding, acquisitions, partnerships, enterprise AI and market moves.',['funding','valuation','business','enterprise','revenue','deal','startup']],'all-news':['All AI News','A single feed containing every AI story collected by AI News Now.',[]]};
const F=[
  ['Anthropic signs massive $45 billion AI-compute agreement with Nscale','https://techcrunch.com/2026/08/26/anthropic-continues-compute-gobbling-streak-in-45-billion-deal-with-nscale/','TechCrunch',12,'The six-year deal will provide Anthropic with up to 1 gigawatt of compute capacity using Nvidia’s next-gen infrastructure.',FALLBACK_IMAGES[0]],
  ['NVIDIA AI infrastructure demand continues to surge','https://www.nvidia.com/en-us/','NVIDIA',28,'Data center demand continues to grow as the AI industry expands compute capacity.',FALLBACK_IMAGES[2]],
  ['Google expands Gemini with new AI capabilities','https://blog.google/technology/ai/','Google',45,'New Gemini features make AI assistants more useful across everyday workflows.',FALLBACK_IMAGES[1]],
  ['OpenAI advances its latest AI systems','https://openai.com/news/','OpenAI',60,'OpenAI continues advancing reasoning systems, multimodal models and AI agents.',FALLBACK_IMAGES[3]],
  ['Meta continues development of the Llama model family','https://ai.meta.com/','Meta',120,'Meta continues investing in open model development and artificial intelligence research.',FALLBACK_IMAGES[4]],
  ['Generative video tools continue to improve','https://runwayml.com/','Runway',135,'Generative video systems continue to improve consistency and creative control.',FALLBACK_IMAGES[5]]
].map((x,i)=>({id:'f'+i,title:x[0],link:x[1],source:x[2],publishedAt:new Date(Date.now()-x[3]*60000).toISOString(),description:x[4],image:x[5]}));

const e=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ago=x=>{let m=Math.max(1,Math.floor((Date.now()-new Date(x))/60000));return m<60?m+'m ago':m<1440?Math.floor(m/60)+'h ago':Math.floor(m/1440)+'d ago'};
function crop(box,cls=''){const[x,y,w,h]=box;return `<span class="crop ${cls}"><svg viewBox="${x} ${y} ${w} ${h}" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><image href="${REF}" x="0" y="0" width="512" height="432" preserveAspectRatio="none"/></svg></span>`}
const BOX={bot:[383,243,57,62],magai:[405,358,26,33],opus:[433,358,29,33],codestral:[464,358,29,33],leonardo:[2,397,29,33],voicemod:[33,397,29,33]};
function text(n){return (n.title+' '+n.description+' '+n.source).toLowerCase()}
function imageFor(n,i=0){return /^https?:\/\//i.test(n?.image||'')?n.image:FALLBACK_IMAGES[i%FALLBACK_IMAGES.length]}
function newsImg(n,i=0,cls='news-img',loading='lazy'){const src=imageFor(n,i),fb=FALLBACK_IMAGES[i%FALLBACK_IMAGES.length];return `<img class="${cls}" src="${e(src)}" alt="" loading="${loading}" decoding="async" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${fb}'">`}
function card(n,i=0){return `<article class="card"><a class="art" href="${e(n.link)}" target="_blank" rel="noreferrer">${newsImg(n,i)}</a><div class="body"><div class="meta">${e(n.source)} · ${ago(n.publishedAt)}</div><h3><a href="${e(n.link)}" target="_blank" rel="noreferrer">${e(n.title)}</a></h3><p>${e(n.description)}</p><div class="foot"><a href="${e(n.link)}" target="_blank" rel="noreferrer">${e(n.source)} · Read source ↗</a><span>♡</span></div></div></article>`}
async function news(){try{let r=await fetch('/api/news',{cache:'no-store'});if(!r.ok)throw 0;let j=await r.json();return j.news?.length?j.news:F}catch{return F}}
function pick(n,terms,fallback){let hit=n.find(x=>terms.some(t=>text(x).includes(t)));return hit||fallback}

let heroStories=[],heroIndex=0,heroTimer=null;
function heroInner(hero){return `<div class="hcopy"><span class="tag">JUST IN</span><h1>${e(hero.title)}</h1><p>${e(hero.description)}</p><div class="hmeta">${ago(hero.publishedAt)} • <b>${e(hero.source)}</b></div></div><div class="visual">${newsImg(hero,heroIndex,'hero-news-img','eager')}</div><a class="herolink" href="${e(hero.link)}" target="_blank" rel="noreferrer" aria-label="Read ${e(hero.title)}"></a><button class="arr l" type="button" aria-label="Previous featured story" title="Previous story">‹</button><button class="arr r" type="button" aria-label="Next featured story" title="Next story">›</button><div class="dots" role="tablist" aria-label="Featured AI stories">${heroStories.map((_,i)=>`<button class="hero-dot ${i===heroIndex?'active':''}" type="button" data-hero-index="${i}" aria-label="Show featured story ${i+1}" aria-selected="${i===heroIndex}"></button>`).join('')}</div>`}
function heroShell(stories){heroStories=stories.filter(Boolean).slice(0,6);if(!heroStories.length)heroStories=[F[0]];heroIndex=0;return `<article class="hero" id="heroCarousel">${heroInner(heroStories[0])}</article>`}
function stopHero(){if(heroTimer){clearInterval(heroTimer);heroTimer=null}}
function startHero(){stopHero();if(heroStories.length>1)heroTimer=setInterval(()=>showHero(heroIndex+1,false),7000)}
function bindHero(){const h=document.getElementById('heroCarousel');if(!h)return;const prev=h.querySelector('.arr.l'),next=h.querySelector('.arr.r');if(prev)prev.onclick=ev=>{ev.preventDefault();ev.stopPropagation();showHero(heroIndex-1,true)};if(next)next.onclick=ev=>{ev.preventDefault();ev.stopPropagation();showHero(heroIndex+1,true)};h.querySelectorAll('.hero-dot').forEach(b=>b.onclick=ev=>{ev.preventDefault();ev.stopPropagation();showHero(+b.dataset.heroIndex,true)});h.onmouseenter=stopHero;h.onmouseleave=startHero;h.ontouchstart=stopHero;h.ontouchend=startHero}
function showHero(index,manual=true){if(!heroStories.length)return;heroIndex=(index+heroStories.length)%heroStories.length;const h=document.getElementById('heroCarousel');if(!h)return;h.innerHTML=heroInner(heroStories[heroIndex]);bindHero();if(manual)startHero()}

function home(n){
  let rawHero=pick(n,['nscale','45b','anthropic'],n[0]||F[0]);
  let hero=rawHero.link&&rawHero.link.includes('nscale')?{...rawHero,title:'Anthropic signs massive $45 billion AI-compute agreement with Nscale',description:'The six-year deal will provide Anthropic with up to 1 gigawatt of compute capacity using Nvidia’s next-gen infrastructure.'}:rawHero;
  const heroPool=[hero,...n.filter(x=>x.link!==rawHero.link)].slice(0,6);
  let latest=[pick(n,['nvidia'],F[1]),pick(n,['gemini'],F[2]),pick(n,['openai'],F[3]),pick(n,['meta','llama'],F[4])];
  let seen=new Set([rawHero.link,...latest.map(x=>x.link)]);let pop=n.filter(x=>!seen.has(x.link)).slice(0,5);while(pop.length<5)pop.push(F[(pop.length+1)%F.length]);
  let br=n.slice(0,5);if(br.length<5)br=[...n,...F].slice(0,5);
  let tr=['Claude','Nvidia Earnings','Gemini','Sora','AI Agents'];
  return `<main class="dashboard">
    <aside class="left">
      <section class="panel breaking"><div class="pt"><span>🔥 BREAKING NEWS</span><a href="/breaking/">View all</a></div>${br.map((x,i)=>`<a class="breakitem" href="${e(x.link)}" target="_blank"><div><small>${ago(x.publishedAt)} • ${e(x.source)}</small><strong>${e(x.title)}</strong></div><span class="thumb">${newsImg(x,i,'thumb-img')}</span></a>`).join('')}<a class="railbtn" href="/breaking/">View all breaking news →</a></section>
      <section class="panel"><div class="pt"><span>📈 TRENDING TOPICS</span><a href="/all-news/">View all</a></div>${tr.map((x,i)=>`<a class="trend" href="/search/?q=${encodeURIComponent(x)}"><span class="rank">${i+1}</span><div><strong>${x}</strong><small>Trending now</small></div><span class="spark">⌁⌁⌁</span></a>`).join('')}</section>
    </aside>
    <section class="center">
      ${heroShell(heroPool)}
      <div class="sh"><h2>LATEST AI NEWS</h2><a href="/all-news/">View all →</a></div><div class="grid">${latest.map((x,i)=>card(x,i)).join('')}</div>
    </section>
    <aside class="right">
      <section class="panel daily"><div class="bot">${crop(BOX.bot)}</div><h3>DAILY AI BRIEF</h3><p class="date">${new Intl.DateTimeFormat('en-US',{month:'long',day:'numeric',year:'numeric'}).format(new Date())}</p><p>5 major stories, top tools, and important updates in AI today.</p><a class="bluebtn" href="/breaking/">Read Today's Brief →</a></section>
      <section class="panel"><div class="pt"><span>POPULAR NEWS</span><a href="/all-news/">View all</a></div>${pop.map((x,i)=>`<a class="pop" href="${e(x.link)}" target="_blank"><b>${i+1}</b><div><strong>${e(x.title)}</strong><small>${(2.3-i*.28).toFixed(1)}K reads</small></div><span class="pimg">${newsImg(x,i+2,'popular-img')}</span></a>`).join('')}</section>
    </aside>
    <section class="panel tools"><div class="pt"><span>NEW AI TOOLS</span><a href="/ai-models/">View all →</a></div><div class="toolrow">${[['Magai','AI Presentation Maker','magai'],['OpusClip 2.0','AI Video Editor','opus'],['Codestral','AI Coding Assistant','codestral'],['Leonardo AI','Image Generation','leonardo'],['Voicemod AI','Voice Changer','voicemod']].map(([a,b,k])=>`<a class="tool" href="/search/?q=${encodeURIComponent(a)}"><span class="toolicon">${crop(BOX[k])}</span><span><strong>${a}</strong><small>${b}</small></span><b>NEW</b></a>`).join('')}</div></section>
  </main>`
}
function section(n,key){let q=new URLSearchParams(location.search).get('q')||'',m=M[key]||M['all-news'],title=m[0],desc=m[1],ks=m[2],items=n;if(key==='breaking')items=n.slice(0,24);else if(key==='search'){title=q?`Search: “${q}”`:'Search AI News';desc=q?`Live results matching ${q}.`:'Use the search box to find companies, models, tools and topics.';items=q?n.filter(x=>text(x).includes(q.toLowerCase())):n}else if(key!=='all-news')items=n.filter(x=>ks.some(k=>text(x).includes(k)));return `<main class="section"><div class="sectionhero"><div><a class="back" href="/">← AI News Now</a><span class="live">● LIVE FEED</span><h1>${e(title)}</h1><p>${e(desc)}</p></div><div class="stat"><strong>${items.length}</strong><span>stories loaded</span><small>Refreshes automatically</small></div></div>${items.length?`<div class="sectiongrid">${items.map((x,i)=>card(x,i)).join('')}</div>`:`<div class="simple"><div class="box"><h2>No matching live stories right now.</h2><p>The collector will add matching articles automatically as new RSS items arrive.</p><a href="/all-news/">Browse all AI news</a></div></div>`}</main>`}
function special(key){if(key==='about')return `<main class="simple"><section class="box"><span class="tag">ABOUT</span><h1>One place for everything happening in AI.</h1><p>AI News Now reads public RSS feeds on the server, removes obvious duplicates, sorts stories by recency and sends readers to the original publisher for the full article.</p><h2>No paid news API required</h2><p>The collector uses public feeds and a short cache. If a feed is temporarily unavailable, fallback headlines keep the interface usable until the next refresh.</p><h2>Respectful aggregation</h2><p>We show short summaries and attribution instead of republishing complete copyrighted articles.</p></section></main>`;if(key==='subscribe')return `<main class="simple"><section class="box"><h1>Newsletter</h1><p>The Subscribe button has been removed from the website header. This route is kept only so old bookmarks do not break.</p><a href="/">← Back to AI News Now</a></section></main>`}

document.querySelector('.search').onsubmit=x=>{x.preventDefault();let q=x.currentTarget.querySelector('input').value.trim();if(q)location.href='/search/?q='+encodeURIComponent(q)};
document.getElementById('theme').onclick=()=>document.documentElement.classList.toggle('light');
let key=location.pathname.split('/').filter(Boolean)[0]||'home';document.querySelectorAll('.nav a').forEach(a=>{let p=a.getAttribute('href').split('/').filter(Boolean)[0]||'home';if(p===key)a.classList.add('active')});
document.addEventListener('keydown',ev=>{if(!document.getElementById('heroCarousel')||['INPUT','TEXTAREA'].includes(document.activeElement?.tagName))return;if(ev.key==='ArrowLeft')showHero(heroIndex-1,true);if(ev.key==='ArrowRight')showHero(heroIndex+1,true)});
(async()=>{let app=document.getElementById('app');if(key==='about'||key==='subscribe'){app.className='';app.innerHTML=special(key);return}let n=await news();app.className='';if(key==='home'){app.innerHTML=home(n);bindHero();startHero()}else app.innerHTML=section(n,key)})();
