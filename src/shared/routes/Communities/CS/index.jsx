/**
 * Loader for the community's code chunks.
 */

import LoadingIndicator from 'components/LoadingIndicator';
import path from 'path';
import PT from 'prop-types';
import React from 'react';
import { AppChunk, webpack } from 'topcoder-react-utils';

export default function ChunkLoader({ base, meta }) {
  return (
    <AppChunk
      chunkName="cs-community/chunk"
      renderClientAsync={() =>
        import(/* webpackChunkName: "cs-community/chunk" */ './Routes')
        .then(({ default: Routes }) => <Routes base={base} meta={meta} />)
      }
      renderPlaceholder={() => <LoadingIndicator />}
      renderServer={() => {
        const Routes = webpack.requireWeak(path.resolve(__dirname, './Routes'));
        return <Routes base={base} meta={meta} />;
      }}
    />
  );
}

ChunkLoader.propTypes = {
  base: PT.string.isRequired,
  meta: PT.shape().isRequired,
};
