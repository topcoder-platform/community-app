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
      chunkName="tco/hall-of-fame/chunk"
      renderClientAsync={() =>
        import(/* webpackChunkName: "tco/hall-of-fame/chunk" */ 'containers/tco/HallOfFame')
        .then(({ default: HallOfFameContainer }) => (
          <HallOfFameContainer {...props} />
        ))
      }
      renderPlaceholder={() => <LoadingPagePlaceholder />}
      renderServer={() => {
        const p = webpack.resolveWeak('containers/tco/HallOfFame');
        const HallOfFameContainer =
          webpack.requireWeak(path.resolve(__dirname, p));
        return <HallOfFameContainer {...props} />;
      }}
    />
  );
}
