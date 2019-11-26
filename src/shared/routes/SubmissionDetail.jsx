import LoadingIndicator from 'components/LoadingIndicator';
import React from 'react';
import { AppChunk } from 'topcoder-react-utils';

export default function SubmissionDetailRoute(props) {
  return (
    <AppChunk
      chunkName="submission-detail/chunk"
      renderClientAsync={() => import(/* webpackChunkName: "submission-detail/chunk" */ 'containers/SubmissionDetail')
        .then(({ default: SubmissionDetail }) => (
          <SubmissionDetail {...props} />
        ))
      }
      renderPlaceholder={() => <LoadingIndicator />}
    />
  );
}
