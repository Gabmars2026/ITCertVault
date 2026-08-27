const baseHandler=require('./breaking-live');
const STOP=new Set('the a an and or of to in on for with after over from at by as is are was were has have had its their this that new says say news major recent data cyber cybersecurity security attack breach incident report reports response responds investigating investigation group groups claims claim customers customer stolen stole hackers hacker'.split(' '));
function getBase(req){return new Promise(resolve=>{let done=false;const finish=x=>{if(!done){done=true;resolve(x||{news:[],severityCounts:{BREAKING:0,MAJOR:0,DEVELOPING:0}})}};const res={setHeader(){},status(){return this},json:finish};Promise.resolve(baseHandler(req,res)).catch(()=>finish());setTimeout(()=>finish(),7000)})}
function stem(w){return w.length>4?w.replace(/(?:ies|es|s)$/,''):w}
function words(title=''){return String(title).toLowerCase().replace(/\s+-\s+[^-]{2,80}$/,'').replace(/[^a-z0-9]+/g,' ').trim().split(' ').map(stem).filter(w=>w.length>2&&!STOP.has(w)).slice(0,22)}
function similar(a,b){const A=new Set(words(a.title)),B=new Set(words(b.title));if(!A.size||!B.size)return false;let hit=0;for(const w of A)if(B.has(w))hit++;const ratio=hit/Math.min(A.size,B.size);if(hit>=3&&ratio>=.38)return true;const ta=(a.title+' '+a.description).toLowerCase(),tb=(b.title+' '+b.description).toLowerCase();if(/\batf\b/.test(ta)&&/\batf\b/.test(tb)&&/ransomware|cyber|hack|breach/.test(ta)&&/ransomware|cyber|hack|breach/.test(tb))return true;if(/boston scientific/.test(ta)&&/boston scientific/.test(tb)&&/cyber|attack|outage|disruption/.test(ta)&&/cyber|attack|outage|disruption/.test(tb))return true;if(/airport/.test(ta)&&/airport/.test(tb)&&/(manchester|stansted|east midlands|\buk\b)/.test(ta)&&/(manchester|stansted|east midlands|\buk\b)/.test(tb)&&/cyber|hack|breach|stolen/.test(ta)&&/cyber|hack|breach|stolen/.test(tb))return true;return false}
function collapse(items){const out=[];for(const n of items){if(out.some(x=>Math.abs(new Date(x.publishedAt)-new Date(n.publishedAt))<48*36e5&&similar(x,n)))continue;out.push(n)}return out}
module.exports=async function(req,res){
  res.setHeader('Cache-Control','public, max-age=20, stale-while-revalidate=60');
  res.setHeader('CDN-Cache-Control','public, max-age=30, stale-while-revalidate=60');
  res.setHeader('Vercel-CDN-Cache-Control','public, max-age=30, stale-while-revalidate=60');
  const data=await getBase(req);
  const news=collapse([...(data.news||[])].sort((a,b)=>+new Date(b.publishedAt)-+new Date(a.publishedAt))).slice(0,30);
  const severityCounts=news.reduce((a,n)=>(a[n.severity]=(a[n.severity]||0)+1,a),{BREAKING:0,MAJOR:0,DEVELOPING:0});
  res.status(200).json({...data,updatedAt:new Date().toISOString(),refreshSeconds:60,count:news.length,severityCounts,ranking:'newest-first-deduplicated-tech-security-hardware',news});
};
