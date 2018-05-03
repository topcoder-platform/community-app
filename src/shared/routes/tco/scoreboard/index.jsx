import LoadingIndicator from 'components/LoadingIndicator';
import React from 'react';
import { AppChunk } from 'topcoder-react-utils';

export default function ScoreboardRoute(props) {
  return (
    <AppChunk
      chunkName="scoreboard/chunk"
      exact
      path="/scoreboard/:challengeId"
      renderClientAsync={() =>
        import(/* webpackChunkName: "scoreboard/chunk" */ 'containers/tco/scoreboard')
        .then(({ default: Scoreboard }) => (
          <Scoreboard {...props} />
        ))
      }
      renderPlaceholder={() => <LoadingIndicator />}
    />
  );
}
