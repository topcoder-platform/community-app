/**
 * The loader of Challenge Details Page code chunks.
 * It is re-used both inside the Main Topcoder Community website, and inside
 * other Topcoder Communities, as, at the moment, no difference in the loader
 * code is necessary between these two usecases.
 */

import LoadingPagePlaceholder from 'components/LoadingPagePlaceholder';
import path from 'path';
import React from 'react';
import { AppChunk, webpack } from 'topcoder-react-utils';

export default function ChallengeDetailsRoute(props) {
  return (
    <AppChunk
      chunkName="challenge-details/chunk"
      renderClientAsync={() =>
        import(/* webpackChunkName: "challenge-details/chunk" */ 'containers/challenge-detail')
        .then(({ default: ChallengeDetails }) => (
          <ChallengeDetails {...props} />
        ))
      }
      renderPlaceholder={() => <LoadingPagePlaceholder />}
      renderServer={() => {
        const p = webpack.resolveWeak('containers/challenge-detail');
        const ChallengeDetails = webpack.requireWeak(path.resolve(__dirname, p));
        return <ChallengeDetails {...props} />;
      }}
    />
  );
}
