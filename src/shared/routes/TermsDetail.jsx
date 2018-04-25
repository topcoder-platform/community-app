/**
 * The loader of Terms Detail Page code chunks.
 * It is re-used both inside the Main Topcoder Community website, and inside
 * other Topcoder Communities, as, at the moment, no difference in the loader
 * code is necessary between these two usecases.
 */

import LoadingPagePlaceholder from 'components/LoadingPagePlaceholder';
import path from 'path';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { requireWeak, resolveWeak, SplitRoute } from 'utils/router';

export default function TermsDetailRoute(props) {
  return (
    <SplitRoute
      cacheCss
      chunkName="terms-detail/chunk"
      renderClientAsync={() =>
        import(/* webpackChunkName: "terms-detail/chunk" */ 'containers/terms-detail')
        .then(({ default: TermsDetail }) => (
          <TermsDetail {...props} />
        ))
      }
      renderPlaceholder={() => <LoadingPagePlaceholder />}
      renderServer={() => {
        const p = resolveWeak('containers/terms-detail');
        const TermsDetail = requireWeak(path.resolve(__dirname, p));
        return (
          <StaticRouter context={{}}>
            <TermsDetail {...props} />
          </StaticRouter>
        );
      }}
    />
  );
}
