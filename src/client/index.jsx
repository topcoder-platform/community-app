/**
 * Client-side rendering of the App.
 */

import cookies from 'browser-cookies';
import { BrowserRouter, browserHistory } from 'react-router-dom';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import {
  configureConnector,
  decodeToken,
  getFreshToken,
} from 'tc-accounts';

import actions from '../shared/actions/auth';
import App from '../shared';
import logger from '../shared/utils/logger';
import storeFactory from '../shared/store-factory';

const config = window.CONFIG;

/**
 * Uses Topcoder accounts-app to fetch / refresh authentication tokens.
 * Results will be storted in the Redux store, inside state.auth.
 * @param {Object} store Redux store.
 */
function authenticate(store) {
  /* TODO: The iframe injected into the page by this call turns out to be
   * visible as a tiny nob (~3x3 px). It has html ID `tc-accounts-iframe`
   * (as specified in this call). We should hide it by adding the proper side
   * in our stylesheet, or to figure out, why it is not hidden by default.  */
  configureConnector({
    connectorUrl: config.ACCOUNTS_APP_CONNECTOR_URL,
    frameId: 'tc-accounts-iframe',
  });

  getFreshToken().then((tctV3) => {
    const tctV2 = cookies.get('tcjwt');
    cookies.set('tctV3', tctV3, {
      expires: config.COOKIES.MAXAGE,
      secure: config.COOKIES.SECURE,
    });
    logger.log('Authenticated as:', decodeToken(tctV3));
    logger.log('Topcoder API v3 token:', tctV3);
    if (!tctV2) logger.error('Failed to fetch API v2 token!');
    else logger.log('Topcoder API v2 token:', tctV2);
    return ({ tctV2, tctV3 });
  }).catch(() => {
    logger.warn('Authentication failed!');
    cookies.erase('tcjwt');
    cookies.erase('tctV3');
    return ({});
  }).then(({ tctV2, tctV3 }) => {
    const auth = store.getState().auth;
    if (auth.tokenV3 !== (tctV3 || null)) {
      store.dispatch(actions.auth.setTcTokenV3(tctV3));
    }
    if (auth.tokenV2 !== (tctV2 || null)) {
      store.dispatch(actions.auth.setTcTokenV2(tctV2));
    }
  });
}

storeFactory(undefined, window.ISTATE).then((store) => {
  authenticate(store);
  render(
    <Provider store={store}>
      <BrowserRouter history={browserHistory}>
        <App />
      </BrowserRouter>
    </Provider>,
    document.getElementById('react-view'),
  );
});
