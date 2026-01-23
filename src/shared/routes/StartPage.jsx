/**
 * The loader of Gigs page webpack chunks.
 */
import React from 'react';

import LoadingPagePlaceholder from 'components/LoadingPagePlaceholder';
import { AppChunk } from 'topcoder-react-utils';

export default function GigsPagesRoute(props) {
  return (
    <AppChunk
      chunkName="policyPages/chunk"
      renderClientAsync={() => import(/* webpackChunkName: "gigsPages/chunk" */ 'containers/GigsPages')
        .then(({ default: GigsPagesContainer }) => (
          <GigsPagesContainer {...props} />
        ))
      }
      renderPlaceholder={() => <LoadingPagePlaceholder />}
    />
  );
}
