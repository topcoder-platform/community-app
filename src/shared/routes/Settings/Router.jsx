/**
 * Routes for Settings
 */

import React from 'react';
import PT from 'prop-types';
import { Route, Switch } from 'react-router-dom';

import EmailVerification from 'containers/EmailVerification';
import Error404 from 'components/Error404';

export default function Router({ base }) {
  return (
    <Switch>
      <Route component={EmailVerification} exact path={`${base}/account/changeEmail`} />
      <Error404 />
    </Switch>
  );
}

Router.propTypes = {
  base: PT.string.isRequired,
};
