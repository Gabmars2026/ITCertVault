(function(){
  'use strict';

  var STYLE_ID='itcv-visual-layout-fix';
  var EXPECTED_CERTIFICATION_COUNT=332;
  var restored=false;

  function clean(v){return String(v==null?'':v).replace(/\s+/g,' ').trim();}

  function installStyles(){
    if(document.getElementById(STYLE_ID)) return;
    var style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=[
      '.itcv-visual-card-fixed{overflow:visible!important;}',
      '.itcv-visual-media-shell-fixed{height:auto!important;min-height:0!important;max-height:none!important;overflow:visible!important;aspect-ratio:auto!important;}',
      '.itcv-visual-media-fixed{display:block!important;width:100%!important;max-width:100%!important;height:auto!important;max-height:none!important;object-fit:contain!important;object-position:center center!important;margin-left:auto!important;margin-right:auto!important;clip-path:none!important;}',
      '.itcv-fullsize-control-wrap{position:static!important;inset:auto!important;width:100%!important;height:auto!important;display:flex!important;justify-content:center!important;align-items:center!important;margin:10px 0 0!important;padding:0!important;}',
      '.itcv-fullsize-control{position:static!important;inset:auto!important;float:none!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;width:max-content!important;max-width:calc(100% - 24px)!important;height:auto!important;margin:10px auto 0!important;z-index:2!important;white-space:normal!important;}',
      '@media (max-width:700px){.itcv-fullsize-control{max-width:calc(100% - 16px)!important}.itcv-visual-media-fixed{width:100%!important;height:auto!important;}}'
    ].join('');
    (document.head||document.documentElement).appendChild(style);
  }

  function isFullSizeControl(el){return /view\s+full\s+size/i.test(clean(el&&el.textContent));}

  function markControl(control){
    if(!control||!control.classList||!isFullSizeControl(control)) return;
    control.classList.add('itcv-fullsize-control');
    var immediate=control.parentElement;
    if(immediate&&!immediate.querySelector('img,svg')) immediate.classList.add('itcv-fullsize-control-wrap');
    var node=immediate,card=null;
    for(var i=0;i<7&&node&&node!==document.body;i++,node=node.parentElement){
      if(node.querySelector&&node.querySelector('img,svg')){card=node;break;}
    }
    if(!card) return;
    card.classList.add('itcv-visual-card-fixed');
    card.querySelectorAll('img,svg').forEach(function(media){
      media.classList.add('itcv-visual-media-fixed');
      if(media.parentElement&&media.parentElement!==card) media.parentElement.classList.add('itcv-visual-media-shell-fixed');
    });
  }

  function chooseOriginalCatalog(){
    var shell=window.ITCV_FINAL_SHELL_V9_STATIC_META;
    if(Array.isArray(shell)&&shell.length===EXPECTED_CERTIFICATION_COUNT) return shell;

    var snap=window.ITCV_CERT_NAV_V7_SNAPSHOT;
    if(snap&&Array.isArray(snap.meta)&&snap.meta.length===EXPECTED_CERTIFICATION_COUNT) return snap.meta;

    var seed=window.ITCV_META;
    if(Array.isArray(seed)&&seed.length===EXPECTED_CERTIFICATION_COUNT) return seed;

    return null;
  }

  function restoreOriginalNavigation(){
    if(restored) return;
    var original=chooseOriginalCatalog();
    if(!original) return;

    // Use the site's original 332-entry navigation catalog exactly as stored.
    // Do not reclassify vendors and do not add a second click handler.
    window.CERT_META=original.map(function(cert){return Object.assign({},cert);});
    window.CERT_CATALOG_COUNT=EXPECTED_CERTIFICATION_COUNT;
    window.CERT_CERTIFICATION_COUNT=EXPECTED_CERTIFICATION_COUNT;

    var nav=document.querySelector('[data-nav]');
    if(nav){
      delete nav.dataset.itcvFinalV9;
      delete nav.dataset.itcvNavV7;
      delete nav.dataset.itcvCanonicalNav;
      nav.dataset.itcvCertCount=String(EXPECTED_CERTIFICATION_COUNT);
    }

    // Let the site's own navigation renderer rebuild the menu. This preserves
    // its original expand/collapse behavior instead of competing with it.
    try{
      if(window.ITCV_FINAL_SHELL_V9&&typeof window.ITCV_FINAL_SHELL_V9.repair==='function'){
        window.ITCV_FINAL_SHELL_V9.repair();
      }else if(window.ITCV_CERT_NAV_V7&&typeof window.ITCV_CERT_NAV_V7.repair==='function'){
        window.ITCV_CERT_NAV_V7.repair();
      }
    }catch(_e){}

    restored=true;
  }

  function fixCounters(){
    restoreOriginalNavigation();
    window.CERT_CATALOG_COUNT=EXPECTED_CERTIFICATION_COUNT;
    window.CERT_CERTIFICATION_COUNT=EXPECTED_CERTIFICATION_COUNT;

    var nav=document.querySelector('[data-nav]');
    if(nav) nav.dataset.itcvCertCount=String(EXPECTED_CERTIFICATION_COUNT);

    document.querySelectorAll('.side-label,h1,h2,h3,.phead,strong,span').forEach(function(el){
      if(!el) return;
      var text=clean(el.textContent);
      if(!text) return;

      if(/^CERTIFICATIONS\s*[·:]\s*\d+$/i.test(text)){
        el.textContent='CERTIFICATIONS · '+EXPECTED_CERTIFICATION_COUNT;
        return;
      }
      if(/\b\d+\s+IT certifications\b/i.test(text)&&text.length<=160){
        el.textContent=text.replace(/\b\d+\s+IT certifications\b/i,EXPECTED_CERTIFICATION_COUNT+' IT certifications');
        return;
      }
      if(el.parentElement&&/IT certification tracks/i.test(clean(el.parentElement.textContent))&&/^\d+$/.test(text)){
        el.textContent=String(EXPECTED_CERTIFICATION_COUNT);
      }
    });
  }

  function scan(root){
    if(!root) return;
    installStyles();
    fixCounters();
    if(root.nodeType===1&&root.matches&&root.matches('button,a,[role="button"]')) markControl(root);
    if(root.querySelectorAll) root.querySelectorAll('button,a,[role="button"]').forEach(markControl);
  }

  function run(){scan(document.body||document.documentElement);}

  installStyles();
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run,{once:true});
  else run();

  var queued=false;
  new MutationObserver(function(records){
    if(queued) return;
    var needs=records.some(function(r){return (r.addedNodes&&r.addedNodes.length)||r.type==='characterData';});
    if(!needs) return;
    queued=true;
    requestAnimationFrame(function(){queued=false;scan(document.body||document.documentElement);});
  }).observe(document.documentElement,{childList:true,subtree:true,characterData:true});

  [100,350,900,1800,3500,5000].forEach(function(ms){setTimeout(function(){restored=false;fixCounters();},ms);});
})();
