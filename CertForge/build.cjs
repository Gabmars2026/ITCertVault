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
if (!fs.existsSync(basePath)) throw new Error('base.html was not found in the Vercel project root.');
let html = fs.readFileSync(basePath, 'utf8');

// Verify the original imported ITCertVault certification dataset before
// allowing this branch to deploy. Production should only be switched if
// this exact dataset contains the expected 332 certification tracks.
const seedContext = { window: {} };
const seedFiles = [
  'itcv-seed-meta-1.js',
  'itcv-seed-meta-2.js',
  'itcv-seed-meta-3.js',
  'itcv-seed-meta-4.js'
];
for (const seedFile of seedFiles) {
  const seedPath = path.join(root, seedFile);
  if (!fs.existsSync(seedPath)) throw new Error(`Missing ${seedFile}`);
  vm.runInNewContext(fs.readFileSync(seedPath, 'utf8'), seedContext, { filename: seedPath });
}

const b64 = seedContext.window.ITCV_META_B64 || '';
if (!b64) throw new Error('Certification metadata seed is empty.');
const meta = JSON.parse(zlib.gunzipSync(Buffer.from(b64, 'base64')).toString('utf8'));
console.log(`Verified imported certification dataset: ${meta.length} certifications.`);
if (!Array.isArray(meta) || meta.length !== 332) {
  throw new Error(`Expected 332 certifications, but imported dataset contains ${Array.isArray(meta) ? meta.length : 'invalid'} certifications.`);
}

html = html.replace(/CertForge/g, 'ITCertVault');

const safeMeta = JSON.stringify(meta).replace(/</g, '\\u003c');
const bootstrap =
  '<script>' +
  'window.ITCV_META=' + safeMeta + ';' +
  'window.CERT_META=window.ITCV_META;' +
  'window.ITCV_DOMAINS=window.ITCV_DOMAINS||{};' +
  'window.ITCV_VIDEOS=window.ITCV_VIDEOS||{};' +
  'window.CERT_DOMAINS=window.CERT_DOMAINS||window.ITCV_DOMAINS;' +
  'window.CERT_VIDEOS=window.CERT_VIDEOS||window.ITCV_VIDEOS;' +
  '</script>';

const marker = 'var META=window.CERT_META';
const markerPos = html.indexOf(marker);
if (markerPos < 0) throw new Error('The ITCertVault base application marker was not found.');
const scriptPos = html.lastIndexOf('<script', markerPos);
if (scriptPos < 0) throw new Error('The ITCertVault application script could not be located.');

html = html.slice(0, scriptPos) + bootstrap + html.slice(scriptPos);

const diagnostic = `<script>
window.addEventListener('error',function(e){
  setTimeout(function(){
    if(document.body && !document.body.innerText.trim()){
      var box=document.createElement('div');
      box.style.cssText='position:fixed;inset:24px;z-index:2147483647;padding:24px;background:#161b22;color:#ffb4a8;border:1px solid #f97316;border-radius:16px;font:16px/1.5 Arial,sans-serif;overflow:auto';
      box.innerHTML='<strong style="color:#f97316;font-size:22px">ITCertVault startup error</strong><br><br>'+String((e&&e.message)||'Unknown browser error');
      document.body.appendChild(box);
    }
  },100);
});
window.addEventListener('unhandledrejection',function(e){
  setTimeout(function(){
    if(document.body && !document.body.innerText.trim()){
      var box=document.createElement('div');
      box.style.cssText='position:fixed;inset:24px;z-index:2147483647;padding:24px;background:#161b22;color:#ffb4a8;border:1px solid #f97316;border-radius:16px;font:16px/1.5 Arial,sans-serif;overflow:auto';
      box.innerHTML='<strong style="color:#f97316;font-size:22px">ITCertVault startup error</strong><br><br>'+String((e&&e.reason)||'Unhandled startup rejection');
      document.body.appendChild(box);
    }
  },100);
});
</script>`;
html = html.replace(/<body([^>]*)>/i, '<body$1>' + diagnostic);

fs.writeFileSync(path.join(out, 'index.html'), html, 'utf8');
console.log(`Built direct ITCertVault production page (${html.length.toLocaleString()} characters).`);
