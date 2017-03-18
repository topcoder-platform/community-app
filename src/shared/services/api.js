/**
 * The Api services provides a convenient way to call Topcoder APIs without
 * caring about authentication tokens.
 */

import CONFIG from 'config';
import {
  configureConnector,
  decodeToken,
  getFreshToken,
  isTokenExpired,
} from 'tc-accounts';

configureConnector({
  connectorUrl: CONFIG.get('ACCOUNTS_APP_CONNECTOR_URL'),
  frameId: 'tc-accounts-iframe',
});

console.log(CONFIG.ACCOUNTS_APP_CONNECTOR_URL);
