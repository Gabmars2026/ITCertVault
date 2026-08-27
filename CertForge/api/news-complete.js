const baseHandler=require('./news-plus');
const MAX_AGE_MS=15*24*60*60*1000;
const ARCHIVE_LIMIT=450;
function decode(s=''){return String(s).replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#8217;|&#39;|&apos;/g,"'").replace(/&#8220;|&#8221;|&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>')}
function clean(s=''){return decode(s).replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()}
function tag(b,n){const m=b.match(new RegExp(`<${n}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${n}>`,'i'));return m?clean(m[1]):''}
function link(b){let d=tag(b,'link');if(d&&/^https?:/i.test(d))return d;const m=b.match(/<link[^>]+href=["']([^"']+)["']/i);return m?decode(m[1]):tag(b,'guid')}
function hash(s=''){let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return h.toString(36)}
function parse(xml){const blocks=[...(xml.match(/<item\b[\s\S]*?<\/item>/gi)||[]),...(xml.match(/<entry\b[\s\S]*?<\/entry>/gi)||[])];return blocks.slice(0,100).map(b=>{const title=tag(b,'title')||'Untitled security story',url=link(b),description=(tag(b,'description')||tag(b,'summary')||tag(b,'content')).slice(0,340)||'Latest cybersecurity news from Cybernews.',date=tag(b,'pubDate')||tag(b,'published')||tag(b,'updated')||new Date().toISOString();let publishedAt;try{publishedAt=new Date(date).toISOString()}catch{publishedAt=new Date().toISOString()}return{id:'cn-'+hash(title+url),title,link:url,source:'Cybernews',publishedAt,description}}).filter(x=>/^https?:\/\//i.test(x.link))}
async function cybernewsFeed(){const q='site:cybernews.com (security OR cybersecurity OR cybercrime OR ransomware OR malware OR vulnerability OR breach OR hacking OR threat OR critical infrastructure) when:15d';const url=`https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`;const c=new AbortController(),t=setTimeout(()=>c.abort(),3000);try{const r=await fetch(url,{signal:c.signal,redirect:'follow',headers:{'user-agent':'Mozilla/5.0 AI-News-Now/6.3','accept':'application/rss+xml,application/xml,text/xml;q=0.9,*/*;q=0.5'}});if(!r.ok)throw Error(String(r.status));return parse(await r.text())}catch{return[]}finally{clearTimeout(t)}}
function recent(n){const ts=+new Date(n.publishedAt),age=Date.now()-ts;return Number.isFinite(ts)&&age>=-60*60*1000&&age<=MAX_AGE_MS}
function security(n){return /cyber|security|ransomware|malware|breach|zero.?day|vulnerab|exploit|hack|phishing|backdoor|threat|critical infrastructure/i.test((n.title||'')+' '+(n.description||''))}
function key(n){return String(n.title||'').toLowerCase().replace(/\s+-\s+[^-]{2,60}$/,'').replace(/[^a-z0-9]+/g,' ').trim().split(' ').slice(0,13).join(' ')}
function imageRoute(n,i,origin){const p=new URLSearchParams({article:n.link,seed:n.id||hash(n.title+n.link+i),title:String(n.title||'Cybernews').slice(0,100),variant:'cybernews-'+i});return `${origin}/api/article-image?${p.toString()}`}
function getBase(req){return new Promise(resolve=>{let done=false;const finish=x=>{if(!done){done=true;resolve(x||{news:[]})}};const res={setHeader(){},status(){return this},json:finish};Promise.resolve(baseHandler(req,res)).catch(()=>finish({news:[]}));setTimeout(()=>finish({news:[]}),7000)})}
module.exports=async function(req,res){
  res.setHeader('Cache-Control','public, max-age=20, stale-while-revalidate=60');
  res.setHeader('CDN-Cache-Control','public, max-age=30, stale-while-revalidate=60');
  res.setHeader('Vercel-CDN-Cache-Control','public, max-age=30, stale-while-revalidate=60');
  const category=String(req.query?.category||'home').toLowerCase(),q=String(req.query?.q||'').trim().slice(0,120);
  const [base,cyber]=await Promise.all([getBase(req),cybernewsFeed()]);
  const includeCyber=['home','all-news','cybersecurity','breaking','it-news','sysadmin','search'].includes(category)||category.startsWith('topic-');
  const proto=String(req.headers['x-forwarded-proto']||'https').split(',')[0].trim(),host=String(req.headers['x-forwarded-host']||req.headers.host||'').split(',')[0].trim(),origin=host?`${proto}://${host}`:'https://cert-forge-git-ai-news-now-site-cloud-drive.vercel.app';
  const extra=includeCyber?cyber.filter(recent).filter(n=>!q||((n.title+' '+n.description).toLowerCase().includes(q.toLowerCase()))).filter(security).map((n,i)=>({...n,topic:'Cyber',whyItMatters:'This may affect security exposure, defenses, users, data or incident response.',image:imageRoute(n,i,origin)})):[];
  const seen=new Set(),merged=[];
  for(const n of [...(base.news||[]),...extra].sort((a,b)=>+new Date(b.publishedAt)-+new Date(a.publishedAt))){const k=key(n);if(!k||seen.has(k))continue;seen.add(k);merged.push(n);if(merged.length>=ARCHIVE_LIMIT)break}
  const news=merged.map((n,i)=>({...n,importance:Math.max(1,ARCHIVE_LIMIT-i)}));
  const sourceCounts=news.reduce((a,n)=>(a[n.source]=(a[n.source]||0)+1,a),{});
  res.status(200).json({...base,updatedAt:new Date().toISOString(),refreshSeconds:60,maxAgeDays:15,category,query:q,count:news.length,ranking:'newest-first-worldwide-tech-only',sourceCounts,news});
};