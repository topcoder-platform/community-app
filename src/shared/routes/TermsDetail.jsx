/**
 * The loader of Terms Detail Page code chunks.
 * It is re-used both inside the Main Topcoder Community website, and inside
 * other Topcoder Communities, as, at the moment, no difference in the loader
 * code is necessary between these two usecases.
 */

import LoadingPagePlaceholder from 'components/LoadingPagePlaceholder';
import path from 'path';
import React from 'react';
import { AppChunk, webpack } from 'topcoder-react-utils';

export default function TermsDetailRoute(props) {
  return (
    <AppChunk
      chunkName="terms-detail/chunk"
      renderClientAsync={() =>
        import(/* webpackChunkName: "terms-detail/chunk" */ 'containers/terms-detail')
        .then(({ default: TermsDetail }) => (
          <TermsDetail {...props} />
        ))
      }
      renderPlaceholder={() => <LoadingPagePlaceholder />}
      renderServer={() => {
        const p = webpack.resolveWeak('containers/terms-detail');
        const TermsDetail = webpack.requireWeak(path.resolve(__dirname, p));
        return <TermsDetail {...props} />;
      }}
    />
  );
}
