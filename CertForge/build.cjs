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
if (!fs.existsSync(basePath)) throw new Error('base.html was not found in the ITCertVault project root.');
let html = fs.readFileSync(basePath, 'utf8');

// Use the repository's verified 332-certification metadata chunks.
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

// base.html already contains the approved ITCertVault branding. Do not run
// whole-document string replacements here because the page includes inline
// application JavaScript and data that must remain byte-for-byte valid.
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

// Keep startup simple: verified data bootstrap + original application.
html = html.slice(0, scriptPos) + bootstrap + html.slice(scriptPos);

// Apply the existing visual fix in production. It prevents image cropping,
// keeps the complete image/text visible, and places the "View full size"
// control below the image instead of on top of it.
const visualFix = '<script src="itcv-ui-fix.js"></script>';
if (/<\/body>/i.test(html)) html = html.replace(/<\/body>/i, visualFix + '</body>');
else html += visualFix;

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

// Prevent a production deploy if any classic inline browser script has invalid
// JavaScript syntax. This catches the exact class of error that previously
// produced "Uncaught SyntaxError: Invalid or unexpected token" in the browser.
let checkedScripts = 0;
const inlineScriptRe = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
let match;
while ((match = inlineScriptRe.exec(html)) !== null) {
  const attrs = match[1] || '';
  const source = match[2] || '';
  if (/\bsrc\s*=/.test(attrs)) continue;
  const typeMatch = attrs.match(/\btype\s*=\s*["']([^"']+)["']/i);
  if (typeMatch && !/^(?:text|application)\/javascript$/i.test(typeMatch[1])) continue;
  try {
    new vm.Script(source, { filename: `inline-script-${checkedScripts + 1}.js` });
  } catch (err) {
    const details = String((err && err.stack) || err);
    throw new Error(`Invalid inline browser JavaScript in generated ITCertVault page, script ${checkedScripts + 1}:\n${details}`);
  }
  checkedScripts++;
}
if (!checkedScripts) throw new Error('No inline browser JavaScript was found to validate.');

fs.writeFileSync(path.join(out, 'index.html'), html, 'utf8');
console.log(`Validated ${checkedScripts} inline browser script(s).`);
console.log(`Built direct ITCertVault production page (${html.length.toLocaleString()} characters).`);
