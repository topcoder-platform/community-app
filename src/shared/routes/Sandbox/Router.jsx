/**
 * Sandbox router.
 */

import Error404 from 'components/Error404';
import PT from 'prop-types';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import ErrorAlertTest from 'components/sandbox/ErrorAlertTest';

import Payment from './payments';


export default function Router({ base }) {
  const paymentBase = `${base}/payments`;
  return (
    <Switch>
      <Route
        component={() => <Payment base={paymentBase} />}
        path={paymentBase}
      />
      <Route
        component={() => <ErrorAlertTest />}
        path={`${base}/errortest`}
      />
      <Error404 />
    </Switch>
  );
}

Router.propTypes = {
  base: PT.string.isRequired,
};
