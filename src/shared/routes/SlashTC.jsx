/**
 * The loader of Slash TC page webpack chunks.
 */
import React from 'react';

import LoadingPagePlaceholder from 'components/LoadingPagePlaceholder';
import { AppChunk } from 'topcoder-react-utils';

export default function SlashTCRoute(props) {
  return (
    <AppChunk
      chunkName="slashTC/chunk"
      renderClientAsync={() => import(/* webpackChunkName: "slashTC/chunk" */ 'containers/SlashTC')
        .then(({ default: SlashTCContainer }) => (
          <SlashTCContainer {...props} />
        ))
      }
      renderPlaceholder={() => <LoadingPagePlaceholder />}
    />
  );
}
