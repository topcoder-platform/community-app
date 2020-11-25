/**
 * The loader of Gigs page webpack chunks.
 */
import path from 'path';
import React from 'react';
import LoadingPagePlaceholder from 'components/LoadingPagePlaceholder';
import { AppChunk, webpack } from 'topcoder-react-utils';

export default function GigsPagesRoute(props) {
  return (
    <AppChunk
      chunkName="gigsPages/chunk"
      renderClientAsync={() => import(/* webpackChunkName: "gigsPages/chunk" */ 'containers/GigsPages')
        .then(({ default: GigsPagesContainer }) => (
          <GigsPagesContainer {...props} />
        ))
      }
      renderPlaceholder={() => <LoadingPagePlaceholder />}
      renderServer={() => {
        const p = webpack.resolveWeak('containers/GigsPages');
        const GigsPagesContainer = webpack.requireWeak(path.resolve(__dirname, p));
        return <GigsPagesContainer {...props} />;
      }}
    />
  );
}
