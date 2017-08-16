import LoadingIndicator from 'components/LoadingIndicator';
import React from 'react';
import { SplitRoute } from 'utils/router';

export default function SubmissionManagementRoute() {
  return (
    <SplitRoute
      cacheCss
      chunkName="submission-management"
      exact
      path="/challenges/:challengeId/my-submissions"
      renderClientAsync={props =>
        import(
          /* webpackChunkName: "submission-management" */
          'containers/SubmissionManagement',
        ).then(({ default: SubmissionManagement }) => (
          <SubmissionManagement {...props} />
        ))
      }
      renderPlaceholder={() => <LoadingIndicator />}
    />
  );
}
