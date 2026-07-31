/**
 * Fail-closed JWT middleware shared by authenticated server routes.
 */

import config from 'config';
import { middleware } from 'tc-core-library-js';

/**
 * Creates a response middleware used when authentication cannot be configured.
 * @return {Function} Express middleware that always rejects the request.
 */
function unavailableAuthentication() {
  return (req, res) => res.status(503).json({
    error: 'Authentication is unavailable.',
  });
}

/**
 * Creates JWT middleware from the canonical secret configuration.
 * The legacy AUTH_SECRET property is deliberately not accepted as a fallback.
 * @param {Object} jwtConfig JWT route configuration.
 * @param {Function} authenticatorFactory tc-core JWT middleware factory.
 * @return {Function} Configured authenticator or fail-closed middleware.
 */
export function createJwtAuthenticator(
  jwtConfig,
  authenticatorFactory = middleware.jwtAuthenticator,
) {
  const secret = jwtConfig && jwtConfig.SECRET;
  const configuredIssuers = jwtConfig && jwtConfig.VALID_ISSUERS;
  if (typeof secret !== 'string' || !secret.trim()) {
    return unavailableAuthentication();
  }

  let issuers;
  try {
    issuers = Array.isArray(configuredIssuers)
      ? configuredIssuers
      : JSON.parse(configuredIssuers);
  } catch (e) {
    return unavailableAuthentication();
  }
  if (!Array.isArray(issuers)
    || issuers.length === 0
    || issuers.some(issuer => typeof issuer !== 'string' || !issuer.trim())) {
    return unavailableAuthentication();
  }

  try {
    const authenticator = authenticatorFactory({
      AUTH_SECRET: secret,
      VALID_ISSUERS: JSON.stringify(issuers),
    });
    return typeof authenticator === 'function'
      ? authenticator
      : unavailableAuthentication();
  } catch (e) {
    return unavailableAuthentication();
  }
}

export const configuredJwtAuthenticator = createJwtAuthenticator(
  config.SECRET && config.SECRET.JWT_AUTH,
);

const trustedOrigins = [
  config.URL && config.URL.BASE,
  config.PLATFORM_SITE_URL,
  config.PLATFORMUI_SITE_URL,
].reduce((origins, value) => {
  if (value) {
    try {
      origins.push(new URL(value).origin);
    } catch (e) {
      // Ignore malformed optional configuration rather than opening CORS.
    }
  }
  return origins;
}, []);

export const protectedCorsOptions = {
  origin: trustedOrigins,
  methods: ['GET', 'POST'],
  credentials: true,
  maxAge: 3600,
  allowedHeaders: ['Content-Type', 'Authorization'],
};
