const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

// Vercel deploys this repository from the root, while the current website
// lives in ./CertForge. Build that app directly, then expose its dist folder
// as the root Vercel output so production always matches the current site.
const root = __dirname;
const appRoot = path.join(root, 'CertForge');
const appBuild = path.join(appRoot, 'build.cjs');
const appDist = path.join(appRoot, 'dist');
const out = path.join(root, 'dist');

if (!fs.existsSync(appBuild)) {
  throw new Error('Current CertForge build script was not found.');
}

execFileSync(process.execPath, [appBuild], {
  cwd: appRoot,
  stdio: 'inherit'
});

if (!fs.existsSync(appDist)) {
  throw new Error('CertForge build completed without creating dist/.');
}

// The authoritative 332-cert metadata is injected into ITCV_META by the
// CertForge build. CERT_META must be a working copy, not the same array.
// Historical startup code appends legacy entries to CERT_META; when both
// variables share one array, those appends also corrupt ITCV_META and turn
// the verified 332-cert seed into 458 entries before the final reset.
// Patch that generated bootstrap at the deployment boundary and fail closed
// if its exact shape changes, so production can never silently regress.
const generatedIndex = path.join(appDist, 'index.html');
if (!fs.existsSync(generatedIndex)) {
  throw new Error('CertForge build completed without dist/index.html.');
}
let productionHtml = fs.readFileSync(generatedIndex, 'utf8');
const sharedCatalogAlias = 'window.CERT_META=window.ITCV_META;';
const isolatedCatalogCopy = 'window.CERT_META=window.ITCV_META.slice();';
const aliasCount = productionHtml.split(sharedCatalogAlias).length - 1;
if (aliasCount !== 1) {
  throw new Error(`Expected exactly one shared CERT_META/ITCV_META bootstrap alias; found ${aliasCount}. Refusing to publish.`);
}
productionHtml = productionHtml.replace(sharedCatalogAlias, isolatedCatalogCopy);
if (productionHtml.includes(sharedCatalogAlias) || !productionHtml.includes(isolatedCatalogCopy)) {
  throw new Error('Failed to isolate the production CERT_META working copy from the authoritative 332-cert seed.');
}
fs.writeFileSync(generatedIndex, productionHtml, 'utf8');
console.log('Isolated CERT_META from ITCV_META so legacy appends cannot mutate the verified 332-cert seed.');

fs.rmSync(out, { recursive: true, force: true });
fs.cpSync(appDist, out, { recursive: true });

console.log('Published CertForge/dist as the ITCertVault production output.');
