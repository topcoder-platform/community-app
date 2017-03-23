/**
 * This module provides isomorphic configuration. On client-side it serves
 * configuration object from the global __CONFIG__ variable, where it is
 * injected by server. Server-side it provides it directly from node-config.
 */

/* eslint-env browser */
/* eslint-disable global-require */

if (process.env.FRONT_END) {
  module.exports = window.CONFIG;
} else {
  module.exports = require('config');
}
