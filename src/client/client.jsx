/**
 * Client-side rendering of the App.
 */

/* Analytics script is injected via the basic HTML template, because
 * analytics.js version from NPM seems to be outdated (does not play
 * well with Chameleon). */
/* global analytics */

import _ from 'lodash';
import authActions from 'actions/auth';
import directActions from 'actions/direct';
import userGroupsActions from 'actions/groups';
import cookies from 'browser-cookies';
import { BrowserRouter, Route } from 'react-router-dom';
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
 * Performs AnalyticsJS identification of the user.
 * @param {Object} profile TC user profile.
 * @param {Array} roles User roles.
 */
function identify(profile, roles) {
  analytics.identify(profile.userId, {
    avatar: profile.photoURL,
    createdAt: profile.createdAt,
    email: profile.email,
    firstName: profile.firstName,
    id: profile.userId,
    lastName: profile.lastName,
    roles,
    username: profile.handle,
  });
}

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
    if (auth.profile && !analyticsIdentitySet) {
      identify(auth.profile, _.get(auth, 'user.roles'));
      analyticsIdentitySet = true;
    }
    if (auth.tokenV3 !== (tctV3 || null)) {
      const action = actions.auth.loadProfile(tctV3);
      action.payload.then((profile) => {
        if (!profile) return;
        const user = decodeToken(tctV3);
        const userId = profile && profile.userId;
        const prevUserId = _.get(store.getState(), 'auth.profile.userId');
        if (userId && userId !== prevUserId) {
          identify(profile, _.get(auth, user.roles));
          analyticsIdentitySet = true;
        }
      });
      store.dispatch(actions.auth.setTcTokenV3(tctV3));
      store.dispatch(action);
    }
    if (auth.tokenV2 !== (tctV2 || null)) {
      store.dispatch(actions.auth.setTcTokenV2(tctV2));
    }

    const userV3 = tctV3 ? decodeToken(tctV3) : {};
    const prevUserV3 = auth.tokenV3 ? decodeToken(auth.tokenV3) : {};

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

let prevLocation;
storeFactory(undefined, window.ISTATE).then((store) => {
  authenticate(store);
  setErrorsStore(store);

  function render() {
    const App = require('../shared').default; // eslint-disable-line global-require

    ReactDOM.hydrate(
      <Provider store={store}>
        <BrowserRouter>
          <Route
            component={({ location }) => {
              if (prevLocation !== location) {
                prevLocation = location;
                analytics.page();
              }
              return <App />;
            }}
          />
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
      const stamp = shortId();
      const links = document.querySelectorAll('link[rel=stylesheet]');
      for (let i = 0; i < links.length; i += 1) {
        links[i].href = `${links[i].href.match(/[^?]*/)[0]}?v=${stamp}`;
      }
      hotSuccess();
    };
  }
});
