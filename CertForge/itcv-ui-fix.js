(function(){
  'use strict';

  // The 332-certification runtime already supplies local books, questions,
  // labs, images and video resources. The legacy base application's blob
  // manifest points at obsolete JSON payloads and blocks every route when
  // those fetches fail. Clear that gate before the original app initializes.
  window.CF_BLOB=window.CF_BLOB||{};
  window.CF_BLOB.manifest={};
  window.CF_MANIFEST={};
  document.documentElement.setAttribute('data-itcv-local-content','ready');

  // Remove Vercel's floating preview/feedback toolbar from every page.
  // Vercel injects this element after page load on preview deployments, so
  // keep both a CSS guard and a MutationObserver in place for late injection.
  var toolbarStyle=document.createElement('style');
  toolbarStyle.id='itcv-hide-vercel-toolbar';
  toolbarStyle.textContent='vercel-live-feedback,#vercel-toolbar,.vercel-live-feedback,[data-vercel-feedback]{display:none!important;visibility:hidden!important;pointer-events:none!important;}';
  (document.head||document.documentElement).appendChild(toolbarStyle);

  function removeVercelToolbar(root){
    root=root||document;
    if(root.querySelectorAll){
      root.querySelectorAll('vercel-live-feedback,#vercel-toolbar,.vercel-live-feedback,[data-vercel-feedback]').forEach(function(node){
        if(node&&node.remove) node.remove();
      });
    }
    if(root.matches&&root.matches('vercel-live-feedback,#vercel-toolbar,.vercel-live-feedback,[data-vercel-feedback]')&&root.remove){
      root.remove();
    }
  }

  removeVercelToolbar(document);
  new MutationObserver(function(records){
    records.forEach(function(record){
      if(!record.addedNodes) return;
      record.addedNodes.forEach(function(node){
        if(node&&node.nodeType===1) removeVercelToolbar(node);
      });
    });
  }).observe(document.documentElement,{childList:true,subtree:true});

  // Preserve and synchronously execute the exact navigation/vendor and
  // visual-layout fix that previously lived at this filename.
  var current=document.currentScript;
  var coreSrc=(current&&current.src)?new URL('itcv-ui-fix-core.js',current.src).href:'itcv-ui-fix-core.js';
  var xhr=new XMLHttpRequest();
  xhr.open('GET',coreSrc,false);
  xhr.send(null);
  if((xhr.status>=200&&xhr.status<300)||xhr.status===0){
    Function(xhr.responseText)();
  }else{
    throw new Error('Could not load ITCertVault UI core ('+xhr.status+').');
  }
})();
