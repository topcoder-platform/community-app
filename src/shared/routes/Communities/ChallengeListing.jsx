/**
 * Code chunk for Challenge Listing inside community.
 */

import _ from 'lodash';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import qs from 'qs';
import React from 'react';
import { SplitRoute } from 'utils/router';

export default function ChallengeListingRoute({
  challengesUrl,
  meta,
  newChallengeDetails,
}) {
  return (
    <SplitRoute
      cacheCss
      chunkName="challenge-listing"
      renderClientAsync={routeProps =>
        import(
          /* webpackChunkName: "challenge-listing" */
          'containers/challenge-listing/Listing',
        ).then(({ default: ChallengeListing }) => {
          let query = routeProps.location.search;
          query = query ? qs.parse(query.slice(1)) : {};
          const currencyFromUrl = query ? query.currency : undefined;
          const prizeMode = currencyFromUrl && `money-${currencyFromUrl}`;
          return (
            <ChallengeListing
              {...routeProps}
              challengesUrl={challengesUrl}
              communityId={query.communityId || meta.communityId}
              communityName={meta.communityName}
              groupId={meta.groupId}

              /* TODO: This is hacky! A better, generic way to achieve it
               * should be adopted. */
              hideTcLinksInSidebarFooter={meta.communityId === 'wipro'}

              newChallengeDetails={newChallengeDetails}
              openChallengesInNewTabs={
                _.get(meta, 'challengeListing.openChallengesInNewTabs')
              }
              prizeMode={prizeMode}
            />
          );
        })
      }
      renderPlaceholder={() => <LoadingIndicator />}
    />
  );
}

ChallengeListingRoute.defaultProps = {
  challengesUrl: '/challenges',
  newChallengeDetails: false,
};

ChallengeListingRoute.propTypes = {
  challengesUrl: PT.string,
  meta: PT.shape({
    challengeListing: PT.shape({
      openChallengesInNewTabs: PT.bool,
    }),
    communityId: PT.string.isRequired,
    communityName: PT.string.isRequired,
    groupId: PT.string.isRequired,
  }).isRequired,
  newChallengeDetails: PT.bool,
};
