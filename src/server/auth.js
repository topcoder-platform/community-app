/**
 * Encapsulates authentication-related logic.
 */

import { SECRET } from 'config';
import jwtAuthenticator from
  'tc-core-library-js/lib/middleware/jwtAuthenticator';
import m2mAuth from 'tc-core-library-js/lib/auth/m2m';

const { JWT_AUTH, TC_M2M } = SECRET;

const m2m = m2mAuth({
  AUTH0_URL: TC_M2M.AUTH0_URL,
  AUTH0_AUDIENCE: TC_M2M.AUDIENCE,
  AUTH0_PROXY_SERVER_URL: TC_M2M.AUTH0_PROXY_SERVER_URL,
});

/**
 * ExpressJS middleware to authenticate incoming requests from TC users.
 * On success it attaches user information to `req.authUser`.
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export const authMiddleware = jwtAuthenticator({
  AUTH_SECRET: JWT_AUTH.SECRET,
  VALID_ISSUERS: JWT_AUTH.VALID_ISSUERS,
});

/**
 * Gets M2M Token.
 * @return {Promise} Resolves to the token.
 */
export async function getM2MToken() {
  return m2m.getMachineToken(
    TC_M2M.CLIENT_ID,
    TC_M2M.CLIENT_SECRET,
  );
}
