/**
 * Loader for the community's code chunks.
 */

import LoadingIndicator from 'components/LoadingIndicator';
import path from 'path';
import PT from 'prop-types';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { AppChunk, webpack } from 'topcoder-react-utils';

export default function ChunkLoader({ base, meta }) {
  return (
    <AppChunk
      cacheCss
      chunkName="demo-expert-community/chunk"
      renderClientAsync={() =>
        import(/* webpackChunkName: "demo-expert-community/chunk" */ './Routes')
        .then(({ default: Routes }) => <Routes base={base} meta={meta} />)
      }
      renderPlaceholder={() => <LoadingIndicator />}
      renderServer={(routeProps) => {
        const Routes = webpack.requireWeak(path.resolve(__dirname, './Routes'));
        return (
          <StaticRouter
            context={routeProps.staticContext}
            location={routeProps.location}
          ><Routes base={base} meta={meta} />
          </StaticRouter>
        );
      }}
    />
  );
}

ChunkLoader.propTypes = {
  base: PT.string.isRequired,
  meta: PT.shape().isRequired,
};
