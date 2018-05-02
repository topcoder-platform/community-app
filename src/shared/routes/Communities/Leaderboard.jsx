/**
 * Code chunk fro Leaderboard.
 */

import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import { AppChunk } from 'topcoder-react-utils';

export default function LeaderboardRoute({ meta }) {
  return (
    <AppChunk
      chunkName="leaderboard/chunk"
      renderClientAsync={() =>
        import(/* webpackChunkName: "leaderboard/chunk" */ 'containers/Leaderboard')
        .then(({ default: Leaderboard }) => (
          <Leaderboard apiUrl={meta.leaderboardApiUrl} />
        ))
      }
      renderPlaceholder={() => <LoadingIndicator />}
    />
  );
}

LeaderboardRoute.propTypes = {
  meta: PT.shape({
    leaderboardApiUrl: PT.string.isRequired,
  }).isRequired,
};
