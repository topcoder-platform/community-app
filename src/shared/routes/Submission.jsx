import LoadingIndicator from 'components/LoadingIndicator';
import React from 'react';
import path from 'path';
import { AppChunk, webpack } from 'topcoder-react-utils';

export default function SubmissionsPageRoute(props) {
  return (
    <AppChunk
      chunkName="submissions-page/chunk"
      renderClientAsync={() => import(/* webpackChunkName: "submissions-page/chunk" */ 'containers/SubmissionPage')
        .then(({ default: SubmissionsPageContainer }) => (
          <SubmissionsPageContainer {...props} />
        ))
      }
      renderPlaceholder={() => <LoadingIndicator />}
      renderServer={() => {
        const p = webpack.resolveWeak('containers/SubmissionPage');
        const ChallengeDetails = webpack.requireWeak(path.resolve(__dirname, p));
        return <ChallengeDetails {...props} />;
      }}
    />
  );
}
