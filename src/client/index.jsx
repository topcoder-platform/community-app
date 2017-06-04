/**
 * Client-side rendering of the App.
 */

import actions from 'actions/auth';
import cookies from 'browser-cookies';
import { BrowserRouter, browserHistory } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import shortId from 'shortid';
import {
  configureConnector,
  decodeToken,
  getFreshToken,
} from 'tc-accounts';
import logger from 'utils/logger';

import storeFactory from '../shared/store-factory';
import './styles.scss';

/* Isomorphic code may rely on this environment variable to check whether it is
 * executed client- or server-side. */
if (!process.env.FRONT_END) {
  throw new Error(
    'process.env.FRONT_END must evaluate to true at the client side');
}

const config = window.CONFIG;

/**
 * Uses Topcoder accounts-app to fetch / refresh authentication tokens.
 * Results will be storted in the Redux store, inside state.auth.
 * @param {Object} store Redux store.
 */
let firstAuth = true;
function authenticate(store) {
  /* TODO: The iframe injected into the page by this call turns out to be
   * visible as a tiny nob (~3x3 px). It has html ID `tc-accounts-iframe`
   * (as specified in this call). We should hide it by adding the proper side
   * in our stylesheet, or to figure out, why it is not hidden by default.  */
  if (firstAuth) {
    firstAuth = false;
    configureConnector({
      connectorUrl: config.ACCOUNTS_APP_CONNECTOR_URL,
      frameId: 'tc-accounts-iframe',
    });
  }

  /* TODO: Should we schedule authomatical re-authentication with help of
    setTimeout(), so that we don't have to worry about updates of the token
    in any other frontend code? */
  getFreshToken().then((tctV3) => {
    const tctV2 = cookies.get('tcjwt');
    logger.log('Authenticated as:', decodeToken(tctV3));
    logger.log('Topcoder API v3 token:', tctV3);
    if (!tctV2) logger.error('Failed to fetch API v2 token!');
    else logger.log('Topcoder API v2 token:', tctV2);
    return ({ tctV2, tctV3 });
  }).catch(() => {
    logger.warn('Authentication failed!');
    return ({});
  }).then(({ tctV2, tctV3 }) => {
    const auth = store.getState().auth;
    if (auth.tokenV3 !== (tctV3 || null)) {
      store.dispatch(actions.auth.setTcTokenV3(tctV3));
    }
    if (auth.tokenV2 !== (tctV2 || null)) {
      store.dispatch(actions.auth.setTcTokenV2(tctV2));
    }
    store.dispatch(actions.auth.loadProfile(tctV3));

    /* Automatic refreshment of auth tokens. */
    let time = Number.MAX_VALUE;
    if (tctV2) time = decodeToken(tctV2).exp;
    if (tctV3) time = Math.min(time, decodeToken(tctV3).exp);
    if (time < Number.MAX_VALUE) {
      time = 1000 * (time - config.REAUTH_TIME);
      time = Math.max(0, time - Date.now());
      logger.log('Reauth scheduled in', time / 1000, 'seconds');
      setTimeout(() => authenticate(store), time);
    }
  });
}

storeFactory(undefined, window.ISTATE).then((store) => {
  authenticate(store);

  function render() {
    const App = require('../shared').default; // eslint-disable-line global-require
    ReactDOM.render(
      <Provider store={store}>
        <BrowserRouter history={browserHistory}>
          <App />
        </BrowserRouter>
      </Provider>,
      document.getElementById('react-view'),
    );
  }

  render();

  if (module.hot) {
    module.hot.accept('../shared', render);

    /* This block of code forces reloading of style.css file each time
     * webpack hot middleware reports about update of the code. */
    /* eslint-disable no-underscore-dangle */
    const hotReporter = window.__webpack_hot_middleware_reporter__;
    const hotSuccess = hotReporter.success;
    hotReporter.success = () => {
      const link = document.querySelectorAll('link[rel=stylesheet]')[0];
      link.href = `/style.css?v=${shortId.generate()}`;
      hotSuccess();
    };
  }
});
