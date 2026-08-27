(()=>{
const nativeFetch=window.fetch.bind(window);
const CACHE_PREFIX='ainn-news-cache-v3:';
const FRESH_MS=60*1000;
const STALE_MS=2*60*60*1000;
const TIMEOUT_MS=2500;
function cacheKey(url){return CACHE_PREFIX+url}
function readCache(url){try{const raw=localStorage.getItem(cacheKey(url));if(!raw)return null;const item=JSON.parse(raw);if(!item||!item.body||!item.ts)return null;const age=Date.now()-item.ts;if(age>STALE_MS){localStorage.removeItem(cacheKey(url));return null}return{...item,age}}catch{return null}}
function makeResponse(item){return new Response(item.body,{status:200,headers:{'content-type':'application/json; charset=utf-8','x-ainn-cache':'browser'}})}
async function saveCache(url,response){try{if(!response?.ok)return;const body=await response.clone().text();JSON.parse(body);localStorage.setItem(cacheKey(url),JSON.stringify({ts:Date.now(),body}))}catch{}}
async function network(input,init,url){const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),TIMEOUT_MS);try{const opts={...(init||{}),signal:controller.signal};if(opts.cache==='no-store')delete opts.cache;const response=await nativeFetch(input,opts);if(response.ok)saveCache(url,response);return response}finally{clearTimeout(timer)}}
window.fetch=async function(input,init){const raw=typeof input==='string'?input:input?.url||'';let url;try{url=new URL(raw,location.href)}catch{return nativeFetch(input,init)}if(url.origin!==location.origin||url.pathname!=='/api/news')return nativeFetch(input,init);const key=url.href;const cached=readCache(key);if(cached&&cached.age<=FRESH_MS)return makeResponse(cached);if(cached){network(input,init,key).catch(()=>{});return makeResponse(cached)}try{return await network(input,init,key)}catch{return new Response(JSON.stringify({updatedAt:new Date().toISOString(),category:url.searchParams.get('category')||'home',count:0,news:[]}),{status:200,headers:{'content-type':'application/json; charset=utf-8','x-ainn-fallback':'timeout'}})}};
})();
