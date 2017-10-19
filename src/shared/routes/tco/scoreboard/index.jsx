import LoadingIndicator from 'components/LoadingIndicator';
import React from 'react';
import { SplitRoute } from 'utils/router';

export default function ScoreboardRoute(props) {
  return (
    <SplitRoute
      cacheCss
      chunkName="scoreboard/chunk"
      exact
      path="/scoreboard/:challengeId"
      renderClientAsync={() =>
        import(
          /* webpackChunkName: "scoreboard/chunk" */
          'containers/tco/scoreboard',
        ).then(({ default: Scoreboard }) => (
          <Scoreboard {...props} />
        ))
      }
      renderPlaceholder={() => <LoadingIndicator />}
    />
  );
}
