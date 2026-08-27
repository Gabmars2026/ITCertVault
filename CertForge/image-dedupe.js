(()=>{
const root=document.getElementById('app');if(!root)return;
const seen=new Map();let timer=0,serial=0;
const enc=v=>encodeURIComponent(String(v||''));
function articleFor(img){const box=img.closest('article,.breakitem,.pop,.brief-story,.brief-lead,.hero');if(!box)return'';for(const a of box.querySelectorAll('a[href]')){try{const u=new URL(a.href,location.href);if(/^https?:$/.test(u.protocol)&&u.origin!==location.origin)return u.href}catch{}}return''}
function titleFor(img){return (img.closest('article,.breakitem,.pop,.brief-story,.brief-lead,.hero')?.querySelector('h1,h2,h3,strong')?.textContent||'News').trim().slice(0,100)}
function normalize(src){try{const u=new URL(src,location.href);u.hash='';return u.href}catch{return src||''}}
function replaceDuplicate(img){if(img.dataset.dedupeReplacement==='1')return;const article=articleFor(img),title=titleFor(img);img.dataset.dedupeReplacement='1';img.removeAttribute('srcset');img.src=`/api/article-image?article=${enc(article)}&seed=${enc(location.pathname+'|'+title+'|'+(++serial))}&title=${enc(title)}&variant=${serial%5}`}
function scan(){timer=0;seen.clear();const imgs=[...root.querySelectorAll('img')];for(const img of imgs){if(!img.isConnected)continue;const src=normalize(img.currentSrc||img.src);if(!src)continue;const first=seen.get(src);if(first&&first!==img&&first.isConnected)replaceDuplicate(img);else seen.set(src,img)}}
function schedule(){clearTimeout(timer);timer=setTimeout(scan,220)}
const obs=new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes){if(n.nodeType===1&&(n.tagName==='IMG'||n.querySelector?.('img'))){schedule();return}}});obs.observe(root,{childList:true,subtree:true});
window.addEventListener('load',schedule,{once:true});schedule();
})();