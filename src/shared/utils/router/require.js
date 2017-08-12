/**
 * This helper module is a part of requireWeak(..) implementation. Webpack is
 * configured to ignore this file, thus the code:
 *
 * const m = require('utils/router/require')('my-module-path');
 *
 * will load the module at the specified path, when exectuted at the server
 * side, and will crush, if executed at the client side. Though, the crush at
 * the client side can be easily prevented by adding condition:
 *
 * import { isServerSide } from 'utils/isomorphy';
 *
 * if (isServerSide()) {
 *   const m = require('utils/router/require')('my-module-path');
 *   // Some client-side only code.
 * }
 *
 * The key point here is that the module at 'my-module-path' will not be bundled
 * by Webpack if required this way. Thus, this way we can use static resolution
 * of the module at the server-side, while using alternative code at the client
 * side (dynamic module loading from the server).
 */

/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

module.exports = require;
