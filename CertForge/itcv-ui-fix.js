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
