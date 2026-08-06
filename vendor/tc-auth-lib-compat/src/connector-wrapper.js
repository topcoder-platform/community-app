/* global window */

const { createFrame } = require('./iframe');
const { getToken, isTokenExpired } = require('./token');

let iframe = null;
let loading = null;
let connectorOrigin = '';
let mock = false;
let token = '';

/**
 * Configures the accounts authentication iframe.
 *
 * @param {Object} options Connector configuration.
 * @return {void}
 */
function configureConnector({
  connectorUrl,
  frameId,
  mockMode,
  mockToken,
}) {
  if (mockMode) {
    mock = true;
    token = mockToken;
    return;
  }

  if (iframe) {
    // eslint-disable-next-line no-console
    console.warn(
      'tc-accounts connector can only be configured once; this request was ignored.',
    );
    return;
  }

  connectorOrigin = new URL(connectorUrl, window.location.href).origin;
  iframe = createFrame(frameId, connectorUrl);
  loading = new Promise((resolve) => {
    iframe.onload = () => {
      loading = null;
      resolve();
    };
  });
}

function requestToken() {
  const currentToken = getToken('tcjwt');

  if (currentToken && !isTokenExpired(currentToken, 65)) {
    return Promise.resolve({ token: currentToken });
  }

  return new Promise((resolve, reject) => {
    function receiveMessage(event) {
      const data = event.data || {};
      const validSource = event.source === iframe.contentWindow;
      const validOrigin = event.origin === connectorOrigin;
      const validType = data.type === 'SUCCESS' || data.type === 'FAILURE';

      if (!validSource || !validOrigin || !validType) {
        return;
      }

      window.removeEventListener('message', receiveMessage);

      if (data.type === 'SUCCESS') {
        const refreshedToken = getToken('tcjwt');

        if (refreshedToken) {
          resolve({ token: refreshedToken });
        } else {
          reject(new Error('tcjwt cookie not found'));
        }
      } else {
        reject(new Error('Unable to refresh token'));
      }
    }

    window.addEventListener('message', receiveMessage);
    iframe.contentWindow.postMessage(
      { type: 'REFRESH_TOKEN' },
      connectorOrigin,
    );
  });
}

function proxyCall() {
  if (mock) {
    throw new Error(
      'Connector is in mock mode; proxyCall must not be invoked.',
    );
  }

  if (!iframe) {
    throw new Error('Connector has not been configured');
  }

  if (loading) {
    loading = loading.then(requestToken);
    return loading;
  }

  return requestToken();
}

/**
 * Gets a fresh authentication token.
 *
 * @return {Promise<String>} Refreshed token.
 */
function getFreshToken() {
  if (mock) {
    if (token) {
      return Promise.resolve(token);
    }

    return Promise.reject(new Error(
      'Connector is in mock mode, but no token was specified.',
    ));
  }

  return proxyCall().then(data => data.token);
}

module.exports = {
  configureConnector,
  getFreshToken,
};
