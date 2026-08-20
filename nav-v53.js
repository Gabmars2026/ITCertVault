(function(){
'use strict';
var VERSION='2026-08-18-live-nav-v54-comptia';
var MAP={
  az802:'Microsoft',az104:'Microsoft',az900:'Microsoft',ms102:'Microsoft',sc900:'Microsoft',
  awsccp:'AWS',awssaa:'AWS',
  ccna:'Cisco',autocor:'Cisco',clcor:'Cisco',cbrcor:'Cisco',dccor:'Cisco',ccnp:'Cisco',scor:'Cisco',spcor:'Cisco',wlcor:'Cisco',
  aplus:'CompTIA',networkplus:'CompTIA',securityplus:'CompTIA',linuxplus:'CompTIA',cloudplus:'CompTIA',serverplus:'CompTIA',projectplus:'CompTIA',cysaplus:'CompTIA',pentestplus:'CompTIA',securityx:'CompTIA',
  secai:'CompTIA',dataai:'CompTIA',cloudnetx:'CompTIA',dataplus:'CompTIA',datasysplus:'CompTIA',autoops:'CompTIA',
  ccsp:'ISC2',cissp:'ISC2',itil5:'PeopleCert / ITIL'
};
var COMPTIA_IDS=['aplus','networkplus','securityplus','linuxplus','cloudplus','serverplus','projectplus','cysaplus','pentestplus','securityx','secai','dataai','cloudnetx','dataplus','datasysplus','autoops'];
var busy=false,timer=0;
function providerSections(nav){
  return Array.from(nav.children).filter(function(x){return x.matches&&x.matches('section.itcv-v7-provider[data-provider-name]');});
}
function provider(nav,name){
  return providerSections(nav).find(function(x){return x.getAttribute('data-provider-name')===name;})||null;
}
function host(sec){return sec&&sec.querySelector(':scope > .itcv-v7-provider-certs');}
function rows(sec){return sec?Array.from(sec.querySelectorAll('.grp[data-grp]')):[];}
function updateCount(sec){
  if(!sec)return 0;
  var ids=new Set(rows(sec).map(function(r){return r.getAttribute('data-grp');}).filter(Boolean));
  var badge=sec.querySelector(':scope > .itcv-v7-provider-btn .itcv-v7-count');
  if(badge)badge.textContent=String(ids.size);
  return ids.size;
}
function sectionOf(row){return row&&row.closest('section.itcv-v7-provider[data-provider-name]');}
function run(){
  if(busy)return;
  busy=true;
  try{
    var nav=document.querySelector('[data-nav]');
    if(!nav)return;
    var moved=0,deduped=0,unmapped=[];
    var allRows=Array.from(nav.querySelectorAll('section.itcv-v7-provider[data-provider-name] .grp[data-grp]'));
    allRows.forEach(function(row){
      if(!row.isConnected)return;
      var id=String(row.getAttribute('data-grp')||'');
      var vendor=MAP[id];
      if(!vendor)return;
      var current=sectionOf(row);
      var target=provider(nav,vendor),dest=host(target);
      if(!target||!dest){unmapped.push(id);return;}
      if(current===target)return;
      var duplicate=rows(target).some(function(r){return r!==row&&r.getAttribute('data-grp')===id;});
      if(duplicate){row.remove();deduped++;}
      else{dest.appendChild(row);moved++;}
      updateCount(current);
      updateCount(target);
    });

    var comptia=provider(nav,'CompTIA');
    var comptiaPresent=comptia?new Set(rows(comptia).map(function(r){return r.getAttribute('data-grp');}).filter(Boolean)):new Set();
    var comptiaKnown=COMPTIA_IDS.filter(function(id){return comptiaPresent.has(id);});

    var other=provider(nav,'Other');
    var remaining=other?rows(other).length:0;
    if(other&&remaining===0)other.remove();
    else if(other)updateCount(other);

    providerSections(nav).forEach(updateCount);
    document.documentElement.setAttribute('data-itcv-live-nav-v53',VERSION);
    document.documentElement.setAttribute('data-itcv-v54-comptia',String(comptiaKnown.length));
    document.documentElement.setAttribute('data-itcv-v54-comptia-ids',comptiaKnown.join(','));
    document.documentElement.setAttribute('data-itcv-v53-moved',String(moved));
    document.documentElement.setAttribute('data-itcv-v53-deduped',String(deduped));
    document.documentElement.setAttribute('data-itcv-v53-other',String(remaining));
    document.documentElement.setAttribute('data-itcv-v53-unmapped',Array.from(new Set(unmapped)).join(','));
    if(remaining===0)console.info('[ITCertVault V54] Navigation grouped; CompTIA rows='+comptiaKnown.length+', moved='+moved+', deduped='+deduped+'.');
    else console.warn('[ITCertVault V54] Other remains='+remaining+'; unmapped='+Array.from(new Set(unmapped)).join(','));
  }finally{busy=false;}
}
function schedule(ms){clearTimeout(timer);timer=setTimeout(run,ms||100);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){schedule(100);},{once:true});else schedule(100);
window.addEventListener('hashchange',function(){schedule(100);});
new MutationObserver(function(){if(!busy)schedule(120);}).observe(document.documentElement,{childList:true,subtree:true});
})();