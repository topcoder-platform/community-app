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
      renderClientAsync={renderProps => import(/* webpackChunkName: "gigsPages/chunk" */ 'containers/GigsPages')
        .then(({ default: GigsPagesContainer }) => (
          <GigsPagesContainer {...props} {...renderProps} />
        ))
      }
      renderPlaceholder={() => <LoadingPagePlaceholder />}
      renderServer={(renderProps) => {
        const p = webpack.resolveWeak('containers/GigsPages');
        const GigsPagesContainer = webpack.requireWeak(path.resolve(__dirname, p));
        return <GigsPagesContainer {...props} {...renderProps} />;
      }}
    />
  );
}
