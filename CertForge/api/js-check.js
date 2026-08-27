const fs=require('fs');
const path=require('path');
const vm=require('vm');

module.exports=(req,res)=>{
  const files=['app.js','fast-news.js','render-guard.js','source-pages.js','image-dedupe.js','notifications.js','site-upgrade.js','instant-home.js'];
  const results=[];
  const base=path.join(process.cwd(),'CertForge');
  for(const file of files){
    try{
      const p=path.join(base,file);
      const src=fs.readFileSync(p,'utf8');
      new vm.Script(src,{filename:file});
      results.push({file,ok:true,bytes:Buffer.byteLength(src)});
    }catch(err){
      results.push({file,ok:false,error:String(err&&err.message||err),stack:String(err&&err.stack||'')});
    }
  }
  res.setHeader('Cache-Control','no-store');
  res.status(200).json({ok:results.every(x=>x.ok),results});
};
