/**
 * The loader/router for TCO Hall of Fame
 */
import path from 'path';
import React from 'react';
import { StaticRouter } from 'react-router-dom';

import LoadingPagePlaceholder from 'components/LoadingPagePlaceholder';
import { requireWeak, resolveWeak, SplitRoute } from 'utils/router';

export default function HallOfFameRouter(props) {
  return (
    <SplitRoute
      cacheCss
      chunkName="tco/hall-of-fame/chunk"
      renderClientAsync={() =>
        import(
          /* webpackChunkName: "tco/hall-of-fame/chunk" */
          'containers/tco/HallOfFame',
        ).then(({ default: HallOfFameContainer }) => (
          <HallOfFameContainer {...props} />
        ))
      }
      renderPlaceholder={() => <LoadingPagePlaceholder />}
      renderServer={() => {
        const p = resolveWeak('containers/tco/HallOfFame');
        const HallOfFameContainer = requireWeak(path.resolve(__dirname, p));
        return (
          <StaticRouter context={{}}>
            <HallOfFameContainer {...props} />
          </StaticRouter>
        );
      }}
    />
  );
}
