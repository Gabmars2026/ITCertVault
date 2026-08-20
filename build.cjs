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
if (!fs.existsSync(basePath)) throw new Error('base.html was not found at the project root.');
let html = fs.readFileSync(basePath, 'utf8');

// Rebuild the certification metadata at build time so the browser never has
// to fetch base.html or decompress the metadata before the app can start.
const seedContext = { window: {} };
for (let i = 1; i <= 4; i++) {
  const seedPath = path.join(root, `itcv-seed-meta-${i}.js`);
  if (!fs.existsSync(seedPath)) throw new Error(`Missing ${path.basename(seedPath)}`);
  vm.runInNewContext(fs.readFileSync(seedPath, 'utf8'), seedContext, { filename: seedPath });
}
const b64 = seedContext.window.ITCV_META_B64 || '';
if (!b64) throw new Error('Certification metadata seed is empty.');
const meta = JSON.parse(zlib.gunzipSync(Buffer.from(b64, 'base64')).toString('utf8'));

html = html.replace(/CertForge/g, 'ITCertVault');

const orangeIcon = "<link rel=\"icon\" href=\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cpath fill='%23f97316' d='M32 3 55 12v17c0 15-9.8 26.2-23 32C18.8 55.2 9 44 9 29V12L32 3Z'/%3E%3Cpath fill='none' stroke='white' stroke-width='5' d='m21 31 7 7 15-16'/%3E%3C/svg%3E\">";
html = html.replace(/<head>/i, '<head>' + orangeIcon + '<meta name="theme-color" content="#f97316">');

const safeMeta = JSON.stringify(meta).replace(/</g, '\\u003c');
const runtimePatch = "document.title=(document.title||'ITCertVault').replace(/CertForge/g,'ITCertVault');";
const runtimePatchFixed = "var nextTitle=(document.title||'ITCertVault').replace(/CertForge/g,'ITCertVault');if(document.title!==nextTitle)document.title=nextTitle;";
const runtimeTags =
  '<script>window.ITCV_META=' + safeMeta + ';window.ITCV_DOMAINS={};window.ITCV_VIDEOS={};</script>' +
  [1, 2, 3, 4].map(i => '<script src="./itcv-runtime-' + i + '.js"></script>').join('') +
  '<script>window.ITCV_RUNTIME_SRC=(window.ITCV_RUNTIME_SRC||"").replace(' + JSON.stringify(runtimePatch) + ',' + JSON.stringify(runtimePatchFixed) + ');Function(window.ITCV_RUNTIME_SRC||"")();</script>';

const marker = 'var META=window.CERT_META';
const markerPos = html.indexOf(marker);
if (markerPos < 0) throw new Error('The ITCertVault base application marker was not found.');
const scriptPos = html.lastIndexOf('<script', markerPos);
if (scriptPos < 0) throw new Error('The ITCertVault application script could not be located.');

html = html.slice(0, scriptPos) + runtimeTags + html.slice(scriptPos);
fs.writeFileSync(path.join(out, 'index.html'), html, 'utf8');

console.log(`Built dist/index.html from base.html (${html.length.toLocaleString()} characters).`);
