/**
 * Routes for Settings
 */

import React from 'react';
import PT from 'prop-types';
import { Route, Switch } from 'react-router-dom';

import Settings from 'containers/Settings';
import Success from 'components/Settings/Account/MyAccount/EmailVerifiResult/Success';
import Failed from 'components/Settings/Account/MyAccount/EmailVerifiResult/Failed';
import Expired from 'components/Settings/Account/MyAccount/EmailVerifiResult/Expired';
import Error404 from 'components/Error404';

export default function Router({ base }) {
  return (
    <Switch>
      <Route component={Settings} exact path={`${base}/:settingsTab(profile|tools|account|preferences)`} />
      <Route render={props => <Success {...props} />} path={`${base}/account/email-verification/success/:handle/:token/:newEmail/:oldEmail/:jwtToken`} />
      <Route component={Failed} exact path={`${base}/account/email-verification/failure`} />
      <Route component={Expired} exact path={`${base}/account/email-verification/expired`} />
      <Error404 />
    </Switch>
  );
}

Router.propTypes = {
  base: PT.string.isRequired,
};
