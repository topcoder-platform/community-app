import LoadingIndicator from 'components/LoadingIndicator';
import React from 'react';
import { SplitRoute } from 'utils/router';

export default function SubmissionsPageRoute(props) {
  return (
    <SplitRoute
      chunkName="submissions-page"
      renderClientAsync={() =>
        import(
          /* webpackChunkName: "submissions-page" */
          'containers/page/challenge-details/submission',
        ).then(({ default: SubmissionsPageContainer }) => (
          <SubmissionsPageContainer {...props} />
        ))
      }
      renderPlaceholder={() => <LoadingIndicator />}
    />
  );
}
