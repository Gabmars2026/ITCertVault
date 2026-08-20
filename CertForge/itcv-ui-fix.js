(function(){
  'use strict';

  var STYLE_ID='itcv-visual-layout-fix';

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

  function scan(root){
    if(!root) return;
    installStyles();
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
    var needsScan=records.some(function(record){return record.addedNodes&&record.addedNodes.length;});
    if(!needsScan) return;
    queued=true;
    requestAnimationFrame(function(){queued=false;run();});
  }).observe(document.documentElement,{childList:true,subtree:true});
})();
