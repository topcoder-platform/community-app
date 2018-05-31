import LoadingIndicator from 'components/LoadingIndicator';
import React from 'react';
import { AppChunk } from 'topcoder-react-utils';

export default function SubmissionManagementRoute(props) {
  return (
    <AppChunk
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
