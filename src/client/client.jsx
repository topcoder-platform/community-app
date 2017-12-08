/**
 * Client-side rendering of the App.
 */

import analytics from 'analytics.js';
import authActions from 'actions/auth';
import directActions from 'actions/direct';
import userGroupsActions from 'actions/groups';
import cookies from 'browser-cookies';
import { BrowserRouter, browserHistory } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {
  configureConnector,
  decodeToken,
  getFreshToken,
} from 'tc-accounts';
import logger from 'utils/logger';
import { setErrorsStore } from 'utils/errors';

import storeFactory from '../shared/store-factory';
import './styles.scss';

const actions = {
  ...authActions,
  ...directActions,
  ...userGroupsActions,
};

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
let analyticsIdentitySet = false;
let firstAuth = true;
function authenticate(store) {
  /* TODO: The iframe injected into the page by this call turns out to be
   * visible as a tiny nob (~3x3 px). It has html ID `tc-accounts-iframe`
   * (as specified in this call). We should hide it by adding the proper side
   * in our stylesheet, or to figure out, why it is not hidden by default.  */
  if (firstAuth) {
    firstAuth = false;
    configureConnector({
      connectorUrl: config.URL.ACCOUNTS_APP_CONNECTOR,
      frameId: 'tc-accounts-iframe',
    });
  }

  getFreshToken().then((tctV3) => {
    const tctV2 = cookies.get('tcjwt');
    logger.log('Authenticated as:', decodeToken(tctV3));
    if (!tctV2) logger.error('Failed to fetch API v2 token!');
    return ({ tctV2, tctV3 });
  }).catch(() => {
    logger.warn('Authentication failed!');
    return ({});
  }).then(({ tctV2, tctV3 }) => {
    const auth = store.getState().auth;
    if (auth.tokenV3 !== (tctV3 || null)) {
      store.dispatch(actions.auth.setTcTokenV3(tctV3));
      store.dispatch(actions.auth.loadProfile(tctV3));
    }
    if (auth.tokenV2 !== (tctV2 || null)) {
      store.dispatch(actions.auth.setTcTokenV2(tctV2));
    }

    const userV3 = tctV3 ? decodeToken(tctV3) : {};
    const prevUserV3 = auth.tokenV3 ? decodeToken(auth.tokenV3) : {};

    if (userV3.userId
    && (!analyticsIdentitySet || userV3.userId !== prevUserV3.userId)) {
      analyticsIdentitySet = true;
      analytics.identify(userV3.userId, {
        name: userV3.userId,
        email: userV3.email,
      });
    }

    /* If we enter the following "if" block, it means that our visitor used
     * to be authenticated before, but now he has lost his authentication;
     * or he has authenticated as a different user. In both cases, we must drop
     * from the state all sensitive data, accessible only to specific users. */
    if (prevUserV3.handle && prevUserV3.handle !== userV3.handle) {
      store.dispatch(actions.direct.dropAll());
      store.dispatch(actions.groups.dropGroups());
    }

    /* Automatic refreshment of auth tokens. */
    let time = Number.MAX_VALUE;
    if (tctV2) time = decodeToken(tctV2).exp;
    if (userV3) time = Math.min(time, userV3.exp);
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
  setErrorsStore(store);

  function render() {
    const App = require('../shared').default; // eslint-disable-line global-require
    ReactDOM.hydrate(
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
  }
});
