import LoadingIndicator from 'components/LoadingIndicator';
import React from 'react';
import { SplitRoute } from 'utils/router';

export default function SubmissionManagementRoute(props) {
  return (
    <SplitRoute
      chunkName="submission-management"
      renderClientAsync={() =>
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
