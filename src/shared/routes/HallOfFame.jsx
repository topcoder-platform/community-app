/**
 * The loader/router for TCO Hall of Fame
 */
import path from 'path';
import React from 'react';

import LoadingPagePlaceholder from 'components/LoadingPagePlaceholder';
import { AppChunk, webpack } from 'topcoder-react-utils';

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
      renderServer={() => {
        const p = webpack.resolveWeak('components/HallOfFamePage');
        const HallOfFameContainer = webpack.requireWeak(path.resolve(__dirname, p));
        return <HallOfFameContainer {...props} />;
      }}
    />
  );
}
