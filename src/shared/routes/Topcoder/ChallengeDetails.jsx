import LoadingIndicator from 'components/LoadingIndicator';
import React from 'react';
import { SplitRoute } from 'utils/router';

export default function ChallengeDetailsRoute() {
  return (
    <SplitRoute
      cacheCss
      chunkName="challenge-details"
      exact
      path="/challenges/:challengeId"
      renderClientAsync={props =>
        import(
          /* webpackChunkName: "challenge-details" */
          'containers/challenge-detail',
        ).then(({ default: ChallengeDetails }) => (
          <ChallengeDetails {...props} />
        ))
      }
      renderPlaceholder={() => <LoadingIndicator />}
    />
  );
}
