const baseHandler=require('./news-complete');
const MAX_AGE_MS=15*24*60*60*1000;
const SHOPPING=/(save up to|\bdiscounts?\b|\bcoupons?\b|\bclearance\b|\bgift guide\b|labor day sale|black friday|prime day|\bcheapest\b|\b\d+% off\b|save \$\d+|\bsale price\b|shopping deal|best deal|deal of the day)/i;
const GENERIC=/(school district|high school|classroom|university workshop|university of .* school of business|business school|technology training|training with ai|care sector|care home|what leaders can do that technology|smart floor care|facilities technology conversation|software development partners|submit your questions|webinar:|course on|curriculum|conference registration|industry-focused technology training)/i;
const SCIENCE_ONLY=/(physicists? .* quantum fluctuations|quantum fluctuations of empty space|drug-docking|archaeolog|bur(?:y|ied).*underpants|cacao|soil study|medical study|clinical trial)/i;
const COMPUTING_QUANTUM=/\b(quantum comput(?:er|ing)|quantum processor|quantum chip|qubit|quantum software|quantum network|post-quantum)\b/i;
const FINANCE_NOISE=/(\bipo\b|sebi.{0,25}\bipo\b|stock pick|stocks? to buy|should you buy|price target|dividend|wall street analyst|private bank reaches technology transformation|investment advice)/i;
const LEGAL=/(\blawsuit\b|\bsued\b|\bsues\b|\bsuing\b|\bcourt\b|\bsettlement\b|\bclass action\b|\barrested\b|\bcharged\b|\bindicted\b|\bsentenced\b)/i;
const CYBER_EVENT=/(zero.?day|critical vulnerab|ransomware|malware|breach|cyberattack|cyber attack|supply.?chain attack|exploit|backdoor|security incident)/i;
const AUTO=/(\bcar\b|\bcars\b|\bev\b|electric vehicle|vehicle launch|suv|sedan)/i;
const AUTO_TECH=/(autonomous|self-driving|robotaxi|lidar|vehicle software|automotive chip|cybersecurity|ai system|computer vision)/i;
const HARD_TECH=/\b(openai|chatgpt|anthropic|claude|gemini|deepmind|artificial intelligence|ai model|llm|ai agent|microsoft|windows|linux|red hat|rhel|openshift|ansible|apple|iphone|android|google|meta|nvidia|amd|intel|amazon|aws|oracle|cisco|cloudflare|github|cybersecurity|ransomware|malware|zero-day|vulnerability|exploit|data breach|cloud computing|data center|server|semiconductor|chip|gpu|cpu|processor|motherboard|memory|ssd|router|networking|database|saas|developer|coding|programming|software|hardware|robotics|robot|smartphone|laptop|monitor|wearable|earbuds|headset|keyboard|mouse|controller|quantum computing|quantum processor|qubit|security update|firmware)\b/i;
const STOP=new Set('the a an and or of to in on for with after over from at by as is are was were has have had its their this that new says say news latest technology tech report reports update updates launches launched launch release releases released'.split(' '));
function getBase(req){return new Promise(resolve=>{let done=false;const finish=x=>{if(!done){done=true;resolve(x||{news:[]})}};const r={setHeader(){},status(){return this},json:finish};Promise.resolve(baseHandler(req,r)).catch(()=>finish({news:[]}));setTimeout(()=>finish({news:[]}),7500)})}
function text(n){return `${n.title||''} ${n.description||''} ${n.source||''}`}
function recent(n){const t=+new Date(n.publishedAt),age=Date.now()-t;return Number.isFinite(t)&&age>=-60*60*1000&&age<=MAX_AGE_MS}
function wanted(n){const t=text(n),source=String(n.source||'');if(!recent(n))return false;if(SHOPPING.test(t))return false;if(GENERIC.test(t))return false;if(FINANCE_NOISE.test(t))return false;if(SCIENCE_ONLY.test(t)&&!COMPUTING_QUANTUM.test(t))return false;if(LEGAL.test(t)&&!CYBER_EVENT.test(t))return false;if(AUTO.test(t)&&!AUTO_TECH.test(t))return false;if(/^Google News\b/i.test(source)&&!HARD_TECH.test(t))return false;if(!HARD_TECH.test(t)&&!/TechPowerUp|TechCrunch|The Verge|The Register|Tom's Hardware|BleepingComputer|The Hacker News|SecurityWeek|Ars Technica|BBC Technology|Engadget|Cybernews/i.test(source))return false;return true}
function normWords(title=''){return String(title).toLowerCase().replace(/\s+-\s+[^-]{2,80}$/,'').replace(/[^a-z0-9]+/g,' ').trim().split(' ').map(w=>w.length>4?w.replace(/(?:ies|es|s)$/,''):w).filter(w=>w.length>2&&!STOP.has(w)).slice(0,20)}
function sameStory(a,b){const A=new Set(normWords(a.title)),B=new Set(normWords(b.title));if(!A.size||!B.size)return false;let hit=0;for(const w of A)if(B.has(w))hit++;return hit>=4&&hit/Math.min(A.size,B.size)>=.55}
function dedupe(items){const out=[],keys=new Set();for(const n of items){const k=normWords(n.title).slice(0,12).join(' ');if(!k||keys.has(k))continue;if(out.some(x=>Math.abs(new Date(x.publishedAt)-new Date(n.publishedAt))<36*36e5&&sameStory(x,n)))continue;keys.add(k);out.push(n)}return out}
module.exports=async function(req,res){
  res.setHeader('Cache-Control','public, max-age=20, stale-while-revalidate=60');
  res.setHeader('CDN-Cache-Control','public, max-age=30, stale-while-revalidate=60');
  res.setHeader('Vercel-CDN-Cache-Control','public, max-age=30, stale-while-revalidate=60');
  const base=await getBase(req),category=String(req.query?.category||base.category||'home').toLowerCase();
  const max=category==='all-news'?90:60;
  const news=dedupe((base.news||[]).filter(wanted).sort((a,b)=>+new Date(b.publishedAt)-+new Date(a.publishedAt))).slice(0,max).map((n,i)=>({...n,importance:Math.max(1,100-i)}));
  const sourceCounts=news.reduce((a,n)=>(a[n.source]=(a[n.source]||0)+1,a),{});
  res.status(200).json({...base,updatedAt:new Date().toISOString(),refreshSeconds:60,maxAgeDays:15,category,count:news.length,ranking:'newest-first-strict-worldwide-tech-only',sourceCounts,news});
};
