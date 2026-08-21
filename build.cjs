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

fs.rmSync(out, { recursive: true, force: true });
fs.cpSync(appDist, out, { recursive: true });

console.log('Published CertForge/dist as the ITCertVault production output.');
