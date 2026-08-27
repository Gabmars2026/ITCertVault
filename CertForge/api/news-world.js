const techFeeds=[
  {source:'TechCrunch',url:'https://techcrunch.com/feed/'},
  {source:'The Verge',url:'https://www.theverge.com/rss/index.xml'},
  {source:'BBC Technology',url:'https://feeds.bbci.co.uk/news/technology/rss.xml'},
  {source:'Engadget',url:'https://www.engadget.com/rss.xml'},
  {source:'Ars Technica',url:'https://feeds.arstechnica.com/arstechnica/index'},
  {source:'The Register',url:'https://www.theregister.com/headlines.atom'},
  {source:'TechPowerUp',url:'https://www.techpowerup.com/rss/news'}
];
const securityFeeds=[
  {source:'BleepingComputer',url:'https://www.bleepingcomputer.com/feed/'},
  {source:'The Hacker News',url:'https://thehackernews.com/feeds/posts/default'},
  {source:'SecurityWeek',url:'https://www.securityweek.com/feed/'},
  {source:'Ars Technica Security',url:'https://arstechnica.com/security/feed/'}
];
const sysadminFeed={source:'r/sysadmin',url:'https://www.reddit.com/r/sysadmin/.rss'};
const MAX_AGE_MS=15*24*60*60*1000;

const queries={
  home:'("technology" OR "artificial intelligence" OR cybersecurity OR semiconductor OR software OR hardware OR robotics OR "cloud computing" OR "data center" OR smartphone OR quantum) when:15d -stocks -stock -investing -investment -dividend',
  'all-news':'("technology" OR "artificial intelligence" OR cybersecurity OR semiconductor OR software OR hardware OR robotics OR "cloud computing" OR "data center" OR smartphone OR quantum) when:15d -stocks -stock -investing -investment -dividend',
  breaking:'("breaking technology" OR "zero-day" OR ransomware OR "major outage" OR "cyber attack" OR acquisition OR "AI launch" OR "chip launch") when:2d',
  chatgpt:'(ChatGPT OR OpenAI OR GPT OR Codex OR Sora) when:15d',
  claude:'(Claude OR Anthropic) when:15d',
  gemini:'(Gemini OR "Google AI" OR DeepMind) when:15d',
  'ai-models':'("AI model" OR LLM OR "reasoning model" OR Llama OR Qwen OR Mistral OR DeepSeek) when:15d',
  'ai-video':'("AI video" OR Sora OR Runway OR Veo OR Kling OR Luma OR Higgsfield) when:15d',
  'ai-images':'("AI image" OR Midjourney OR "Stable Diffusion" OR Flux OR "image generation") when:15d',
  coding:'("AI coding" OR "coding agent" OR Copilot OR Cursor OR Codex OR GitHub) when:15d',
  hardware:'(Nvidia OR AMD OR Intel OR GPU OR semiconductor OR "AI chip" OR hardware OR "data center") when:15d',
  robotics:'(robotics OR humanoid OR "AI robot" OR "autonomous robot") when:15d',
  business:'((technology OR AI OR cloud OR semiconductor OR software) AND (startup OR funding OR acquisition OR merger OR enterprise OR valuation OR earnings)) when:15d',
  'it-news':'("information technology" OR "enterprise technology" OR "cloud computing" OR "enterprise software" OR Microsoft OR Windows OR Linux OR networking OR storage OR servers OR "data center" OR SaaS OR infrastructure) when:15d',
  cybersecurity:'(cybersecurity OR "cyber attack" OR ransomware OR "data breach" OR malware OR "zero-day" OR vulnerability OR CISA OR phishing OR hacking OR "threat actor") when:15d',
  sysadmin:'(sysadmin OR "system administrator" OR "Windows Server" OR "Active Directory" OR "Microsoft 365" OR "Exchange Server" OR VMware OR Hyper-V OR "Linux administration" OR patching OR outage OR backup OR "server administration") when:15d',
  'topic-claude':'(Claude OR Anthropic) when:15d',
  'topic-nvidia-earnings':'(Nvidia earnings OR Nvidia revenue OR Nvidia results) when:15d',
  'topic-gemini':'(Gemini OR "Google AI" OR DeepMind) when:15d',
  'topic-sora':'(OpenAI Sora OR "Sora video" OR "Sora AI") when:15d',
  'topic-ai-agents':'("AI agents" OR "agentic AI" OR "autonomous AI agents") when:15d',
  'tool-magai':'(Magai OR "Magai AI") when:15d',
  'tool-opusclip':'(OpusClip OR "Opus Clip") when:15d',
  'tool-codestral':'(Codestral OR "Mistral Codestral") when:15d',
  'tool-leonardo-ai':'("Leonardo AI" OR "Leonardo.Ai") when:15d',
  'tool-voicemod-ai':'(Voicemod OR "Voicemod AI") when:15d'
};

const regions=[
  {name:'US',hl:'en-US',gl:'US',ceid:'US:en'},
  {name:'UK',hl:'en-GB',gl:'GB',ceid:'GB:en'},
  {name:'India',hl:'en-IN',gl:'IN',ceid:'IN:en'}
];

