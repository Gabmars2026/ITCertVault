const SOURCES={
  'bleepingcomputer':{name:'BleepingComputer',feed:'https://www.bleepingcomputer.com/feed/',site:'bleepingcomputer.com',query:'(cybersecurity OR security OR Microsoft OR Windows OR technology)'},
  'hacker-news':{name:'The Hacker News',feed:'https://thehackernews.com/feeds/posts/default',site:'thehackernews.com',query:'(cybersecurity OR hacking OR malware OR vulnerability OR ransomware)'},
  'securityweek':{name:'SecurityWeek',feed:'https://www.securityweek.com/feed/',site:'securityweek.com',query:'(cybersecurity OR vulnerability OR breach OR malware OR CISA OR security technology)'},
  'ars-security':{name:'Ars Technica Security',feed:'https://arstechnica.com/security/feed/',site:'arstechnica.com/security',query:'(security OR privacy OR hacking OR vulnerability OR malware)'},
  'dark-reading':{name:'Dark Reading',feed:'https://www.darkreading.com/rss.xml',site:'darkreading.com',query:'(cybersecurity OR application security OR cloud security OR vulnerability OR threat intelligence OR security operations)'},
  'the-record':{name:'The Record',feed:'https://therecord.media/feed',site:'therecord.media',query:'(cybersecurity OR cybercrime OR ransomware OR nation-state OR vulnerability OR critical infrastructure)'},
  'techpowerup':{name:'TechPowerUp',feed:'https://www.techpowerup.com/rss/news',site:'techpowerup.com',query:'(hardware OR GPU OR CPU OR semiconductor OR gaming hardware OR technology)'}
};
const MAX_AGE_MS=15*24*60*60*1000;
function decode(s=''){return String(s).replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#8217;|&#39;|&apos;/g,"'").replace(/&#8220;|&#8221;|&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>')}
function clean(s=''){return decode(s).replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()}
function tag(b,n){const m=b.match(new RegExp(`<${n}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${n}>`,'i'));return m?clean(m[1]):''}
function attr(b,re){const m=b.match(re);return m?decode(m[1]):''}
function link(b){let d=tag(b,'link');if(d&&/^https?:/i.test(d))return d;let m=b.match(/<link[^>]+href=["']([^"']+)["']/i);return m?decode(m[1]):tag(b,'guid')}
function hash(s){let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return h.toString(36)}
function feedImage(b){return attr(b,/<media:content[^>]+url=["']([^"']+)["']/i)||attr(b,/<enclosure[^>]+url=["']([^"']+)["'][^>]*type=["']image/i)||attr(b,/<media:thumbnail[^>]+url=["']([^"']+)["']/i)||attr(b,/<img[^>]+src=["']([^"']+)["']/i)}
function parse(xml,source){const blocks=[...(xml.match(/<item\b[\s\S]*?<\/item>/gi)||[]),...(xml.match(/<entry\b[\s\S]*?<\/entry>/gi)||[])];return blocks.slice(0,80).map(b=>{const title=tag(b,'title')||'Untitled story',url=link(b)||'#',description=(tag(b,'description')||tag(b,'summary')||tag(b,'content')).slice(0,340)||'Latest technology and security news.',date=tag(b,'pubDate')||tag(b,'published')||tag(b,'updated')||new Date().toISOString();let publishedAt;try{publishedAt=new Date(date).toISOString()}catch{publishedAt=new Date().toISOString()}return{id:hash(source+title+url),title,link:url,source,publishedAt,description,image:feedImage(b)}}).filter(x=>/^https?:\/\//i.test(x.link))}
async function getText(url,timeout=3500){const c=new AbortController(),t=setTimeout(()=>c.abort(),timeout);try{const r=await fetch(url,{signal:c.signal,redirect:'follow',headers:{'user-agent':'Mozilla/5.0 AI-News-Now/5.1','accept':'application/rss+xml,application/atom+xml,application/xml,text/xml,text/html;q=0.8,*/*;q=0.6'}});if(!r.ok)throw Error(String(r.status));return await r.text()}finally{clearTimeout(t)}}
function googleUrl(cfg){const q=`site:${cfg.site} ${cfg.query} when:15d`;return `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`}
function imageKey(url=''){return String(url).toLowerCase().replace(/^https?:\/\//,'').split('?')[0].split('#')[0]}
function imageRoute(n,i,origin,direct=''){const p=new URLSearchParams({article:String(n.link||''),seed:String(n.id||hash(n.title+n.link+i)),title:String(n.title||'News').slice(0,100),variant:String(i)});if(direct)p.set('image',direct);return `${origin}/api/article-image?${p.toString()}`}
function recent(n){const t=+new Date(n.publishedAt),age=Date.now()-t;return Number.isFinite(t)&&age>=-60*60*1000&&age<=MAX_AGE_MS}
module.exports=async function(req,res){
  res.setHeader('Cache-Control','public, max-age=20, stale-while-revalidate=60');
  res.setHeader('CDN-Cache-Control','public, max-age=30, stale-while-revalidate=60');
  res.setHeader('Vercel-CDN-Cache-Control','public, max-age=30, stale-while-revalidate=60');
  const key=String(req.query?.source||'').toLowerCase(),cfg=SOURCES[key];
  if(!cfg)return res.status(404).json({error:'Unknown source'});
  const results=await Promise.allSettled([getText(cfg.feed),getText(googleUrl(cfg))]);
  const direct=results[0].status==='fulfilled'?parse(results[0].value,cfg.name):[];
  const google=results[1].status==='fulfilled'?parse(results[1].value,cfg.name):[];
  let items=[...direct,...google].filter(recent),seen=new Set();
  items=items.filter(n=>{const k=n.title.toLowerCase().replace(/[^a-z0-9]+/g,' ').split(' ').slice(0,12).join(' ');if(!k||seen.has(k))return false;seen.add(k);return true}).sort((a,b)=>+new Date(b.publishedAt)-+new Date(a.publishedAt)).slice(0,50);
  const proto=String(req.headers['x-forwarded-proto']||'https').split(',')[0].trim(),host=String(req.headers['x-forwarded-host']||req.headers.host||'').split(',')[0].trim(),origin=host?`${proto}://${host}`:'https://cert-forge-git-ai-news-now-site-cloud-drive.vercel.app';
  const usedImages=new Set();items=items.map((n,i)=>{let directImg=/^https?:\/\//i.test(n.image||'')?n.image:'',k=imageKey(directImg);if(k&&usedImages.has(k))directImg='';if(k)usedImages.add(k);return{...n,image:imageRoute(n,i,origin,directImg)}});
  res.status(200).json({updatedAt:new Date().toISOString(),refreshSeconds:60,maxAgeDays:15,source:key,name:cfg.name,count:items.length,news:items});
};
