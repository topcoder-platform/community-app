import LoadingIndicator from 'components/LoadingIndicator';
import React from 'react';
import { SplitRoute } from 'utils/router';

export default function DashboardRoute(props) {
  return (
    <SplitRoute
      cacheCss
      chunkName="dashboard"
      exact
      path="/my-dashboard"
      renderClientAsync={() =>
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
