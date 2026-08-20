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

// Safe, CSS-only visual repair. This deliberately avoids MutationObserver and DOM rescans.
// The original certification gallery uses a fixed 16:9 viewport + object-fit:cover,
// which crops text-heavy diagrams. These overrides preserve each visual's full canvas.
const safeVisualCss = `<style id="itcv-safe-visual-layout-v21">
.itcv-v10-visual{overflow:visible!important}
.itcv-v10-visual-body{aspect-ratio:auto!important;height:auto!important;min-height:0!important;max-height:none!important;overflow:visible!important;display:block!important}
.itcv-v10-visual-body img,.itcv-v10-visual-body svg{display:block!important;width:100%!important;max-width:100%!important;height:auto!important;max-height:none!important;object-fit:contain!important;object-position:center center!important}
.rb14-figure{overflow:visible!important}
.rb14-figure .rb14-visual{min-height:0!important;height:auto!important;max-height:none!important;overflow:visible!important}
.rb14-figure img,.rb14-figure svg{display:block!important;width:100%!important;max-width:100%!important;height:auto!important;max-height:none!important;object-fit:contain!important}
.a13-images button{overflow:visible!important}
.a13-images button span{aspect-ratio:auto!important;height:auto!important;min-height:0!important;overflow:visible!important}
.a13-images img{display:block!important;width:100%!important;height:auto!important;max-height:none!important;object-fit:contain!important}
.a16-visual-grid figure,.a16-inline-figure{overflow:visible!important}
.a16-visual-grid img,.a16-inline-figure img{display:block!important;width:100%!important;height:auto!important;max-height:none!important;object-fit:contain!important}
.v18-image-card{overflow:visible!important}
.v18-image-card>span{aspect-ratio:auto!important;height:auto!important;overflow:visible!important}
.v18-image-card img{display:block!important;width:100%!important;height:auto!important;max-height:none!important;object-fit:contain!important}
.v18-image-page figure{overflow:visible!important}
.v18-image-page figure>img{display:block!important;width:100%!important;height:auto!important;max-height:none!important;object-fit:contain!important}
.itcv-v20-media{height:auto!important;max-height:none!important;overflow:visible!important}
.itcv-v20-media img,.itcv-v20-media svg{display:block!important;width:100%!important;height:auto!important;max-height:none!important;object-fit:contain!important}
/* Remove the legacy full-size/analysis overlay everywhere so it never covers diagrams. */
.itcv-image-overlay-v15{display:none!important}
@media(max-width:700px){
  .itcv-v10-visual-grid,.a13-images,.a16-visual-grid,.v18-image-grid{grid-template-columns:1fr!important}
  .itcv-v10-visual-body img,.itcv-v10-visual-body svg,.a13-images img,.a16-visual-grid img,.a16-inline-figure img,.v18-image-card img{width:100%!important;height:auto!important}
}
</style>`;
html = html.replace(/<\/head>/i, safeVisualCss + '</head>');

const safeMeta = JSON.stringify(meta).replace(/</g, '\\u003c');
const runtimeTags =
  '<script>window.ITCV_META=' + safeMeta + ';window.ITCV_DOMAINS={};window.ITCV_VIDEOS={};</script>' +
  [1, 2, 3, 4].map(i => '<script src="./itcv-runtime-' + i + '.js"></script>').join('') +
  '<script>Function(window.ITCV_RUNTIME_SRC||"")();</script>';

const marker = 'var META=window.CERT_META';
const markerPos = html.indexOf(marker);
if (markerPos < 0) throw new Error('The ITCertVault base application marker was not found.');
const scriptPos = html.lastIndexOf('<script', markerPos);
if (scriptPos < 0) throw new Error('The ITCertVault application script could not be located.');

html = html.slice(0, scriptPos) + runtimeTags + html.slice(scriptPos);
fs.writeFileSync(path.join(out, 'index.html'), html, 'utf8');

console.log(`Built dist/index.html from base.html (${html.length.toLocaleString()} characters).`);
