const REGISTRY=[
  {slug:'tool-magai',name:'Magai',category:'Multi-model AI workspace',official:'https://magai.co/',query:'Magai'},
  {slug:'tool-opusclip',name:'OpusClip',category:'AI video clipping and editing',official:'https://www.opus.pro/',query:'OpusClip'},
  {slug:'tool-codestral',name:'Codestral',category:'AI coding model by Mistral',official:'https://mistral.ai/news/codestral/',query:'Codestral Mistral'},
  {slug:'tool-leonardo-ai',name:'Leonardo AI',category:'AI image and video generation',official:'https://leonardo.ai/',query:'Leonardo AI'},
  {slug:'tool-voicemod-ai',name:'Voicemod AI',category:'Real-time AI voice tools',official:'https://www.voicemod.net/en/ai-voices/',query:'Voicemod AI'}
];
const MAX_AGE=15*24*60*60*1000;
function decode(s=''){return String(s).replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#8217;|&#39;|&apos;/g,"'").replace(/&#8220;|&#8221;|&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>')}
function clean(s=''){return decode(s).replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()}
function tag(b,n){const m=b.match(new RegExp(`<${n}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${n}>`,'i'));return m?clean(m[1]):''}
function link(b){const d=tag(b,'link');if(/^https?:/i.test(d))return d;const m=b.match(/<link[^>]+href=["']([^"']+)["']/i);return m?decode(m[1]):tag(b,'guid')}
function hash(s=''){let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return h.toString(36)}
function parse(xml){const blocks=[...(xml.match(/<item\b[\s\S]*?<\/item>/gi)||[]),...(xml.match(/<entry\b[\s\S]*?<\/entry>/gi)||[])];return blocks.slice(0,80).map(b=>{const title=tag(b,'title'),url=link(b),description=(tag(b,'description')||tag(b,'summary')||'').slice(0,300),date=tag(b,'pubDate')||tag(b,'published')||tag(b,'updated')||new Date().toISOString();let publishedAt;try{publishedAt=new Date(date).toISOString()}catch{publishedAt=new Date().toISOString()}return{id:hash(title+url),title,link:url,source:'Google News',publishedAt,description}}).filter(x=>x.title&&/^https?:\/\//i.test(x.link))}
async function get(url){const c=new AbortController(),t=setTimeout(()=>c.abort(),3000);try{const r=await fetch(url,{signal:c.signal,redirect:'follow',headers:{'user-agent':'Mozilla/5.0 AI-News-Now/Tools-1.0','accept':'application/rss+xml,application/xml,text/xml;q=0.9,*/*;q=0.5'}});if(!r.ok)throw Error(String(r.status));return await r.text()}finally{clearTimeout(t)}}
function recent(n){const t=+new Date(n.publishedAt),age=Date.now()-t;return Number.isFinite(t)&&age>=-3600000&&age<=MAX_AGE}
function looksLikeTool(n){const t=(n.title+' '+n.description).toLowerCase();return /(launch(?:es|ed)?|unveil(?:s|ed)?|introduc(?:es|ed)|release(?:s|d)?|debut(?:s|ed)?|new)\b/.test(t)&&/(ai tool|ai app|ai assistant|ai agent|ai platform|ai editor|ai generator|ai workspace|ai coding|ai video|ai image|ai voice|artificial intelligence tool)/.test(t)}
function dedupe(items){const seen=new Set();return items.filter(n=>{const k=n.title.toLowerCase().replace(/[^a-z0-9]+/g,' ').split(' ').slice(0,12).join(' ');if(!k||seen.has(k))return false;seen.add(k);return true})}
module.exports=async function(req,res){
  res.setHeader('Cache-Control','public, max-age=20, stale-while-revalidate=60');
  res.setHeader('Vercel-CDN-Cache-Control','public, max-age=30, stale-while-revalidate=60');
  const q='("new AI tool" OR "launches AI tool" OR "unveils AI" OR "new AI assistant" OR "new AI agent" OR "AI editor" OR "AI generator") when:15d';
  const url=`https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`;
  let discoveries=[];
  try{discoveries=dedupe(parse(await get(url)).filter(recent).filter(looksLikeTool)).sort((a,b)=>+new Date(b.publishedAt)-+new Date(a.publishedAt)).slice(0,10)}catch{}
  res.status(200).json({updatedAt:new Date().toISOString(),refreshSeconds:60,maxAgeDays:15,verified:REGISTRY,discoveries});
};
