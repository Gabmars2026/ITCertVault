(function(){
  'use strict';

  var STYLE_ID='itcv-visual-layout-fix';
  var EXPECTED_CERTIFICATION_COUNT=332;
  var catalogNormalized=false;

  function installStyles(){
    if(document.getElementById(STYLE_ID)) return;
    var style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=[
      '.itcv-visual-card-fixed{overflow:visible!important;}',
      '.itcv-visual-media-shell-fixed{height:auto!important;min-height:0!important;max-height:none!important;overflow:visible!important;aspect-ratio:auto!important;}',
      '.itcv-visual-media-fixed{display:block!important;width:100%!important;max-width:100%!important;height:auto!important;max-height:none!important;object-fit:contain!important;object-position:center center!important;margin-left:auto!important;margin-right:auto!important;clip-path:none!important;}',
      '.itcv-fullsize-control-wrap{position:static!important;inset:auto!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;transform:none!important;width:100%!important;height:auto!important;display:flex!important;justify-content:center!important;align-items:center!important;margin:10px 0 0!important;padding:0!important;pointer-events:auto!important;}',
      '.itcv-fullsize-control{position:static!important;inset:auto!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;transform:none!important;float:none!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;width:max-content!important;max-width:calc(100% - 24px)!important;height:auto!important;margin:10px auto 0!important;z-index:2!important;white-space:normal!important;}',
      '@media (max-width:700px){.itcv-fullsize-control{max-width:calc(100% - 16px)!important}.itcv-visual-media-fixed{width:100%!important;height:auto!important;}}'
    ].join('');
    (document.head||document.documentElement).appendChild(style);
  }

  function isFullSizeControl(el){
    return /view\s+full\s+size/i.test((el.textContent||'').replace(/\s+/g,' ').trim());
  }

  function markControl(control){
    if(!control||!control.classList||!isFullSizeControl(control)) return;
    control.classList.add('itcv-fullsize-control');

    var immediate=control.parentElement;
    if(immediate&&!immediate.querySelector('img,svg')) immediate.classList.add('itcv-fullsize-control-wrap');

    var node=immediate;
    var card=null;
    for(var i=0;i<7&&node&&node!==document.body;i++,node=node.parentElement){
      if(node.querySelector&&node.querySelector('img,svg')){card=node;break;}
    }
    if(!card) return;

    card.classList.add('itcv-visual-card-fixed');
    card.querySelectorAll('img,svg').forEach(function(media){
      media.classList.add('itcv-visual-media-fixed');
      var shell=media.parentElement;
      if(shell&&shell!==card) shell.classList.add('itcv-visual-media-shell-fixed');
    });
  }

  function normalizeCatalog(){
    if(catalogNormalized) return;
    var authoritative=Array.isArray(window.ITCV_META)?window.ITCV_META:null;
    if(!authoritative||authoritative.length!==EXPECTED_CERTIFICATION_COUNT) return;

    // Final Shell V9 captures this legacy fallback array by reference before
    // this file runs. Mutate that same array object in place so its delayed
    // repairs can only merge the authoritative 332 entries, never the old
    // historical fallback that produced 462.
    var fallback=window.ITCV_FINAL_SHELL_V9_STATIC_META;
    if(Array.isArray(fallback)){
      fallback.splice(0,fallback.length);
      authoritative.forEach(function(cert){fallback.push(Object.assign({},cert));});
    }

    window.CERT_META=authoritative.map(function(cert){return Object.assign({},cert);});
    window.CERT_CATALOG_COUNT=EXPECTED_CERTIFICATION_COUNT;
    window.CERT_CERTIFICATION_COUNT=EXPECTED_CERTIFICATION_COUNT;
    catalogNormalized=true;

    // Force the already-rendered legacy navigation to rebuild once from the
    // corrected 332-entry catalog instead of keeping its earlier 462 nodes.
    var nav=document.querySelector('[data-nav]');
    if(nav){
      delete nav.dataset.itcvFinalV9;
      delete nav.dataset.itcvNavV7;
      nav.dataset.itcvCertCount=String(EXPECTED_CERTIFICATION_COUNT);
    }
    try{
      if(window.ITCV_FINAL_SHELL_V9&&typeof window.ITCV_FINAL_SHELL_V9.repair==='function'){
        window.ITCV_FINAL_SHELL_V9.repair();
      }
    }catch(_){ }
  }

  function certificationContext(el){
    var node=el;
    for(var depth=0;depth<4&&node&&node!==document.body;depth++,node=node.parentElement){
      var text=(node.textContent||'').replace(/\s+/g,' ').trim();
      if(text.length<=180&&/certification/i.test(text)) return true;
    }
    return false;
  }

  function fixCertificationCount(){
    normalizeCatalog();
    window.CERT_CATALOG_COUNT=EXPECTED_CERTIFICATION_COUNT;
    window.CERT_CERTIFICATION_COUNT=EXPECTED_CERTIFICATION_COUNT;

    var nav=document.querySelector('[data-nav]');
    if(nav) nav.dataset.itcvCertCount=String(EXPECTED_CERTIFICATION_COUNT);

    document.querySelectorAll('.side-label,h1,h2,h3,.phead,strong,span').forEach(function(el){
      if(!el) return;
      var text=(el.textContent||'').replace(/\s+/g,' ').trim();
      if(!text) return;

      if(/^CERTIFICATIONS\s*[·:]\s*\d+$/i.test(text)){
        el.textContent='CERTIFICATIONS · '+EXPECTED_CERTIFICATION_COUNT;
        return;
      }

      if(/\b\d+\s+IT certifications\b/i.test(text)&&text.length<=140){
        el.textContent=text.replace(/\b\d+\s+IT certifications\b/i,EXPECTED_CERTIFICATION_COUNT+' IT certifications');
        return;
      }

      if(/^462$/.test(text)&&certificationContext(el)){
        el.textContent=String(EXPECTED_CERTIFICATION_COUNT);
      }
    });
  }

  function scan(root){
    if(!root) return;
    installStyles();
    fixCertificationCount();
    if(root.nodeType===1&&root.matches&&root.matches('button,a,[role="button"]')) markControl(root);
    if(root.querySelectorAll){
      root.querySelectorAll('button,a,[role="button"]').forEach(markControl);
    }
  }

  function run(){scan(document.body||document.documentElement);}

  installStyles();
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run,{once:true});
  else run();

  var queued=false;
  new MutationObserver(function(records){
    if(queued) return;
    var needsScan=records.some(function(record){
      return (record.addedNodes&&record.addedNodes.length)||record.type==='characterData';
    });
    if(!needsScan) return;
    queued=true;
    requestAnimationFrame(function(){queued=false;run();});
  }).observe(document.documentElement,{childList:true,subtree:true,characterData:true});

  [100,350,900,1800,3500,5000].forEach(function(ms){setTimeout(fixCertificationCount,ms);});
})();
