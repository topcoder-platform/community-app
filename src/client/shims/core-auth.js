/** Browser facade for the legacy React library's server-only M2M factory.
 * No core verifier, credential or Node transport is bundled in client assets.
 */
module.exports = {
  auth: {
    /** Return a provider that always rejects; no inputs or network access are accepted. */
    m2m() {
      return {
        /** Browser callers cannot obtain service credentials; rejects without I/O. */
        getMachineToken() { return Promise.reject(new Error('M2M tokens are server-only')); },
      };
    },
  },
};
