/**
 * The loader of Policy page webpack chunks.
 */
import React from 'react';

import LoadingPagePlaceholder from 'components/LoadingPagePlaceholder';
import { AppChunk } from 'topcoder-react-utils';

export default function PolicyPagesRoute(props) {
  return (
    <AppChunk
      chunkName="policyPages/chunk"
      renderClientAsync={() => import(/* webpackChunkName: "policyPages/chunk" */ 'containers/PolicyPages')
        .then(({ default: PolicyPagesContainer }) => (
          <PolicyPagesContainer {...props} />
        ))
      }
      renderPlaceholder={() => <LoadingPagePlaceholder />}
    />
  );
}
