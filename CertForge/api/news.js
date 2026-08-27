const baseFeeds=[
  {source:'TechCrunch',url:'https://techcrunch.com/category/artificial-intelligence/feed/'},
  {source:'The Verge',url:'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml'},
  {source:'VentureBeat',url:'https://venturebeat.com/category/ai/feed/'},
  {source:'Hugging Face',url:'https://huggingface.co/blog/feed.xml'}
];
const categoryQueries={
  breaking:'artificial intelligence when:2d',
  chatgpt:'(ChatGPT OR OpenAI OR GPT OR Codex OR Sora) when:30d',
  claude:'(Claude OR Anthropic) when:60d',
  gemini:'(Gemini OR Google DeepMind OR Google AI) when:45d',
  'ai-models':'("AI model" OR LLM OR reasoning model OR Llama OR Qwen OR Mistral OR DeepSeek) when:30d',
  'ai-video':'("AI video" OR Sora OR Runway OR Veo OR Kling OR Luma OR Higgsfield) when:60d',
  'ai-images':'("AI image" OR Midjourney OR Stable Diffusion OR Flux OR image generation) when:60d',
  coding:'("AI coding" OR coding agent OR Copilot OR Cursor OR Codex OR GitHub AI) when:45d',
  hardware:'(Nvidia OR AMD OR Intel OR GPU OR "AI chip" OR "AI hardware" OR data center) when:30d',
  robotics:'("AI robot" OR robotics OR humanoid OR autonomous robot) when:60d',
  business:'("AI startup" OR "AI funding" OR "AI business" OR acquisition OR valuation OR enterprise AI) when:30d',
  'topic-claude':'(Claude OR Anthropic) when:90d',
  'topic-nvidia-earnings':'(Nvidia earnings OR Nvidia revenue OR Nvidia results OR Nvidia stock) when:90d',
  'topic-gemini':'(Google Gemini OR Gemini AI OR Google DeepMind) when:90d',
  'topic-sora':'(OpenAI Sora OR Sora video OR Sora AI) when:90d',
  'topic-ai-agents':'("AI agents" OR agentic AI OR autonomous AI agents OR AI agent) when:60d',
  'tool-magai':'(Magai OR "Magai AI") when:365d',
  'tool-opusclip':'(OpusClip OR "Opus Clip" OR "OpusClip AI") when:365d',
  'tool-codestral':'(Codestral OR "Mistral Codestral") when:365d',
  'tool-leonardo-ai':'("Leonardo AI" OR "Leonardo.Ai") when:365d',
  'tool-voicemod-ai':'(Voicemod OR "Voicemod AI") when:365d',
  'all-news':'artificial intelligence when:7d',
  home:'artificial intelligence when:7d'
};
const fallbackImages=[
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1800&q=90',
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1800&q=90',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1800&q=90',
  'https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=1800&q=90',
  'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=1800&q=90',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1800&q=90'
];
const fallback=[
  ['AI infrastructure spending continues to accelerate across the industry','https://www.nvidia.com/en-us/','NVIDIA',18,'Chipmakers, cloud providers and model labs continue investing heavily in next-generation AI compute infrastructure.',fallbackImages[2]],
  ['New multimodal AI systems push toward more capable assistants','https://openai.com/news/','OpenAI',43,'The latest generation of AI assistants increasingly combines text, vision, tools and long-running tasks.',fallbackImages[0]],
  ['Developers adopt coding agents for larger software tasks','https://github.blog/ai-and-ml/','GitHub',75,'Agentic coding tools are moving from autocomplete toward planning, editing, testing and reviewing complete changes.',fallbackImages[3]],
  ['Open-weight model ecosystem keeps expanding','https://huggingface.co/blog','Hugging Face',138,'New open models are giving developers more choices for local inference, fine-tuning and private deployments.',fallbackImages[1]],
  ['Generative video competition drives better creator tools','https://deepmind.google/models/veo/','Google',186,'AI video systems are improving consistency, control and production workflows for creators.',fallbackImages[5]]
].map((x,i)=>({id:'fallback-'+i,title:x[0],link:x[1],source:x[2],publishedAt:new Date(Date.now()-x[3]*60000).toISOString(),description:x[4],image:x[5]}));
function decode(s=''){return String(s).replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#8217;|&#39;|&apos;/g,"'").replace(/&#8220;|&#8221;|&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>')}
function clean(s=''){return decode(s).replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()}
function tag(b,n){const m=b.match(new RegExp(`<${n}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${n}>`,'i'));return m?clean(m[1]):''}
function attr(b,re){const m=b.match(re);return m?decode(m[1]):''}
function link(b){let d=tag(b,'link');if(d&&/^https?:/i.test(d))return d;let m=b.match(/<link[^>]+href=["']([^"']+)["']/i);return m?decode(m[1]):tag(b,'guid')}
function hash(s){let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return h.toString(36)}
function feedImage(b){return attr(b,/<media:content[^>]+url=["']([^"']+)["']/i)||attr(b,/<enclosure[^>]+url=["']([^"']+)["'][^>]*type=["']image/i)||attr(b,/<enclosure[^>]+type=["']image[^"']*["'][^>]+url=["']([^"']+)["']/i)||attr(b,/<media:thumbnail[^>]+url=["']([^"']+)["']/i)||attr(b,/<img[^>]+src=["']([^"']+)["']/i)}
function parse(xml,source){let blocks=[...(xml.match(/<item\b[\s\S]*?<\/item>/gi)||[]),...(xml.match(/<entry\b[\s\S]*?<\/entry>/gi)||[])];return blocks.slice(0,70).map(b=>{let title=tag(b,'title')||'Untitled AI story',url=link(b)||'#',description=(tag(b,'description')||tag(b,'summary')||tag(b,'content')).slice(0,320)||'Latest artificial intelligence news and analysis.',date=tag(b,'pubDate')||tag(b,'published')||tag(b,'updated')||new Date().toISOString(),publishedAt;try{publishedAt=new Date(date).toISOString()}catch{publishedAt=new Date().toISOString()}return{id:hash(source+title+url),title,link:url,source,publishedAt,description,image:feedImage(b)}}).filter(x=>/^https?:\/\//i.test(x.link))}
async function getText(url,timeout=6500){const c=new AbortController(),t=setTimeout(()=>c.abort(),timeout);try{const r=await fetch(url,{headers:{'user-agent':'Mozilla/5.0 AI-News-Now/3.1','accept':'text/html,application/rss+xml,application/xml;q=0.9,*/*;q=0.8'},signal:c.signal,redirect:'follow'});if(!r.ok)throw Error(String(r.status));return{text:await r.text(),url:r.url}}finally{clearTimeout(t)}}
async function load(f){try{return parse((await getText(f.url)).text,f.source)}catch{return[]}}
function ogImage(html){return attr(html,/<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i)||attr(html,/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["']/i)||attr(html,/<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i)||attr(html,/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["']/i)}
async function enrich(n,i){let image=n.image;if(n.source!=='Google News'){try{const page=await getText(n.link,3200),og=ogImage(page.text);if(og)image=og.startsWith('//')?'https:'+og:og;if(page.url&&!page.url.includes('news.google.com'))n.link=page.url}catch{}}return{...n,image:/^https?:\/\//i.test(image||'')?image:fallbackImages[i%fallbackImages.length]}}
function googleFeedFor(category,query=''){const q=query?`"${query}" AI when:365d`:(categoryQueries[category]||categoryQueries.home);return{source:'Google News',url:`https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`}}
module.exports=async function(req,res){res.setHeader('Cache-Control','s-maxage=300, stale-while-revalidate=900');const category=String(req.query?.category||'home').toLowerCase();const query=String(req.query?.q||'').trim().slice(0,120);const feeds=[googleFeedFor(category,query),...baseFeeds];let live=(await Promise.all(feeds.map(load))).flat(),pool=live.length>=12?live:[...live,...fallback],seen=new Set();let news=pool.filter(n=>{let k=n.title.toLowerCase().replace(/[^a-z0-9]+/g,' ').split(' ').slice(0,11).join(' ');if(seen.has(k))return false;seen.add(k);return true}).sort((a,b)=>+new Date(b.publishedAt)-+new Date(a.publishedAt)).slice(0,80);const top=await Promise.all(news.slice(0,18).map(enrich));news=[...top,...news.slice(18).map((n,i)=>({...n,image:/^https?:\/\//i.test(n.image||'')?n.image:fallbackImages[(i+top.length)%fallbackImages.length]}))];res.status(200).json({updatedAt:new Date().toISOString(),category,query,count:news.length,news})};
