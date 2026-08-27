const mainNewsHandler=require('./news');
const SOURCES={
  'bleepingcomputer':{name:'BleepingComputer',feed:'https://www.bleepingcomputer.com/feed/',site:'bleepingcomputer.com',query:'(cybersecurity OR security OR Microsoft OR Windows OR technology)',refreshSeconds:60},
  'hacker-news':{name:'The Hacker News',feed:'https://thehackernews.com/feeds/posts/default',site:'thehackernews.com',query:'(cybersecurity OR hacking OR malware OR vulnerability OR ransomware)',refreshSeconds:60},
  'securityweek':{name:'SecurityWeek',feed:'https://www.securityweek.com/feed/',site:'securityweek.com',query:'(cybersecurity OR vulnerability OR breach OR malware OR CISA OR security technology)',refreshSeconds:60},
  'ars-security':{name:'Ars Technica Security',feed:'https://arstechnica.com/security/feed/',site:'arstechnica.com/security',query:'(security OR privacy OR hacking OR vulnerability OR malware)',refreshSeconds:60},
  'dark-reading':{name:'Dark Reading',feed:'https://www.darkreading.com/rss.xml',site:'darkreading.com',query:'(cybersecurity OR application security OR cloud security OR vulnerability OR threat intelligence OR security operations)',refreshSeconds:60},
  'the-record':{name:'The Record',feed:'https://therecord.media/feed',site:'therecord.media',query:'(cybersecurity OR cybercrime OR ransomware OR nation-state OR vulnerability OR critical infrastructure)',refreshSeconds:60},
  'cybernews':{name:'Cybernews',feed:'',site:'cybernews.com',query:'(security OR cybersecurity OR cybercrime OR ransomware OR malware OR vulnerability OR breach OR hacking OR threat OR critical infrastructure)',refreshSeconds:60},
  'techpowerup':{name:'TechPowerUp',feed:'https://www.techpowerup.com/rss/news',site:'techpowerup.com',query:'(hardware OR GPU OR CPU OR semiconductor OR gaming hardware OR technology OR cybersecurity OR vulnerability OR security update)',refreshSeconds:60},
  'the-register':{name:'The Register',feed:'https://www.theregister.com/headlines.atom',site:'theregister.com',query:'(technology OR enterprise IT OR cloud OR security OR software OR hardware OR AI OR sysadmin)',refreshSeconds:60}
};
const MAX_AGE_MS=15*24*60*60*1000,PAGE_SIZE=30,MAX_PAGES=15,ARCHIVE_LIMIT=PAGE_SIZE*MAX_PAGES;
const PROMO=/(\bdeal\b|\boffer\b|\bcoupon\b|\bdiscount\b|\bsale\b|\blifetime\b|\bjust \$\d+|\bpay \$\d+|\bsave \$\d+|\b\d+% off\b|surfshark|babbel|headway book summaries|course deal|own \d+tb for|years of .*vpn|block ads.*\$|viewing the profile for|profile for lawrence abrams)/i;
function decode(s=''){return String(s).replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#8217;|&#39;|&apos;/g,"'").replace(/&#8220;|&#8221;|&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>')}
function clean(s=''){return decode(s).replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()}
function tag(b,n){const m=b.match(new RegExp(`<${n}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${n}>`,'i'));return m?clean(m[1]):''}
function attr(b,re){const m=b.match(re);return m?decode(m[1]):''}
function link(b){let d=tag(b,'link');if(d&&/^https?:/i.test(d))return d;let m=b.match(/<link[^>]+href=["']([^"']+)["']/i);return m?decode(m[1]):tag(b,'guid')}
function hash(s){let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return h.toString(36)}
function feedImage(b){return attr(b,/<media:content[^>]+url=["']([^"']+)["']/i)||attr(b,/<enclosure[^>]+url=["']([^"']+)["'][^>]*type=["']image/i)||attr(b,/<media:thumbnail[^>]+url=["']([^"']+)["']/i)||attr(b,/<img[^>]+src=["']([^"']+)["']/i)}
function parse(xml,source){const blocks=[...(xml.match(/<item\b[\s\S]*?<\/item>/gi)||[]),...(xml.match(/<entry\b[\s\S]*?<\/entry>/gi)||[])];return blocks.slice(0,220).map(b=>{const title=tag(b,'title')||'Untitled story',url=link(b)||'#',description=(tag(b,'description')||tag(b,'summary')||tag(b,'content')).slice(0,340)||'Latest technology and security news.',date=tag(b,'pubDate')||tag(b,'published')||tag(b,'updated')||new Date().toISOString();let publishedAt;try{publishedAt=new Date(date).toISOString()}catch{publishedAt=new Date().toISOString()}return{id:hash(source+title+url),title,link:url,source,publishedAt,description,image:feedImage(b)}}).filter(x=>/^https?:\/\//i.test(x.link))}
async function getText(url,timeout=3500){const c=new AbortController(),t=setTimeout(()=>c.abort(),timeout);try{const r=await fetch(url,{signal:c.signal,redirect:'follow',headers:{'user-agent':'Mozilla/5.0 AI-News-Now/6.8','accept':'application/rss+xml,application/atom+xml,application/xml,text/xml,text/html;q=0.8,*/*;q=0.6'}});if(!r.ok)throw Error(String(r.status));return await r.text()}finally{clearTimeout(t)}}
function googleUrl(cfg,region='US'){const map={US:['en-US','US','US:en'],UK:['en-GB','GB','GB:en'],IN:['en-IN','IN','IN:en']},r=map[region]||map.US,q=`site:${cfg.site} ${cfg.query} when:15d`;return `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=${r[0]}&gl=${r[1]}&ceid=${encodeURIComponent(r[2])}`}
function imageKey(url=''){return String(url).toLowerCase().replace(/^https?:\/\//,'').split('?')[0].split('#')[0]}
function imageRoute(n,i,origin,direct=''){const p=new URLSearchParams({article:String(n.link||''),seed:String(n.id||hash(n.title+n.link+i)),title:String(n.title||'News').slice(0,100),variant:String(i)});if(direct)p.set('image',direct);return `${origin}/api/article-image?${p.toString()}`}
function recent(n){const t=+new Date(n.publishedAt),age=Date.now()-t;return Number.isFinite(t)&&age>=-60*60*1000&&age<=MAX_AGE_MS}
function valid(n,cfg){const raw=clean(n.title),t=raw.toLowerCase().replace(/^\(pr\)\s*/,'').replace(/\s+-\s+[^-]{2,80}$/,'').trim(),s=cfg.name.toLowerCase().trim();if(!t||t.length<8)return false;if(PROMO.test(raw))return false;if(t===s)return false;if(t.replace(/[^a-z0-9]+/g,'')===s.replace(/[^a-z0-9]+/g,''))return false;return true}
const STOP=new Set('the a an and or of to in on for with from by as is are was were has have had its this that new latest news report reports'.split(' '));
function titleTokens(title=''){return new Set(clean(title).toLowerCase().replace(/^\(pr\)\s*/,'').replace(/\s+-\s+[^-]{2,80}$/,'').replace(/[^a-z0-9$]+/g,' ').split(' ').filter(x=>x.length>2&&!STOP.has(x)).slice(0,22))}
function sameStory(a,b){const A=titleTokens(a.title),B=titleTokens(b.title);if(!A.size||!B.size)return false;let hit=0;for(const x of A)if(B.has(x))hit++;return hit>=3&&hit/Math.min(A.size,B.size)>=.55}
function dedupePreferDirect(direct,google){const out=[];for(const n of [...direct,...google]){if(out.some(x=>sameStory(x,n)))continue;out.push(n);if(out.length>=ARCHIVE_LIMIT)break}return out}
function clampPage(v){const n=parseInt(v,10);return Number.isFinite(n)?Math.min(MAX_PAGES,Math.max(1,n)):1}
function fallbackCategory(key){if(key==='techpowerup')return'hardware';if(key==='the-register')return'it-news';return'cybersecurity'}
function archiveFallback(req,key,cfg){return new Promise(resolve=>{let done=false;const finish=x=>{if(done)return;done=true;const news=(x?.news||[]).filter(n=>String(n.source||'').toLowerCase()===cfg.name.toLowerCase()).filter(n=>valid(n,cfg));resolve(news)};const fakeReq={...req,query:{category:fallbackCategory(key),page:1}};const fakeRes={setHeader(){},status(){return this},json:finish};Promise.resolve(mainNewsHandler(fakeReq,fakeRes)).catch(()=>finish({news:[]}));setTimeout(()=>finish({news:[]}),8000)})}
module.exports=async function(req,res){
  res.setHeader('Cache-Control','public, max-age=20, stale-while-revalidate=60');
  res.setHeader('CDN-Cache-Control','public, max-age=30, stale-while-revalidate=60');
  res.setHeader('Vercel-CDN-Cache-Control','public, max-age=30, stale-while-revalidate=60');
  const key=String(req.query?.source||'').toLowerCase(),cfg=SOURCES[key];
  if(!cfg)return res.status(404).json({error:'Unknown source'});
  const jobs=[cfg.feed?getText(cfg.feed):Promise.resolve(''),getText(googleUrl(cfg,'US'))];
  const results=await Promise.allSettled(jobs);
  const direct=cfg.feed&&results[0].status==='fulfilled'?parse(results[0].value,cfg.name).filter(recent).filter(n=>valid(n,cfg)):[];
  let google=results[1].status==='fulfilled'?parse(results[1].value,cfg.name).filter(recent).filter(n=>valid(n,cfg)):[];
  if(!direct.length&&!google.length){const alt=await Promise.allSettled([getText(googleUrl(cfg,'UK'),4300),getText(googleUrl(cfg,'IN'),4300)]);google=alt.flatMap(x=>x.status==='fulfilled'?parse(x.value,cfg.name).filter(recent).filter(n=>valid(n,cfg)):[])}
  let all=dedupePreferDirect(direct,google).sort((a,b)=>+new Date(b.publishedAt)-+new Date(a.publishedAt));
  let fallbackUsed=false;if(!all.length){all=await archiveFallback(req,key,cfg);fallbackUsed=all.length>0}
  const requestedPage=clampPage(req.query?.page),totalCount=all.length,totalPages=Math.max(1,Math.min(MAX_PAGES,Math.ceil(totalCount/PAGE_SIZE))),page=Math.min(requestedPage,totalPages),start=(page-1)*PAGE_SIZE;
  let items=all.slice(start,start+PAGE_SIZE);
  const proto=String(req.headers['x-forwarded-proto']||'https').split(',')[0].trim(),host=String(req.headers['x-forwarded-host']||req.headers.host||'').split(',')[0].trim(),origin=host?`${proto}://${host}`:'https://cert-forge-git-ai-news-now-site-cloud-drive.vercel.app';
  const usedImages=new Set();items=items.map((n,i)=>{let directImg=/^https?:\/\//i.test(n.image||'')?n.image:'',k=imageKey(directImg);if(k&&usedImages.has(k))directImg='';if(k)usedImages.add(k);return{...n,image:imageRoute(n,start+i,origin,directImg)}});
  res.status(200).json({updatedAt:new Date().toISOString(),refreshSeconds:cfg.refreshSeconds,maxAgeDays:15,source:key,name:cfg.name,count:items.length,totalCount,page,perPage:PAGE_SIZE,totalPages,maxPages:MAX_PAGES,hasPrev:page>1,hasNext:page<totalPages,fallbackUsed,ranking:'newest-first-deduped',news:items});
};