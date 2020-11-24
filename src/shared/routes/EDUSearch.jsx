/**
 * The loader of EDUSearch page webpack chunks.
 */
import path from 'path';
import React from 'react';
import LoadingPagePlaceholder from 'components/LoadingPagePlaceholder';
import { AppChunk, webpack } from 'topcoder-react-utils';

export default function EDUSearch(props) {
  return (
    <AppChunk
      chunkName="eduSearch/chunk"
      renderClientAsync={() => import(/* webpackChunkName: "eduSearch/chunk" */ 'containers/EDU/Search')
        .then(({ default: Search }) => (
          <Search {...props} />
        ))
      }
      renderPlaceholder={() => <LoadingPagePlaceholder />}
      renderServer={() => {
        const p = webpack.resolveWeak('containers/EDU/Search');
        const Search = webpack.requireWeak(path.resolve(__dirname, p));
        return <Search {...props} />;
      }}
    />
  );
}
