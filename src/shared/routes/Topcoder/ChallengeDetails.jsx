import LoadingPagePlaceholder from 'components/LoadingPagePlaceholder';
import path from 'path';
import React from 'react';
import { requireWeak, resolveWeak, SplitRoute } from 'utils/router';

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
      renderPlaceholder={() => <LoadingPagePlaceholder />}
      renderServer={() => {
        const p = resolveWeak('containers/challenge-detail');
        const ChallengeDetails = requireWeak(path.resolve(__dirname, p));
        return <ChallengeDetails {...props} />;
      }}
    />
  );
}
