(()=>{
const nativeFetch=window.fetch.bind(window);
const CACHE_NAME='ainn-news-json-v1';
const FRESH_MS=5*60*1000;
const STALE_MS=60*60*1000;
async function cachePut(url,response){try{if(!('caches'in window)||!response?.ok)return;const body=await response.clone().arrayBuffer(),headers=new Headers(response.headers);headers.set('x-ainn-cached-at',String(Date.now()));const saved=new Response(body,{status:response.status,statusText:response.statusText,headers});const cache=await caches.open(CACHE_NAME);await cache.put(url,saved)}catch{}}
async function network(input,init,url){const opts={...(init||{})};if(opts.cache==='no-store')delete opts.cache;const response=await nativeFetch(input,opts);cachePut(url,response);return response}
window.fetch=async function(input,init){const raw=typeof input==='string'?input:input?.url||'';let url;try{url=new URL(raw,location.href)}catch{return nativeFetch(input,init)}if(url.origin!==location.origin||url.pathname!=='/api/news')return nativeFetch(input,init);const key=url.href;try{if('caches'in window){const cache=await caches.open(CACHE_NAME),hit=await cache.match(key);if(hit){const cachedAt=Number(hit.headers.get('x-ainn-cached-at')||0),age=Date.now()-cachedAt;if(age<=STALE_MS){if(age>FRESH_MS)network(input,init,key).catch(()=>{});return hit}}}}catch{}return network(input,init,key)};
})();
