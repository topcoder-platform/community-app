import LoadingIndicator from 'components/LoadingIndicator';
import path from 'path';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { AppChunk, webpack } from 'topcoder-react-utils';

export default function EngagementListingRoute() {
  return (
    <AppChunk
      cacheCss
      chunkName="engagement-listing/chunk"
      renderClientAsync={renderProps => import(/* webpackChunkName: "engagement-listing/chunk" */ 'containers/engagement-listing')
        .then(({ default: EngagementListing }) => (
          <EngagementListing {...renderProps} />
        ))
      }
      renderPlaceholder={() => <LoadingIndicator />}
      renderServer={(renderProps) => {
        const p = webpack.resolveWeak('containers/engagement-listing');
        const EngagementListing = webpack.requireWeak(path.resolve(__dirname, p));
        return (
          <StaticRouter
            context={renderProps.staticContext}
            location={renderProps.location}
          >
            <EngagementListing {...renderProps} />
          </StaticRouter>
        );
      }}
    />
  );
}
