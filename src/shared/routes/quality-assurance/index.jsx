
import _ from 'lodash';
import LoadingIndicator from 'components/LoadingIndicator';
import qs from 'qs';
import React from 'react';
import { SplitRoute } from 'utils/router';

export default function QualityAssurance() {
  return (
    <SplitRoute
      cacheCss
      chunkName="quality-assurance/chunk"
      renderClientAsync={renderProps =>
        import(
          'containers/quality-assurance/bug-tracker-listing',
        ).then(({ default: BugTrackerListing }) => {
          const bugId = "Testing";
          return (
            <BugTrackerListing
              {...renderProps}
              bugId={bugId}
            />
          );
        })
      }
      renderPlaceholder={() => <LoadingIndicator />}
    />
  );
}
