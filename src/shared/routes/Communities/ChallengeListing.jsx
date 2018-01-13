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
  hideSrm,
  listingOnly,
  meta,
  newChallengeDetails,
}) {
  return (
    <SplitRoute
      cacheCss
      chunkName="challenge-listing/chunk"
      renderClientAsync={routeProps =>
        import(
          /* webpackChunkName: "challenge-listing/chunk" */
          'containers/challenge-listing/Listing',
        ).then(({ default: ChallengeListing }) => {
          let query = routeProps.location.search;
          query = query ? qs.parse(query.slice(1)) : {};
          const currencyFromUrl = query ? query.currency : undefined;
          const prizeMode = currencyFromUrl && `money-${currencyFromUrl}`;

          let communityId = query.communityId;
          if (!communityId
          && !_.get(meta, 'challengeListing.ignoreCommunityFilterByDefault')) {
            communityId = meta.communityId;
          }

          return (
            <ChallengeListing
              {...routeProps}
              challengesUrl={challengesUrl}
              communityId={communityId}
              communityName={meta.communityName}
              defaultCommunityId={meta.communityId}
              groupIds={meta.groupIds}
              hideSrm={hideSrm}

              /* TODO: This is hacky! A better, generic way to achieve it
               * should be adopted. */
              hideTcLinksInSidebarFooter={meta.communityId === 'wipro'}

              listingOnly={listingOnly}
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
  hideSrm: false,
  listingOnly: false,
  newChallengeDetails: false,
};

ChallengeListingRoute.propTypes = {
  challengesUrl: PT.string,
  hideSrm: PT.bool,
  listingOnly: PT.bool,
  meta: PT.shape({
    challengeListing: PT.shape({
      openChallengesInNewTabs: PT.bool,
    }),
    communityId: PT.string.isRequired,
    communityName: PT.string.isRequired,
    groupIds: PT.arrayOf(PT.string).isRequired,
  }).isRequired,
  newChallengeDetails: PT.bool,
};
