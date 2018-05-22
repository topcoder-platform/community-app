import LoadingIndicator from 'components/LoadingIndicator';
import React from 'react';
import { AppChunk } from 'topcoder-react-utils';

export default function SubmissionsPageRoute(props) {
  return (
    <AppChunk
      chunkName="submissions-page/chunk"
      renderClientAsync={() =>
        import(/* webpackChunkName: "submissions-page/chunk" */ 'containers/SubmissionPage')
        .then(({ default: SubmissionsPageContainer }) => (
          <SubmissionsPageContainer {...props} />
        ))
      }
      renderPlaceholder={() => <LoadingIndicator />}
    />
  );
}
