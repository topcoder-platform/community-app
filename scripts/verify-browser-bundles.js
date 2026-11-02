const fs = require('fs');
const path = require('path');
const { Script } = require('vm');

// Webpack's noParse can emit raw ESM inside a classic-script module wrapper.
// Parse every emitted script so a successful build also guarantees valid syntax.
function verify(directory) {
  fs.readdirSync(directory, { withFileTypes: true }).forEach((entry) => {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) verify(filename);
    else if (entry.name.endsWith('.js')) {
      // Parsing only: do not execute the application or service worker.
      // eslint-disable-next-line no-new
      new Script(fs.readFileSync(filename, 'utf8'), { filename });
    }
  });
}

verify(path.resolve(__dirname, '../build'));
