import LoadingIndicator from 'components/LoadingIndicator';
import React from 'react';
import { SplitRoute } from 'utils/router';

export default function DashboardRoute() {
  return (
    <SplitRoute
      cacheCss
      chunkName="dashboard"
      exact
      path="/my-dashboard"
      renderClientAsync={props =>
        import(
          /* webpackChunkName: "dashboard" */
          'containers/Dashboard',
        ).then(({ default: Dashboard }) => (
          <Dashboard {...props} />
        ))
      }
      renderPlaceholder={() => <LoadingIndicator />}
    />
  );
}
