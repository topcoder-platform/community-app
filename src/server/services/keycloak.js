/** Server-only shared-core authentication. No credentials enter browser config. */
const { auth } = require('tc-core-library-js');

let provider;
let validator;

/** Return a verified cached Keycloak service token using runtime environment settings.
 * Takes no arguments; rejects with sanitized shared-core errors on invalid config/tokens.
 * Used only by server API transports; never callable from browser bundles.
 */
function getMachineToken() {
  if (!provider) provider = auth.m2m();
  return provider.getMachineToken();
}

/** Validate a protected route's member identity and populate normalized authUser.
 * Accepts Express request/response/next; returns completion, 401 for invalid tokens,
 * or 403 for verified service identities. Never exposes tokens or provider errors.
 */
async function authenticateMember(req, res, next) {
  let principal;
  try {
    if (!validator) validator = auth.createValidator();
    const match = typeof req.headers.authorization === 'string'
      ? /^Bearer ([^\s]+)$/i.exec(req.headers.authorization) : null;
    if (!match) throw new Error('Missing bearer token');
    principal = await validator.verify(match[1]);
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
    return;
  }
  if (principal.kind !== 'user') {
    res.status(403).json({ message: 'Member authentication required' });
    return;
  }
  req.authUser = principal;
  next();
}

module.exports = { getMachineToken, authenticateMember };
