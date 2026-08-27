const baseHandler=require('./breaking-live');
function getBase(req){return new Promise(resolve=>{let done=false;const finish=x=>{if(!done){done=true;resolve(x||{news:[],severityCounts:{BREAKING:0,MAJOR:0,DEVELOPING:0}})}};const res={setHeader(){},status(){return this},json:finish};Promise.resolve(baseHandler(req,res)).catch(()=>finish());setTimeout(()=>finish(),7000)})}
module.exports=async function(req,res){
  res.setHeader('Cache-Control','public, max-age=20, stale-while-revalidate=60');
  res.setHeader('CDN-Cache-Control','public, max-age=30, stale-while-revalidate=60');
  res.setHeader('Vercel-CDN-Cache-Control','public, max-age=30, stale-while-revalidate=60');
  const data=await getBase(req);
  res.status(200).json({...data,updatedAt:new Date().toISOString(),refreshSeconds:60});
};
