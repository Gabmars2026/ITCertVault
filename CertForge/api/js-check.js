const vm=require('vm');

module.exports=async(req,res)=>{
  const files=['app.js','fast-news.js','render-guard.js','source-pages.js','image-dedupe.js','notifications.js','site-upgrade.js','instant-home.js'];
  const proto=req.headers['x-forwarded-proto']||'https';
  const host=req.headers.host;
  const results=[];
  for(const file of files){
    try{
      const r=await fetch(`${proto}://${host}/${file}?diag=${Date.now()}`,{cache:'no-store'});
      const src=await r.text();
      if(!r.ok)throw new Error(`HTTP ${r.status}`);
      new vm.Script(src,{filename:file});
      results.push({file,ok:true,bytes:Buffer.byteLength(src)});
    }catch(err){
      results.push({file,ok:false,error:String(err&&err.message||err),stack:String(err&&err.stack||'')});
    }
  }
  res.setHeader('Cache-Control','no-store');
  res.status(200).json({ok:results.every(x=>x.ok),results});
};
