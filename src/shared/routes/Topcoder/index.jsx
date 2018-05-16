/**
 * Chunk loader for Topcoder website code.
 */

import LoadingIndicator from 'components/LoadingIndicator';
import path from 'path';
import React from 'react';
import { AppChunk, webpack } from 'topcoder-react-utils';

export default function ChunkLoader() {
  return (
    <AppChunk
      chunkName="topcoder-website/chunk"
      renderClientAsync={() =>
        import(/* webpackChunkName: "topcoder-website/chunk" */'./Routes')
        .then(({ default: Routes }) => <Routes />)
      }
      renderPlaceholder={() => <LoadingIndicator />}
      renderServer={() => {
        const Routes = webpack.requireWeak(path.resolve(__dirname, './Routes'));
        return <Routes />;
      }}
    />
  );
}
