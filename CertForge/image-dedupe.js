(()=>{
/* Start before Vercel's injected preview script is parsed so visitors do not get collaboration UI. */
const stripVercel=root=>{if(!root?.querySelectorAll)return;root.querySelectorAll('script[src*="vercel.live"],vercel-live-feedback,#vercel-live-feedback,[data-vercel-toolbar],.vercel-toolbar,iframe[src*="vercel.live"],iframe[src*="vercel.com/live"]').forEach(n=>n.remove())};
stripVercel(document);new MutationObserver(m=>{for(const x of m)for(const n of x.addedNodes){if(n.nodeType===1){if(n.matches?.('script[src*="vercel.live"],vercel-live-feedback,[data-vercel-toolbar],iframe[src*="vercel.live"]'))n.remove();else stripVercel(n)}}}).observe(document.documentElement,{childList:true,subtree:true});
if(!document.querySelector('link[href="/header-balance.css"]')){const l=document.createElement('link');l.rel='stylesheet';l.href='/header-balance.css';document.head.appendChild(l)}
if(!document.querySelector('link[href="/site-upgrade.css"]')){const l=document.createElement('link');l.rel='stylesheet';l.href='/site-upgrade.css';document.head.appendChild(l)}
if(!document.querySelector('script[src="/breaking-live.js"]')){const s=document.createElement('script');s.src='/breaking-live.js';s.defer=true;document.head.appendChild(s)}
if(!document.querySelector('script[src="/site-upgrade.js"]')){const s=document.createElement('script');s.src='/site-upgrade.js';s.defer=true;document.head.appendChild(s)}
const root=document.getElementById('app');if(!root||!window.crypto?.subtle)return;
const exact=new Map(),visual=[];let scheduled=false,running=false,serial=0;
const enc=s=>encodeURIComponent(String(s||''));
function titleFor(img){const a=img.closest('article,.breakitem,.pop,.brief-story,.brief-lead,.hero');const t=a?.querySelector('h1,h2,h3,strong')?.textContent||img.alt||document.title||'News';return t.trim().slice(0,110)||'News'}
function articleFor(img){const box=img.closest('article,.breakitem,.pop,.brief-story,.brief-lead,.hero');if(!box)return'';for(const a of box.querySelectorAll('a[href]')){try{const u=new URL(a.href,location.href);if(/^https?:$/.test(u.protocol)&&u.origin!==location.origin)return u.href}catch{}}return''}
function currentVariant(img){try{const u=new URL(img.currentSrc||img.src,location.href);return Math.max(0,Number.parseInt(u.searchParams.get('variant')||'0',10)||0)}catch{return 0}}
function forget(img){for(const [k,v] of exact)if(v===img)exact.delete(k);for(let i=visual.length-1;i>=0;i--)if(visual[i].img===img)visual.splice(i,1)}
function backup(img,reason='duplicate'){
  if(!img.isConnected||img.dataset.uniqueBackup==='1')return;
  const title=titleFor(img),article=articleFor(img),seed=[location.pathname,title,++serial,reason].join('|');
  const tries=Math.max(0,Number.parseInt(img.dataset.publisherRetryCount||'0',10)||0);
  forget(img);img.removeAttribute('srcset');delete img.dataset.dedupeChecked;
  if(article&&tries<4){
    const variant=currentVariant(img)+1;
    img.dataset.publisherRetryCount=String(tries+1);
    img.src=`/api/article-image?article=${enc(article)}&seed=${enc(seed)}&title=${enc(title)}&variant=${variant}`;
    return;
  }
  img.dataset.uniqueBackup='1';
  img.dataset.dedupeChecked='1';
  img.src=`/api/article-image?fallbackOnly=1&seed=${enc(seed)}&title=${enc(title)}&variant=${serial}`;
}
function waitImage(img){if(img.complete&&img.naturalWidth>0)return Promise.resolve(true);return new Promise(resolve=>{const done=ok=>{img.removeEventListener('load',onload);img.removeEventListener('error',onerror);resolve(ok)};const onload=()=>done(true),onerror=()=>done(false);img.addEventListener('load',onload,{once:true});img.addEventListener('error',onerror,{once:true});setTimeout(()=>done(img.complete&&img.naturalWidth>0),5000)})}
async function digest(src){try{const r=await fetch(src,{cache:'force-cache',credentials:'same-origin'});if(!r.ok)return'';const b=await r.arrayBuffer();if(!b.byteLength)return'';const d=await crypto.subtle.digest('SHA-256',b);return [...new Uint8Array(d)].map(x=>x.toString(16).padStart(2,'0')).join('')}catch{return''}}
function dhash(img){try{const c=document.createElement('canvas');c.width=9;c.height=8;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(img,0,0,9,8);const p=x.getImageData(0,0,9,8).data,b=[];for(let y=0;y<8;y++){for(let col=0;col<8;col++){const i=(y*9+col)*4,j=i+4;const a=p[i]*.299+p[i+1]*.587+p[i+2]*.114,z=p[j]*.299+p[j+1]*.587+p[j+2]*.114;b.push(a>z?1:0)}}return b}catch{return null}}
function distance(a,b){if(!a||!b||a.length!==b.length)return 999;let n=0;for(let i=0;i<a.length;i++)if(a[i]!==b[i])n++;return n}
function prune(){for(const [k,v] of exact)if(!v?.isConnected||!root.contains(v))exact.delete(k);for(let i=visual.length-1;i>=0;i--)if(!visual[i].img?.isConnected||!root.contains(visual[i].img))visual.splice(i,1)}
async function check(img){if(!img.isConnected||img.dataset.dedupeChecked==='1'||img.dataset.uniqueBackup==='1')return;img.dataset.dedupeChecked='working';const ok=await waitImage(img);if(!ok||!img.isConnected){delete img.dataset.dedupeChecked;return}const src=img.currentSrc||img.src;if(!src){img.dataset.dedupeChecked='1';return}
const h=await digest(src);if(!img.isConnected)return;if(h){const first=exact.get(h);if(first&&first!==img&&first.isConnected){backup(img,'exact');return}exact.set(h,img)}
const ph=dhash(img);if(ph){for(const v of visual){if(v.img!==img&&v.img.isConnected&&distance(ph,v.hash)<=3){backup(img,'visual');return}}visual.push({hash:ph,img})}img.dataset.dedupeChecked='1'}
async function scan(){if(running)return;running=true;scheduled=false;prune();const imgs=[...root.querySelectorAll('img')].filter(i=>i.dataset.dedupeChecked!=='1'&&i.dataset.uniqueBackup!=='1');let at=0;const worker=async()=>{while(at<imgs.length){const img=imgs[at++];await check(img)}};await Promise.all(Array.from({length:Math.min(4,imgs.length||1)},worker));running=false;if([...root.querySelectorAll('img')].some(i=>!i.dataset.dedupeChecked&&!i.dataset.uniqueBackup))schedule()}
function schedule(){if(scheduled)return;scheduled=true;setTimeout(scan,450)}
new MutationObserver(m=>{for(const x of m){if(x.type==='childList'||x.type==='attributes'){schedule();break}}}).observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:['src','srcset']});
window.addEventListener('load',schedule,{once:true});schedule();
})();
