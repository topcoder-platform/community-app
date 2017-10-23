/**
 * Routes for the payments segment.
 */

import Editor from 'containers/sandbox/payments/Editor';
import Error404 from 'components/Error404';
import Listing from 'containers/sandbox/payments/Listing';
import PT from 'prop-types';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

export default function Router({ base }) {
  return (
    <Switch>
      <Route
        component={props1 => (
          <Editor paymentId={props1.match.params.paymentId} />
        )}
        exact
        path={`${base}/:paymentId`}
      />
      <Route component={Listing} exact path={base} />
      <Error404 />
    </Switch>
  );
}

Router.propTypes = {
  base: PT.string.isRequired,
};
