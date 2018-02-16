
import LoadingIndicator from 'components/LoadingIndicator';
import React from 'react';
import { SplitRoute } from 'utils/router';

export default function QualityAssuranceIssues() {
  return (
    <SplitRoute
      cacheCss
      chunkName="quality-assurance/issues/chunk"
      renderClientAsync={renderProps =>
        import(
          /* webpackChunkName: "quality-assurance/issues/chunk" */
          'containers/quality-assurance/issues',
        ).then(({ default: QualityAssuranceIssuesListing }) =>
          <QualityAssuranceIssuesListing {...renderProps} />,
        )
      }
      renderPlaceholder={() => <LoadingIndicator />}
    />
  );
}
