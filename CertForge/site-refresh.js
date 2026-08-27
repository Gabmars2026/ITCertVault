(()=>{
const KEY=location.pathname.split('/').filter(Boolean)[0]||'home';
const OWN_REFRESH=new Set(['about','breaking','bleepingcomputer','hacker-news','securityweek','ars-security','dark-reading','the-record','techpowerup','tool-magai','tool-opusclip','tool-codestral','tool-leonardo-ai','tool-voicemod-ai','tool-live']);
if(OWN_REFRESH.has(KEY))return;
const SCROLL_KEY='ainn-refresh-scroll:'+location.pathname+location.search;
try{const y=+sessionStorage.getItem(SCROLL_KEY)||0;if(y){sessionStorage.removeItem(SCROLL_KEY);requestAnimationFrame(()=>window.scrollTo(0,y))}}catch{}
const feedKey=KEY==='search'||KEY==='daily-brief'?'all-news':KEY;
const params=new URLSearchParams();params.set('category',feedKey);if(KEY==='search'){const q=new URLSearchParams(location.search).get('q');if(q)params.set('q',q)}
let last='',started=false;
function fp(j){return (j.news||[]).slice(0,12).map(x=>x.id||x.link||x.title).join('|')}
async function check(){if(document.visibilityState!=='visible')return;try{params.set('_refresh',String(Date.now()));const r=await fetch('/api/news?'+params.toString(),{cache:'no-store'});if(!r.ok)return;const j=await r.json(),next=fp(j);if(!next)return;if(!started){last=next;started=true;return}if(next!==last){try{sessionStorage.setItem(SCROLL_KEY,String(window.scrollY))}catch{}location.reload();return}last=next}catch{}}
setTimeout(check,1800);setInterval(check,60000);
})();
