/**
 * Loader for the community's code chunks.
 */

import LoadingIndicator from 'components/LoadingIndicator';
import path from 'path';
import PT from 'prop-types';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { requireWeak, resolveWeak, SplitRoute } from 'utils/router';

export default function ChunkLoader({ base, meta }) {
  return (
    <SplitRoute
      cacheCss
      chunkName="wipro-community/chunk"
      renderClientAsync={() =>
        import(
          /* webpackChunkName: "wipro-community/chunk" */
          './Routes',
        ).then(({ default: Routes }) => <Routes base={base} meta={meta} />)
      }
      renderPlaceholder={() => <LoadingIndicator />}
      renderServer={(routeProps) => {
        const p = resolveWeak('./Routes');
        const Routes = requireWeak(path.resolve(__dirname, p));
        return (
          <StaticRouter
            context={routeProps.staticContext}
            location={routeProps.location}
          ><Routes base={base} meta={meta} /></StaticRouter>
        );
      }}
    />
  );
}

ChunkLoader.propTypes = {
  base: PT.string.isRequired,
  meta: PT.shape().isRequired,
};
