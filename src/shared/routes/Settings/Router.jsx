/**
 * Routes for Settings
 */

import React from 'react';
import PT from 'prop-types';
import { Route, Switch } from 'react-router-dom';

import Settings from 'containers/Settings';
import Success from 'components/Settings/Account/MyAccount/EmailVerifiResult/Success';
import Failed from 'components/Settings/Account/MyAccount/EmailVerifiResult/Failed';
import EmailVerification from 'containers/EmailVerification';
import Error404 from 'components/Error404';

export default function Router({ base }) {
  return (
    <Switch>
      <Route component={Settings} exact path={`${base}/:settingsTab(profile|tools|account|preferences)`} />
      <Route component={EmailVerification} exact path={`${base}/account/changeEmail`} />
      <Route component={Success} exact path={`${base}/account/email-verification/success`} />
      <Route component={Failed} exact path={`${base}/account/email-verification/failure`} />
      <Error404 />
    </Switch>
  );
}

Router.propTypes = {
  base: PT.string.isRequired,
};
