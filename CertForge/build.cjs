const fs = require('fs');
const path = require('path');
const vm = require('vm');
const zlib = require('zlib');

const root = __dirname;
const out = path.join(root, 'dist');

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const skipped = new Set(['.git', '.vercel', 'dist', 'node_modules']);
function copyTree(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (src === root && skipped.has(entry.name)) continue;
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyTree(from, to);
    else if (entry.isFile()) fs.copyFileSync(from, to);
  }
}
copyTree(root, out);

const basePath = path.join(root, 'base.html');
if (!fs.existsSync(basePath)) throw new Error('base.html was not found in CertForge.');
let html = fs.readFileSync(basePath, 'utf8');

const seedContext = { window: {} };
const seedFiles = [
  'itcv-meta-fixed-1.js',
  'itcv-meta-fixed-2.js',
  'itcv-meta-fixed-3a.js',
  'itcv-meta-fixed-3b.js',
  'itcv-meta-fixed-4a.js',
  'itcv-meta-fixed-4b.js',
  'itcv-meta-fixed-5a.js',
  'itcv-meta-fixed-5b.js',
  'itcv-meta-fixed-6a.js',
  'itcv-meta-fixed-6b.js',
  'itcv-meta-fixed-7a.js',
  'itcv-meta-fixed-7b.js',
  'itcv-meta-fixed-8a.js',
  'itcv-meta-fixed-8b.js'
];
for (const seedFile of seedFiles) {
  const seedPath = path.join(root, seedFile);
  if (!fs.existsSync(seedPath)) throw new Error(`Missing ${seedFile}`);
  vm.runInNewContext(fs.readFileSync(seedPath, 'utf8'), seedContext, { filename: seedPath });
}
const b64 = seedContext.window.ITCV_META_B64 || '';
if (!b64) throw new Error('Certification metadata seed is empty.');
const meta = JSON.parse(zlib.gunzipSync(Buffer.from(b64, 'base64')).toString('utf8'));

html = html.replace(/CertForge/g, 'ITCertVault');

const orangeIcon = "<link rel=\"icon\" href=\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cpath fill='%23f97316' d='M32 3 55 12v17c0 15-9.8 26.2-23 32C18.8 55.2 9 44 9 29V12L32 3Z'/%3E%3Cpath fill='none' stroke='white' stroke-width='5' d='m21 31 7 7 15-16'/%3E%3C/svg%3E\">";
html = html.replace(/<head>/i, '<head>' + orangeIcon + '<meta name="theme-color" content="#f97316">');

const safeMeta = JSON.stringify(meta).replace(/</g, '\\u003c');
const visualLayoutFix = String.raw`(function(){
'use strict';
var STYLE_ID='itcv-visual-layout-fix';
function installStyles(){
  if(document.getElementById(STYLE_ID))return;
  var s=document.createElement('style');
  s.id=STYLE_ID;
  s.textContent='.itcv-visual-card-fixed{overflow:visible!important}.itcv-visual-media-shell-fixed{height:auto!important;min-height:0!important;max-height:none!important;overflow:visible!important;aspect-ratio:auto!important}.itcv-visual-media-fixed{display:block!important;width:100%!important;max-width:100%!important;height:auto!important;max-height:none!important;object-fit:contain!important;object-position:center center!important;margin-left:auto!important;margin-right:auto!important;clip-path:none!important}.itcv-fullsize-control-wrap{position:static!important;inset:auto!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;transform:none!important;width:100%!important;height:auto!important;display:flex!important;justify-content:center!important;align-items:center!important;margin:10px 0 0!important;padding:0!important;pointer-events:auto!important}.itcv-fullsize-control{position:static!important;inset:auto!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;transform:none!important;float:none!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;width:max-content!important;max-width:calc(100% - 24px)!important;height:auto!important;margin:10px auto 0!important;z-index:2!important;white-space:normal!important}@media(max-width:700px){.itcv-fullsize-control{max-width:calc(100% - 16px)!important}.itcv-visual-media-fixed{width:100%!important;height:auto!important}}';
  (document.head||document.documentElement).appendChild(s);
}
function isFullSize(el){return /view\s+full\s+size/i.test((el.textContent||'').replace(/\s+/g,' ').trim());}
function mark(control){
  if(!control||!control.classList||!isFullSize(control))return;
  control.classList.add('itcv-fullsize-control');
  var immediate=control.parentElement;
  if(immediate&&!immediate.querySelector('img,svg'))immediate.classList.add('itcv-fullsize-control-wrap');
  var node=immediate,card=null;
  for(var i=0;i<7&&node&&node!==document.body;i++,node=node.parentElement){if(node.querySelector&&node.querySelector('img,svg')){card=node;break;}}
  if(!card)return;
  card.classList.add('itcv-visual-card-fixed');
  card.querySelectorAll('img,svg').forEach(function(media){media.classList.add('itcv-visual-media-fixed');var shell=media.parentElement;if(shell&&shell!==card)shell.classList.add('itcv-visual-media-shell-fixed');});
}
function scan(root){
  if(!root)return;
  installStyles();
  if(root.nodeType===1&&root.matches&&root.matches('button,a,[role="button"]'))mark(root);
  if(root.querySelectorAll)root.querySelectorAll('button,a,[role="button"]').forEach(mark);
}
function run(){scan(document.body||document.documentElement);}
installStyles();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
var queued=false;
new MutationObserver(function(records){if(queued)return;var changed=records.some(function(r){return r.addedNodes&&r.addedNodes.length;});if(!changed)return;queued=true;requestAnimationFrame(function(){queued=false;run();});}).observe(document.documentElement,{childList:true,subtree:true});
})();`;

const runtimeTags =
  '<script>window.ITCV_META=' + safeMeta + ';window.ITCV_DOMAINS={};window.ITCV_VIDEOS={};</script>' +
  [1, 2, 3, 4].map(i => '<script src="./itcv-runtime-' + i + '.js"></script>').join('') +
  '<script>Function(window.ITCV_RUNTIME_SRC||"")();</script>' +
  '<script>' + visualLayoutFix.replace(/<\/script/gi, '<\\/script') + '</script>';

const marker = 'var META=window.CERT_META';
const markerPos = html.indexOf(marker);
if (markerPos < 0) throw new Error('The ITCertVault base application marker was not found.');
const scriptPos = html.lastIndexOf('<script', markerPos);
if (scriptPos < 0) throw new Error('The ITCertVault application script could not be located.');

html = html.slice(0, scriptPos) + runtimeTags + html.slice(scriptPos);
fs.writeFileSync(path.join(out, 'index.html'), html, 'utf8');

console.log(`Built dist/index.html from base.html (${html.length.toLocaleString()} characters).`);
