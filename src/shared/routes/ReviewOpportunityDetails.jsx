/**
 * The loader of Review Opportunity Details Page code chunks.
 */
import path from 'path';
import React from 'react';

import LoadingPagePlaceholder from 'components/LoadingPagePlaceholder';
import { AppChunk, webpack } from 'topcoder-react-utils';

export default function ReviewOpportunityDetails(props) {
  return (
    <AppChunk
      chunkName="review-opportunity-details/chunk"
      renderClientAsync={() =>
        import(/* webpackChunkName: "review-opportunity-details/chunk" */ 'containers/ReviewOpportunityDetails')
        .then(({ default: ReviewOpportunityDetailsContainer }) => (
          <ReviewOpportunityDetailsContainer {...props} />
        ))
      }
      renderPlaceholder={() => <LoadingPagePlaceholder />}
      renderServer={() => {
        const p = webpack.resolveWeak('containers/ReviewOpportunityDetails');
        const ReviewOpportunityDetailsContainer =
          webpack.requireWeak(path.resolve(__dirname, p));
        return <ReviewOpportunityDetailsContainer {...props} />;
      }}
    />
  );
}
