/**
 * Code chunk for Challenge Listing inside community.
 */

import _ from 'lodash';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import qs from 'qs';
import React from 'react';
import { AppChunk } from 'topcoder-react-utils';

export default function ChallengeListingRoute({
  ChallengeListingBanner,
  challengesUrl,
  extraBucket,
  hideSrm,
  listingOnly,
  meta,
  newChallengeDetails,
  preListingMsg,
}) {
  return (
    <AppChunk
      chunkName="challenge-listing/chunk"
      renderClientAsync={routeProps => import(/* webpackChunkName: "challenge-listing/chunk" */ 'containers/challenge-listing/Listing')
        .then(({ default: ChallengeListing }) => {
          let query = routeProps.location.search;
          query = query ? qs.parse(query.slice(1)) : {};
          const currencyFromUrl = query ? query.currency : undefined;
          const prizeMode = currencyFromUrl && `money-${currencyFromUrl}`;

          let { communityId } = query;
          if (!communityId
          && (!_.get(meta, 'challengeListing.ignoreCommunityFilterByDefault')
          || meta.communityId === 'wipro')) {
            ({ communityId } = meta);
          }

          return (
            <ChallengeListing
              {...routeProps}
              ChallengeListingBanner={ChallengeListingBanner}
              challengesUrl={challengesUrl}
              communityId={communityId}
              communityName={meta.communityName}
              defaultCommunityId={meta.communityId}
              extraBucket={extraBucket}
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
              preListingMsg={preListingMsg}
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
  ChallengeListingBanner: null,
  challengesUrl: '/challenges',
  extraBucket: null,
  hideSrm: false,
  listingOnly: false,
  newChallengeDetails: false,
  preListingMsg: null,
};

ChallengeListingRoute.propTypes = {
  ChallengeListingBanner: PT.node,
  challengesUrl: PT.string,
  extraBucket: PT.string,
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
  preListingMsg: PT.node,
};
