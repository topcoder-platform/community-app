const core = require('tc-core-engine');

// The React library creates its legacy factory even for public pages without
// machine credentials. Validate configuration when a token is actually needed.
function legacyM2M(configuration) {
  let client;
  return {
    async getMachineToken(clientId, clientSecret) {
      if (!client) client = core.createM2MClient(configuration);
      return client.getMachineToken(clientId, clientSecret);
    },
    clearCache() { if (client) client.clearCache(); },
  };
}
module.exports = { ...core, auth: { m2m: legacyM2M } };
