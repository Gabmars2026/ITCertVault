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

  // Preserve the exact navigation/vendor and visual-layout fix that was
  // previously served from this filename, and execute it synchronously before
  // the base application continues parsing.
  var current=document.currentScript;
  var coreSrc=(current&&current.src)?new URL('itcv-ui-fix-core.js',current.src).href:'itcv-ui-fix-core.js';
  document.write('<script src="'+coreSrc.replace(/&/g,'&amp;')+'"><\\/script>');
})();
