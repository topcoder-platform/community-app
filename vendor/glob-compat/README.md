# glob CommonJS compatibility adapter

Some legacy Community App build plugins expect `require('glob')` to return a
callable object, while maintained glob versions expose functions as named
exports.

This adapter preserves the callable CommonJS shape, including legacy callback
handling, and forwards named exports to `glob@13.0.6`. It contains no matching
implementation of its own.

Browser bundlers resolve `browser.js`, a fail-fast facade with the same callable
shape. This keeps server-only transitive imports from bundling glob's Node.js
implementation or core-module dependencies.
