/**
 * Sandbox router.
 */

/* global window */

import CmsDasbhoardAnnouncements from
  'containers/sandbox/cms/dashboard/Announcements';
import CmsTesting from 'components/sandbox/cms/Testing';
import Error404 from 'components/Error404';
import PT from 'prop-types';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { config, isomorphy } from 'topcoder-react-utils';

export default function Router({ base }) {
  const paymentBase = `${base}/payments`;
  return (
    <Switch>
      <Route
        component={() => {
          if (isomorphy.isClientSide()) {
            window.location = config.URL.PAYMENT_TOOL;
          }
          return null;
        }}
        path={paymentBase}
      />
      <Redirect
        from={paymentBase}
        to={config.URL.PAYMENT_TOOL}
      />
      <Route
        component={CmsDasbhoardAnnouncements}
        path={`${base}/cms/dashboard/announcements`}
      />
      <Route
        component={CmsTesting}
        path={`${base}/cms/testing`}
      />
      <Error404 />
    </Switch>
  );
}

Router.propTypes = {
  base: PT.string.isRequired,
};
