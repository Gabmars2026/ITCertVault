(()=>{
const root=document.getElementById('app');if(!root)return;
let scheduled=0,serial=0;
const enc=v=>encodeURIComponent(String(v||''));
function articleFor(img){const box=img.closest('article,.breakitem,.pop,.brief-story,.brief-lead,.hero');if(!box)return'';for(const a of box.querySelectorAll('a[href]')){try{const u=new URL(a.href,location.href);if(/^https?:$/.test(u.protocol)&&u.origin!==location.origin)return u.href}catch{}}return''}
function titleFor(img){return (img.closest('article,.breakitem,.pop,.brief-story,.brief-lead,.hero')?.querySelector('h1,h2,h3,strong')?.textContent||'News').trim().slice(0,100)}
function normalized(src){try{const u=new URL(src,location.href);u.hash='';return u.href}catch{return src||''}}
function stableKey(img){const article=articleFor(img),title=titleFor(img);return article||title||img.getAttribute('src')||''}
function replaceOnce(img,variant){if(img.dataset.imageLocked==='1')return;const article=articleFor(img),title=titleFor(img),seed=stableKey(img);img.dataset.imageLocked='1';img.removeAttribute('srcset');img.removeAttribute('sizes');img.src=`/api/article-image?article=${enc(article)}&seed=${enc(seed)}&title=${enc(title)}&variant=${variant}`}
function scan(){scheduled=0;const seen=new Set();const imgs=[...root.querySelectorAll('img')];for(const img of imgs){if(!img.isConnected||img.dataset.imageScanned==='1')continue;img.dataset.imageScanned='1';const src=normalized(img.currentSrc||img.src);if(!src)continue;if(seen.has(src)){replaceOnce(img,(++serial)%7)}else{seen.add(src);img.dataset.imageLocked='1'}}}
function schedule(){if(scheduled)return;scheduled=setTimeout(scan,120)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
const obs=new MutationObserver(ms=>{let hasNew=false;for(const m of ms){for(const n of m.addedNodes){if(n.nodeType!==1)continue;if(n.tagName==='IMG'||n.querySelector?.('img:not([data-image-scanned="1"])')){hasNew=true;break}}if(hasNew)break}if(hasNew)schedule()});
obs.observe(root,{childList:true,subtree:true});
window.addEventListener('load',schedule,{once:true});
})();
