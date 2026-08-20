const fs = require('fs');
const path = require('path');

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

// Keep the small, resilient index.html loader as the production entry point.
// It loads base.html in the browser, injects certification metadata before the
// legacy application starts, and can display startup failures instead of a
// silent blank page. The previous build replaced this loader with the entire
// generated base.html, which removed those safeguards.
copyTree(root, out);

const required = [
  'index.html',
  'base.html',
  'itcv-ui-fix.js',
  'itcv-runtime-1.js',
  'itcv-runtime-2.js',
  'itcv-runtime-3.js',
  'itcv-runtime-4.js',
  'itcv-seed-meta-1.js',
  'itcv-seed-meta-2.js',
  'itcv-seed-meta-3.js',
  'itcv-seed-meta-4.js'
];

for (const file of required) {
  const builtPath = path.join(out, file);
  if (!fs.existsSync(builtPath)) throw new Error(`Missing required production file: ${file}`);
}

const index = fs.readFileSync(path.join(out, 'index.html'), 'utf8');
if (!index.includes('Loading your certification vault')) {
  throw new Error('Production index.html is not the resilient ITCertVault loader.');
}

console.log(`Built resilient ITCertVault production loader (${index.length.toLocaleString()} characters).`);
