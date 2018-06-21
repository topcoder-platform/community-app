/**
 * Chunk loader for Track Homepages
 */

import React from 'react';
import PT from 'prop-types';
import path from 'path';
import { AppChunk, webpack } from 'topcoder-react-utils';
import LoadingIndicator from 'components/LoadingIndicator';

export default function TrackHomePages({ base }) {
  return (
    <AppChunk
      chunkName="track-homepages/chunk"
      renderClientAsync={() =>
        import(/* webpackChunkName: "track-homepages/chunk" */'./Router')
          .then(({ default: Router }) => <Router base={base} />)
      }
      renderPlaceholder={() => <LoadingIndicator />}
      renderServer={() => {
        const Router = webpack.requireWeak(path.resolve(__dirname, './Router'));
        return <Router base={base} />;
      }}
    />
  );
}

TrackHomePages.propTypes = {
  base: PT.string.isRequired,
};

