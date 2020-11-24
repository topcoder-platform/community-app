/**
 * The loader of EDUTracks page webpack chunks.
 */
import path from 'path';
import React from 'react';
import LoadingPagePlaceholder from 'components/LoadingPagePlaceholder';
import { AppChunk, webpack } from 'topcoder-react-utils';

export default function EDUTracks(props) {
  return (
    <AppChunk
      chunkName="eduTracks/chunk"
      renderClientAsync={() => import(/* webpackChunkName: "eduTracks/chunk" */ 'containers/EDU/Tracks')
        .then(({ default: Tracks }) => (
          <Tracks {...props} />
        ))
      }
      renderPlaceholder={() => <LoadingPagePlaceholder />}
      renderServer={() => {
        const p = webpack.resolveWeak('containers/EDU/Tracks');
        const Tracks = webpack.requireWeak(path.resolve(__dirname, p));
        return <Tracks {...props} />;
      }}
    />
  );
}
