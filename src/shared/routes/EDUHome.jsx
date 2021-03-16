/**
 * The loader of EDUHome page webpack chunks.
 */
import path from 'path';
import React from 'react';
import LoadingPagePlaceholder from 'components/LoadingPagePlaceholder';
import { AppChunk, webpack } from 'topcoder-react-utils';

export default function EDUHome(props) {
  return (
    <AppChunk
      chunkName="eduHome/chunk"
      renderClientAsync={() => import(/* webpackChunkName: "eduHome/chunk" */ 'containers/EDU/Home')
        .then(({ default: Home }) => (
          <Home {...props} />
        ))
      }
      renderPlaceholder={() => <LoadingPagePlaceholder />}
      renderServer={() => {
        const p = webpack.resolveWeak('containers/EDU/Home');
        const Home = webpack.requireWeak(path.resolve(__dirname, p));
        return <Home {...props} />;
      }}
    />
  );
}
