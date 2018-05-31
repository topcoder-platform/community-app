/**
 * Chunk loader for communities code.
 */

import LoadingIndicator from 'components/LoadingIndicator';
import path from 'path';
import PT from 'prop-types';
import React from 'react';
import { AppChunk, webpack } from 'topcoder-react-utils';

export default function ChunkLoader({
  base, communityId, member, meta,
}) {
  return (
    <AppChunk
      key={member}
      chunkName="communities/chunk"
      renderClientAsync={() =>
        import(/* webpackChunkName: "communities/chunk" */ './Routes')
        .then(({ default: Routes }) => (
          <Routes
            base={base}
            communityId={communityId}
            member={member}
            meta={meta}
          />
        ))
      }
      renderPlaceholder={() => <LoadingIndicator />}
      renderServer={() => {
        const Routes = webpack.requireWeak(path.resolve(__dirname, './Routes'));
        return (
          <Routes
            base={base}
            communityId={communityId}
            member={member}
            meta={meta}
          />
        );
      }}
    />
  );
}

ChunkLoader.defaultProps = {
  base: '',
};

ChunkLoader.propTypes = {
  base: PT.string,
  communityId: PT.string.isRequired,
  member: PT.bool.isRequired,
  meta: PT.shape().isRequired,
};
