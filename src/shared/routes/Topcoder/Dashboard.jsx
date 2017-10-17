import LoadingIndicator from 'components/LoadingIndicator';
import React from 'react';
import { SplitRoute } from 'utils/router';

export default function DashboardRoute(props) {
  return (
    <SplitRoute
      cacheCss
      chunkName="dashboard/chunk"
      exact
      path="/my-dashboard"
      renderClientAsync={() =>
        import(
          /* webpackChunkName: "dashboard/chunk" */
          'containers/Dashboard',
        ).then(({ default: Dashboard }) => (
          <Dashboard {...props} />
        ))
      }
      renderPlaceholder={() => <LoadingIndicator />}
    />
  );
}
