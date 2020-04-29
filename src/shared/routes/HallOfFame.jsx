/**
 * The loader/router for TCO Hall of Fame
 */
import React from 'react';

import LoadingPagePlaceholder from 'components/LoadingPagePlaceholder';
import { AppChunk } from 'topcoder-react-utils';

export default function HallOfFameRouter(props) {
  return (
    <AppChunk
      chunkName="hall-of-fame/chunk"
      renderClientAsync={() => import(/* webpackChunkName: "hall-of-fame/chunk" */ 'components/HallOfFamePage')
        .then(({ default: HallOfFameContainer }) => (
          <HallOfFameContainer {...props} />
        ))
      }
      renderPlaceholder={() => <LoadingPagePlaceholder />}
    />
  );
}
