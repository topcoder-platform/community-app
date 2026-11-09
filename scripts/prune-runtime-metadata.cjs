const fs = require('node:fs');
const path = require('node:path');

// These dependency-local locks describe upstream development environments, not
// the packages installed by this app's package-lock.json. They are never used at
// runtime. Keep package.json and all installed code so scanners see real versions.
const locks = [
  'navigation-component/package-lock.json',
  'topcoder-react-utils/package-lock.json',
  'rst-selector-parser/package-lock.json',
  'tc-core-engine/pnpm-lock.yaml',
];
for (const lock of locks) {
  fs.rmSync(path.join(__dirname, '..', 'node_modules', lock), { force: true });
}
