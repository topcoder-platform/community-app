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

import config from '../shared/config';
import App from '../shared';
import storeFactory from '../shared/store-factory';

/* TODO: The iframe injected into the page by this call turns out to be visible
 * as a tiny nob (~3x3 px). It has html ID `tc-accounts-iframe` (as specified in
 * this call). We should hide it by adding the proper side in our stylesheet,
 * or to figure out, why it is not hidden by default.  */
configureConnector({
  connectorUrl: config.ACCOUNTS_APP_CONNECTOR_URL,
  frameId: 'tc-accounts-iframe',
});

getFreshToken().then((token) => {
  cookies.set('tct', token, {
    expires: config.COOKIES.MAXAGE,
    secure: config.COOKIES.SECURE,
  });
  /* TODO: Dispatch an action to store the token and user object to the store,
   * in case it is not already stored there by server. */
});

storeFactory(undefined, window.ISTATE).then(store =>
  render(
    <Provider store={store}>
      <BrowserRouter history={browserHistory}>
        <App />
      </BrowserRouter>
    </Provider>,
    document.getElementById('react-view')));
