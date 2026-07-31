/**
 * Browser boundary for the server-oriented tc-core-library-js package.
 *
 * topcoder-react-lib constructs the M2M service at module load, but rejects
 * attempts to use it in a browser before requesting a token. The application
 * also consumes the logger directly, where the browser console is sufficient.
 */

const unavailable = () => Promise.reject(
  new Error('Machine-to-machine authentication is only available in Node.js'),
);

exports.auth = {
  m2m: () => ({
    getMachineToken: unavailable,
  }),
};

// eslint-disable-next-line no-console
exports.logger = console;