const FINANCE_SPAM=/(should you buy|is .{0,40} a buy\??|stocks? to buy|buy .{0,45} stock|stock pick|price target|wall street (?:says|thinks|analyst)|could make you (?:a )?millionaire|dividend stock|portfolio pick|investors? should|motley fool|investorplace|seeking alpha|benzinga|marketbeat|zacks|tipranks|fool\.com|buy today|best ai stock)/i;
const NON_TECH_NOISE=/(school district|high school|classroom|university workshop|hosts? .* workshop|pastor|church|dental|psychiatric|recipe|celebrity|horoscope|real estate listing|fashion week)/i;
const TECH=/\b(ai|artificial intelligence|openai|chatgpt|anthropic|claude|gemini|deepmind|microsoft|windows|linux|apple|iphone|android|google|meta|nvidia|amd|intel|amazon|aws|oracle|cisco|cloudflare|github|cybersecurity|ransomware|malware|zero-day|vulnerability|data breach|cloud|data center|server|semiconductor|chip|gpu|software|hardware|robotics|robot|quantum|network|networking|5g|satellite|database|saas|developer|coding|programming|security|technology)\b/i;
const categoryTest={
  chatgpt:/\b(openai|chatgpt|gpt|codex|sora)\b/i,
  claude:/\b(anthropic|claude)\b/i,
  gemini:/\b(gemini|deepmind|google ai)\b/i,
  'ai-models':/\b(ai model|llm|reasoning model|llama|qwen|mistral|deepseek|open model)\b/i,
  'ai-video':/\b(ai video|sora|runway|veo|kling|luma|higgsfield|video generation)\b/i,
  'ai-images':/\b(ai image|midjourney|stable diffusion|flux|image generation|generative image)\b/i,
  coding:/\b(coding|developer|github|copilot|cursor|codex|programming|software development)\b/i,
  hardware:/\b(nvidia|amd|intel|gpu|chip|semiconductor|hardware|data center|processor|cpu|accelerator)\b/i,
  robotics:/\b(robot|robotics|humanoid|autonomous machine)\b/i,
  business:/\b(startup|funding|acquisition|merger|enterprise|valuation|earnings|revenue|antitrust|regulation)\b/i,
  'it-news':/\b(information technology|enterprise technology|cloud|software|microsoft|windows|linux|network|storage|server|data center|saas|infrastructure|database)\b/i,
  cybersecurity:/\b(cyber|ransomware|malware|breach|zero-day|vulnerability|cisa|phishing|hacking|threat actor|security)\b/i,
  sysadmin:/\b(sysadmin|system administrator|windows server|active directory|microsoft 365|exchange|vmware|hyper-v|linux|patch|outage|backup|server|network|intune)\b/i,
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

function decode(s=''){return String(s).replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#8217;|&#39;|&apos;/g,"'").replace(/&#8220;|&#8221;|&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>')}
function clean(s=''){return decode(s).replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()}
function tag(b,n){const m=b.match(new RegExp(`<${n}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${n}>`,'i'));return m?clean(m[1]):''}
function attr(b,re){const m=b.match(re);return m?decode(m[1]):''}
function itemLink(b){let d=tag(b,'link');if(d&&/^https?:/i.test(d))return d;const m=b.match(/<link[^>]+href=["']([^"']+)["']/i);return m?decode(m[1]):tag(b,'guid')}
function hash(s){let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return h.toString(36)}
function feedImage(b){return attr(b,/<media:content[^>]+url=["']([^"']+)["']/i)||attr(b,/<enclosure[^>]+url=["']([^"']+)["'][^>]*type=["']image/i)||attr(b,/<media:thumbnail[^>]+url=["']([^"']+)["']/i)||attr(b,/<img[^>]+src=["']([^"']+)["']/i)}
function parse(xml,source){const blocks=[...(xml.match(/<item\b[\s\S]*?<\/item>/gi)||[]),...(xml.match(/<entry\b[\s\S]*?<\/entry>/gi)||[])];return blocks.slice(0,75).map(b=>{const title=tag(b,'title')||'Untitled technology story',link=itemLink(b)||'#',description=(tag(b,'description')||tag(b,'summary')||tag(b,'content')).slice(0,340)||'Latest technology news and analysis.',date=tag(b,'pubDate')||tag(b,'published')||tag(b,'updated')||new Date().toISOString();let publishedAt;try{publishedAt=new Date(date).toISOString()}catch{publishedAt=new Date().toISOString()}return{id:hash(source+title+link),title,link,source,publishedAt,description,image:feedImage(b)}}).filter(x=>/^https?:\/\//i.test(x.link))}
async function getText(url,timeout=2300){const c=new AbortController(),t=setTimeout(()=>c.abort(),timeout);try{const r=await fetch(url,{headers:{'user-agent':'Mozilla/5.0 AI-News-Now/WorldTech-1.1','accept':'application/rss+xml,application/atom+xml,application/xml,text/xml;q=0.9,*/*;q=0.6'},signal:c.signal,redirect:'follow'});if(!r.ok)throw Error(String(r.status));return await r.text()}finally{clearTimeout(t)}}
async function load(feed){try{return parse(await getText(feed.url),feed.source)}catch{return[]}}
function googleFeed(q,r){return{source:`Google News · ${r.name}`,url:`https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=${r.hl}&gl=${r.gl}&ceid=${encodeURIComponent(r.ceid)}`}}
function textOf(n){return `${n.title} ${n.description} ${n.source}`}
function recent(n){const t=+new Date(n.publishedAt),age=Date.now()-t;return Number.isFinite(t)&&age>=-60*60*1000&&age<=MAX_AGE_MS}
function keep(n,category){const t=textOf(n);if(!recent(n))return false;if(FINANCE_SPAM.test(t))return false;if(NON_TECH_NOISE.test(t)&&!TECH.test(t))return false;if(!TECH.test(t))return false;const re=categoryTest[category];return re?re.test(t):true}
function dedupeKey(n){return n.title.toLowerCase().replace(/\s+-\s+[^-]{2,60}$/,'').replace(/[^a-z0-9]+/g,' ').trim().split(' ').slice(0,13).join(' ')}
function topic(n){const t=textOf(n);if(/cyber|ransomware|malware|breach|zero-day|vulnerab|phishing|hack|security/i.test(t))return'Cyber';if(/nvidia|amd|intel|gpu|chip|semiconductor|hardware|processor|data center/i.test(t))return'Hardware';if(/windows|linux|server|active directory|cloud|network|storage|database|infrastructure/i.test(t))return'IT';if(/openai|chatgpt|anthropic|claude|gemini|deepmind|artificial intelligence|\bai\b|llm|model/i.test(t))return'AI';if(/robot/i.test(t))return'Robotics';return'Tech'}
function why(n){const k=topic(n);if(k==='Cyber')return'This may affect security exposure, defenses or incident response.';if(k==='Hardware')return'This may affect computing capacity, chips, devices or data-center infrastructure.';if(k==='IT')return'This may affect enterprise systems, cloud services, administrators or infrastructure.';if(k==='AI')return'This may change AI capabilities, products, developer workflows or adoption.';if(k==='Robotics')return'This may affect automation, manufacturing or autonomous systems.';return'This is a current technology development with potential global industry impact.'}
function imageFor(n,i,origin){const p=new URLSearchParams({article:String(n.link||''),seed:String(n.id||hash(n.title+n.link+i)),title:String(n.title||'Technology news').slice(0,100),variant:String(i)});if(/^https?:\/\//i.test(n.image||''))p.set('image',n.image);return `${origin}/api/article-image?${p.toString()}`}
function selectFeeds(category,q){const query=q?`"${q}" technology when:15d`:(queries[category]||queries.home);const google=regions.map(r=>googleFeed(query,r));if(category==='cybersecurity'||category==='breaking')return[...google,...securityFeeds];if(category==='sysadmin')return[...google,sysadminFeed,...securityFeeds.slice(0,2),techFeeds[4],techFeeds[5]];if(category==='it-news')return[...google,techFeeds[2],techFeeds[3],techFeeds[4],techFeeds[5],techFeeds[6]];if(category==='all-news'||category==='home')return[...google,...techFeeds,...securityFeeds.slice(0,2)];if(['hardware','robotics','business','coding'].includes(category))return[...google,...techFeeds];return[...google,...techFeeds.slice(0,4)]}

module.exports=async function(req,res){
  res.setHeader('Cache-Control','public, max-age=20, stale-while-revalidate=90');
  res.setHeader('CDN-Cache-Control','public, max-age=30, stale-while-revalidate=120');
  res.setHeader('Vercel-CDN-Cache-Control','public, max-age=30, stale-while-revalidate=120');
  const category=String(req.query?.category||'home').toLowerCase(),query=String(req.query?.q||'').trim().slice(0,120);
  const feeds=selectFeeds(category,query),raw=(await Promise.all(feeds.map(load))).flat(),seen=new Set();
  let news=raw.filter(n=>keep(n,category)).filter(n=>{const k=dedupeKey(n);if(!k||seen.has(k))return false;seen.add(k);return true}).sort((a,b)=>+new Date(b.publishedAt)-+new Date(a.publishedAt));
  const max=category==='all-news'?90:60;news=news.slice(0,max);
  const proto=String(req.headers['x-forwarded-proto']||'https').split(',')[0].trim(),host=String(req.headers['x-forwarded-host']||req.headers.host||'').split(',')[0].trim(),origin=host?`${proto}://${host}`:'https://cert-forge-git-ai-news-now-site-cloud-drive.vercel.app';
  news=news.map((n,i)=>({...n,topic:topic(n),importance:Math.max(1,100-i),whyItMatters:why(n),image:imageFor(n,i,origin)}));
  const sourceCounts=news.reduce((a,n)=>(a[n.source]=(a[n.source]||0)+1,a),{});
  res.status(200).json({updatedAt:new Date().toISOString(),refreshSeconds:60,maxAgeDays:15,category,query,count:news.length,ranking:'newest-first-worldwide-tech-only',sourceCounts,news});
};