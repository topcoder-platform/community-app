/**
 * Chunk loader for Topcoder website code.
 */

import LoadingIndicator from 'components/LoadingIndicator';
import path from 'path';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { requireWeak, resolveWeak, SplitRoute } from 'utils/router';

export default function ChunkLoader() {
  return (
    <SplitRoute
      cacheCss
      chunkName="topcoder-website/chunk"
      renderClientAsync={() =>
        import(
          /* webpackChunkName: "topcoder-website/chunk" */
          './Routes',
        ).then(({ default: Routes }) => <Routes />)
      }
      renderPlaceholder={() => <LoadingIndicator />}
      renderServer={(routeProps) => {
        const p = resolveWeak('./Routes');
        const Routes = requireWeak(path.resolve(__dirname, p));
        return (
          <StaticRouter
            context={routeProps.staticContext}
            location={routeProps.location}
          ><Routes /></StaticRouter>
        );
      }}
    />
  );
}
