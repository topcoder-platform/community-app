/**
 * The loader of Review Opportunity Details Page code chunks.
 */
import path from 'path';
import React from 'react';
import { StaticRouter } from 'react-router-dom';

import LoadingPagePlaceholder from 'components/LoadingPagePlaceholder';
import { requireWeak, resolveWeak, SplitRoute } from 'utils/router';

export default function ReviewOpportunityDetails(props) {
  return (
    <SplitRoute
      cacheCss
      chunkName="review-opportunity-details/chunk"
      renderClientAsync={() =>
        import(
          /* webpackChunkName: "review-opportunity-details/chunk" */
          'containers/ReviewOpportunityDetails',
        ).then(({ default: ReviewOpportunityDetailsContainer }) => (
          <ReviewOpportunityDetailsContainer {...props} />
        ))
      }
      renderPlaceholder={() => <LoadingPagePlaceholder />}
      renderServer={() => {
        const p = resolveWeak('containers/ReviewOpportunityDetails');
        const ReviewOpportunityDetailsContainer = requireWeak(path.resolve(__dirname, p));
        return (
          <StaticRouter context={{}}>
            <ReviewOpportunityDetailsContainer {...props} />
          </StaticRouter>
        );
      }}
    />
  );
}
