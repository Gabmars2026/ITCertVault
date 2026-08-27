const baseHandler=require('./news-world');
const TOMS_FEED='https://www.tomshardware.com/feeds/all';
const MAX_AGE_MS=15*24*60*60*1000;
const TESTS={
  chatgpt:/\b(openai|chatgpt|gpt|codex|sora)\b/i,
  claude:/\b(anthropic|claude)\b/i,
  gemini:/\b(gemini|deepmind|google ai)\b/i,
  'ai-models':/\b(ai model|llm|reasoning model|llama|qwen|mistral|deepseek|open model|artificial intelligence)\b/i,
  'ai-video':/\b(ai video|sora|runway|veo|kling|luma|video generation)\b/i,
  'ai-images':/\b(ai image|midjourney|stable diffusion|flux|image generation|generative image)\b/i,
  coding:/\b(coding|developer|github|copilot|programming|software development|code)\b/i,
  hardware:/\b(nvidia|amd|intel|gpu|cpu|chip|semiconductor|hardware|processor|memory|ssd|motherboard|pc|laptop|data center)\b/i,
  robotics:/\b(robot|robotics|humanoid|autonomous machine)\b/i,
  business:/\b(startup|funding|acquisition|merger|enterprise|valuation|earnings|revenue|antitrust|regulation|company)\b/i,
  'it-news':/\b(cloud|software|microsoft|windows|linux|network|storage|server|data center|saas|infrastructure|database|enterprise|technology)\b/i,
  cybersecurity:/\b(cyber|security|ransomware|malware|breach|zero-day|vulnerability|exploit|hack|phishing|backdoor|fingerprint|threat|cisa)\b/i,
  sysadmin:/\b(windows server|active directory|microsoft 365|exchange|vmware|hyper-v|linux|patch|outage|backup|server|network|intune|administrator)\b/i,
  breaking:/\b(zero-day|critical vulnerability|actively exploited|ransomware|breach|major outage|hack|backdoor|launch|released|unveiled|acquisition|recall)\b/i,
  'topic-claude':/\b(anthropic|claude)\b/i,
  'topic-nvidia-earnings':/\b(nvidia|gpu|chip|semiconductor|earnings|revenue)\b/i,
  'topic-gemini':/\b(gemini|deepmind|google ai)\b/i,
  'topic-sora':/\b(sora|openai video)\b/i,
  'topic-ai-agents':/\b(ai agents?|agentic ai|autonomous agents?)\b/i,
  'tool-magai':/\bmagai\b/i,
  'tool-opusclip':/\bopus ?clip\b/i,
  'tool-codestral':/\bcodestral\b/i,
  'tool-leonardo-ai':/\bleonardo(?:\.ai| ai)\b/i,
  'tool-voicemod-ai':/\bvoicemod\b/i
};
const TECH=/\b(ai|artificial intelligence|cyber|security|nvidia|amd|intel|gpu|cpu|chip|semiconductor|hardware|software|windows|linux|cloud|server|storage|network|data center|robot|quantum|pc|laptop|processor|memory|ssd|technology)\b/i;
function decode(s=''){return String(s).replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#8217;|&#39;|&apos;/g,"'").replace(/&#8220;|&#8221;|&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>')}
function clean(s=''){return decode(s).replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()}
function tag(b,n){const m=b.match(new RegExp(`<${n}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${n}>`,'i'));return m?clean(m[1]):''}
function attr(b,re){const m=b.match(re);return m?decode(m[1]):''}
function link(b){let d=tag(b,'link');if(d&&/^https?:/i.test(d))return d;const m=b.match(/<link[^>]+href=["']([^"']+)["']/i);return m?decode(m[1]):tag(b,'guid')}
function hash(s=''){let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return h.toString(36)}
function feedImage(b){return attr(b,/<media:content[^>]+url=["']([^"']+)["']/i)||attr(b,/<enclosure[^>]+url=["']([^"']+)["'][^>]*type=["']image/i)||attr(b,/<media:thumbnail[^>]+url=["']([^"']+)["']/i)||attr(b,/<img[^>]+src=["']([^"']+)["']/i)}
function parse(xml){const blocks=[...(xml.match(/<item\b[\s\S]*?<\/item>/gi)||[]),...(xml.match(/<entry\b[\s\S]*?<\/entry>/gi)||[])];return blocks.slice(0,120).map(b=>{const title=tag(b,'title')||'Untitled technology story',url=link(b),description=(tag(b,'description')||tag(b,'summary')||tag(b,'content')).slice(0,340)||'Latest technology news from Tom\'s Hardware.',date=tag(b,'pubDate')||tag(b,'published')||tag(b,'updated')||new Date().toISOString();let publishedAt;try{publishedAt=new Date(date).toISOString()}catch{publishedAt=new Date().toISOString()}return{id:'th-'+hash(title+url),title,link:url,source:"Tom's Hardware",publishedAt,description,image:feedImage(b)}}).filter(x=>/^https?:\/\//i.test(x.link))}
async function getFeed(){const c=new AbortController(),t=setTimeout(()=>c.abort(),3000);try{const r=await fetch(TOMS_FEED,{signal:c.signal,redirect:'follow',headers:{'user-agent':'Mozilla/5.0 AI-News-Now/6.0','accept':'application/rss+xml,application/atom+xml,application/xml,text/xml;q=0.9,*/*;q=0.5'}});if(!r.ok)throw Error(String(r.status));return parse(await r.text())}catch{return[]}finally{clearTimeout(t)}}
function recent(n){const t=+new Date(n.publishedAt),age=Date.now()-t;return Number.isFinite(t)&&age>=-60*60*1000&&age<=MAX_AGE_MS}
function text(n){return `${n.title} ${n.description}`}
function keep(n,category,q){const s=text(n);if(!recent(n)||!TECH.test(s))return false;if(q&&!s.toLowerCase().includes(q.toLowerCase()))return false;const re=TESTS[category];return re?re.test(s):true}
function key(n){return n.title.toLowerCase().replace(/\s+-\s+[^-]{2,60}$/,'').replace(/[^a-z0-9]+/g,' ').trim().split(' ').slice(0,13).join(' ')}
function topic(n){const s=text(n);if(/cyber|security|ransomware|malware|breach|zero-day|vulnerab|exploit|hack|backdoor/i.test(s))return'Cyber';if(/nvidia|amd|intel|gpu|cpu|chip|semiconductor|hardware|processor|memory|ssd/i.test(s))return'Hardware';if(/windows|linux|server|cloud|network|storage|infrastructure/i.test(s))return'IT';if(/ai|artificial intelligence|model|agent/i.test(s))return'AI';return'Tech'}
function why(n){const t=topic(n);if(t==='Cyber')return'This may affect security exposure, defenses, users or incident response.';if(t==='Hardware')return'This may affect chips, devices, performance, pricing or computing infrastructure.';if(t==='IT')return'This may affect enterprise systems, administrators, cloud services or infrastructure.';if(t==='AI')return'This may affect AI capabilities, products, developer workflows or adoption.';return'This is a current technology development with potential industry impact.'}
function imageRoute(n,i,origin){const p=new URLSearchParams({article:n.link,seed:n.id||hash(n.title+n.link+i),title:n.title.slice(0,100),variant:'toms-'+i});if(/^https?:\/\//i.test(n.image||''))p.set('image',n.image);return `${origin}/api/article-image?${p.toString()}`}
function getBase(req){return new Promise(resolve=>{let settled=false;const finish=x=>{if(!settled){settled=true;resolve(x||{news:[]})}};const res={setHeader(){},status(){return this},json:finish};Promise.resolve(baseHandler(req,res)).catch(()=>finish({news:[]}));setTimeout(()=>finish({news:[]}),6500)})}
module.exports=async function(req,res){
  res.setHeader('Cache-Control','public, max-age=20, stale-while-revalidate=60');
  res.setHeader('CDN-Cache-Control','public, max-age=30, stale-while-revalidate=60');
  res.setHeader('Vercel-CDN-Cache-Control','public, max-age=30, stale-while-revalidate=60');
  const category=String(req.query?.category||'home').toLowerCase(),q=String(req.query?.q||'').trim().slice(0,120);
  const [base,toms]=await Promise.all([getBase(req),getFeed()]);
  const proto=String(req.headers['x-forwarded-proto']||'https').split(',')[0].trim(),host=String(req.headers['x-forwarded-host']||req.headers.host||'').split(',')[0].trim(),origin=host?`${proto}://${host}`:'https://cert-forge-git-ai-news-now-site-cloud-drive.vercel.app';
  const extra=toms.filter(n=>keep(n,category,q)).map((n,i)=>({...n,topic:topic(n),whyItMatters:why(n),image:imageRoute(n,i,origin)}));
  const seen=new Set(),merged=[];
  for(const n of [...(base.news||[]),...extra].sort((a,b)=>+new Date(b.publishedAt)-+new Date(a.publishedAt))){const k=key(n);if(!k||seen.has(k))continue;seen.add(k);merged.push(n)}
  const max=category==='all-news'?90:60,news=merged.slice(0,max).map((n,i)=>({...n,importance:Math.max(1,100-i)}));
  const sourceCounts=news.reduce((a,n)=>(a[n.source]=(a[n.source]||0)+1,a),{});
  res.status(200).json({...base,updatedAt:new Date().toISOString(),refreshSeconds:60,maxAgeDays:15,category,query:q,count:news.length,ranking:'newest-first-worldwide-tech-only',sourceCounts,news});
};
