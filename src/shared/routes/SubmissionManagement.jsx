import LoadingIndicator from 'components/LoadingIndicator';
import React from 'react';
import { SplitRoute } from 'utils/router';

export default function SubmissionManagementRoute(props) {
  return (
    <SplitRoute
      chunkName="submission-management/chunk"
      renderClientAsync={() =>
        import(/* webpackChunkName: "submission-management/chunk" */ 'containers/SubmissionManagement')
        .then(({ default: SubmissionManagement }) => (
          <SubmissionManagement {...props} />
        ))
      }
      renderPlaceholder={() => <LoadingIndicator />}
    />
  );
}
