// Browser APIs used by the application and its dependencies. Server code keeps
// Node's native crypto. Avoid pulling unused elliptic signing/ECDH into bundles.
const randomFill = require('randomfill/browser');

module.exports = {
  createHash: require('create-hash/browser'),
  createHmac: require('create-hmac/browser'),
  randomBytes: require('randombytes/browser'),
  randomFill: randomFill.randomFill,
  randomFillSync: randomFill.randomFillSync,
};
