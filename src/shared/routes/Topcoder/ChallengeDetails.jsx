import LoadingIndicator from 'components/LoadingIndicator';
import React from 'react';
import { SplitRoute } from 'utils/router';

export default function ChallengeDetailsRoute(props) {
  return (
    <SplitRoute
      cacheCss
      chunkName="challenge-details"
      renderClientAsync={() =>
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
