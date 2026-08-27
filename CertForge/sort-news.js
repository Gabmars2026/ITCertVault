(()=>{
  const CONTAINERS='.sectiongrid,.grid,.home-sectiongrid';
  let timer=0;

  function ageMinutes(card){
    const raw=(card.querySelector('.meta')?.textContent||card.querySelector('small')?.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
    if(!raw)return Number.POSITIVE_INFINITY;
    if(/just now|latest|moments? ago|now\b/.test(raw))return 0;
    let m=raw.match(/(\d+(?:\.\d+)?)\s*(?:m|min|mins|minute|minutes)\s*ago/);if(m)return +m[1];
    m=raw.match(/(\d+(?:\.\d+)?)\s*(?:h|hr|hrs|hour|hours)\s*ago/);if(m)return +m[1]*60;
    m=raw.match(/(\d+(?:\.\d+)?)\s*(?:d|day|days)\s*ago/);if(m)return +m[1]*1440;
    m=raw.match(/(\d+(?:\.\d+)?)\s*(?:w|wk|wks|week|weeks)\s*ago/);if(m)return +m[1]*10080;
    if(raw.includes('yesterday'))return 1440;
    return Number.POSITIVE_INFINITY;
  }

  function latestModeAllowed(){
    const active=document.querySelector('.reader-toolbar [data-mode].active');
    return !active||active.dataset.mode==='latest';
  }

  function sortContainer(container){
    const cards=[...container.children].filter(n=>n.nodeType===1&&n.matches('.card'));
    if(cards.length<2)return;
    const ranked=cards.map((card,index)=>({card,index,age:ageMinutes(card)}));
    const sorted=[...ranked].sort((a,b)=>a.age-b.age||a.index-b.index);
    const changed=sorted.some((x,i)=>x.card!==cards[i]);
    if(!changed)return;
    const frag=document.createDocumentFragment();
    sorted.forEach(x=>frag.appendChild(x.card));
    container.appendChild(frag);
  }

  function sortBreakingRail(){
    document.querySelectorAll('.panel.breaking').forEach(panel=>{
      const items=[...panel.children].filter(n=>n.matches?.('.breakitem'));
      if(items.length<2)return;
      const ranked=items.map((item,index)=>({item,index,age:ageMinutes(item)}));
      const sorted=[...ranked].sort((a,b)=>a.age-b.age||a.index-b.index);
      if(!sorted.some((x,i)=>x.item!==items[i]))return;
      const anchor=items[0];
      sorted.forEach(x=>panel.insertBefore(x.item,anchor));
    });
  }

  function sortAll(){
    if(!latestModeAllowed())return;
    document.querySelectorAll(CONTAINERS).forEach(sortContainer);
    sortBreakingRail();
  }

  function schedule(delay=40){clearTimeout(timer);timer=setTimeout(sortAll,delay)}

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>schedule(0),{once:true});
  else schedule(0);

  const app=document.getElementById('app');
  if(app){
    const obs=new MutationObserver(mutations=>{
      if(!latestModeAllowed())return;
      let relevant=false;
      for(const m of mutations){
        for(const n of m.addedNodes){
          if(n.nodeType===1&&(n.matches?.('.card,.sectiongrid,.grid,.home-sectiongrid,.breakitem')||n.querySelector?.('.card,.breakitem'))){relevant=true;break}
        }
        if(relevant)break;
      }
      if(relevant)schedule();
    });
    obs.observe(app,{childList:true,subtree:true});
  }

  document.addEventListener('click',e=>{
    if(e.target.closest?.('[data-mode="latest"]'))schedule(20);
  });
})();
