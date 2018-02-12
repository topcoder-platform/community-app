/**
 * The actual listing of the challenge cards.
 */

import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { BUCKETS, getBuckets, isReviewOpportunitiesBucket } from 'utils/challenge-listing/buckets';
import Bucket from './Bucket';
import ReviewOpportunityBucket from './ReviewOpportunityBucket';
import './style.scss';

export default function Listing({
  activeBucket,
  auth,
  challenges,
  challengesUrl,
  communityName,
  extraBucket,
  filterState,
  keepPastPlaceholders,
  loadingDraftChallenges,
  loadingPastChallenges,
  loadingReviewOpportunities,
  loadMoreDraft,
  loadMorePast,
  loadMoreReviewOpportunities,
  newChallengeDetails,
  openChallengesInNewTabs,
  preListingMsg,
  prizeMode,
  reviewOpportunities,
  selectBucket,
  selectChallengeDetailsTab,
  selectedCommunityId,
  setFilterState,
  setSort,
  sorts,
  expandedTags,
  expandTag,
}) {
  const buckets = getBuckets(_.get(auth.user, 'handle'));
  const getBucket = (bucket, expanded = false) => {
    let keepPlaceholders = false;
    let loading;
    let loadMore;
    switch (bucket) {
      case BUCKETS.PAST:
        keepPlaceholders = keepPastPlaceholders;
        loading = loadingPastChallenges;
        loadMore = loadMorePast;
        break;
      case BUCKETS.UPCOMING:
        loading = loadingDraftChallenges;
        loadMore = loadMoreDraft;
        break;
      default: break;
    }
    return (
      /* Review Opportunities use a different Bucket, Card and data source than normal challenges
       * and are only shown when explicitly chosen from the sidebar */
      isReviewOpportunitiesBucket(bucket) ?
        <ReviewOpportunityBucket
          bucket={buckets[bucket]}
          challengesUrl={challengesUrl}
          expandedTags={expandedTags}
          expandTag={expandTag}
          filterState={filterState}
          keepPlaceholders={keepPlaceholders}
          loading={loadingReviewOpportunities}
          loadMore={loadMoreReviewOpportunities}
          opportunities={reviewOpportunities}
          setFilterState={setFilterState}
          setSort={sort => setSort(bucket, sort)}
          sort={sorts[bucket]}
        />
        :
        <Bucket
          bucket={buckets[bucket]}
          bucketId={bucket}
          challenges={challenges}
          challengesUrl={challengesUrl}
          communityName={communityName}
          expand={() => selectBucket(bucket)}
          expanded={expanded}
          expandedTags={expandedTags}
          expandTag={expandTag}
          filterState={filterState}
          keepPlaceholders={keepPlaceholders}
          loading={loading}
          loadMore={loadMore}
          newChallengeDetails={newChallengeDetails}
          openChallengesInNewTabs={openChallengesInNewTabs}
          prizeMode={prizeMode}
          selectChallengeDetailsTab={selectChallengeDetailsTab}
          selectedCommunityId={selectedCommunityId}
          setFilterState={setFilterState}
          setSort={sort => setSort(bucket, sort)}
          sort={sorts[bucket]}
          userHandle={_.get(auth, 'user.handle')}
        />
    );
  };

  if ((activeBucket !== BUCKETS.ALL)
  && (activeBucket !== BUCKETS.SAVED_FILTER)) {
    return (
      <div styleName="challengeCardContainer">
        {getBucket(activeBucket, true)}
      </div>
    );
  }

  return (
    <div styleName="challengeCardContainer">
      {preListingMsg}
      {auth.user ? getBucket(BUCKETS.MY) : null}
      {extraBucket ? getBucket(extraBucket) : null}
      {getBucket(BUCKETS.OPEN_FOR_REGISTRATION)}
      {getBucket(BUCKETS.ONGOING)}
      {/* NOTE: We do not show upcoming challenges for now, for various reasons,
        * more political than technical ;)
        getBucket(BUCKETS.UPCOMING) */
      }
      {getBucket(BUCKETS.PAST)}
    </div>
  );
}

Listing.defaultProps = {
  challenges: [],
  communityName: null,
  currentFilterName: '',
  expanded: false,
  expandedTags: [],
  expandTag: null,
  extraBucket: null,
  loadMoreDraft: null,
  loadMorePast: null,
  loadMoreReviewOpportunities: null,
  preListingMsg: null,
  reviewOpportunities: [],
  onTechTagClicked: _.noop,
  onExpandFilterResult: _.noop,
  openChallengesInNewTabs: false,
};

Listing.propTypes = {
  activeBucket: PT.string.isRequired,
  auth: PT.shape({
    tokenV3: PT.string,
    user: PT.shape({
      handle: PT.string,
    }),
  }).isRequired,
  challenges: PT.arrayOf(PT.shape()),
  challengesUrl: PT.string.isRequired,
  communityName: PT.string,
  expandedTags: PT.arrayOf(PT.number),
  expandTag: PT.func,
  extraBucket: PT.string,
  filterState: PT.shape().isRequired,
  keepPastPlaceholders: PT.bool.isRequired,
  loadingDraftChallenges: PT.bool.isRequired,
  loadingPastChallenges: PT.bool.isRequired,
  loadingReviewOpportunities: PT.bool.isRequired,
  loadMoreDraft: PT.func,
  loadMorePast: PT.func,
  loadMoreReviewOpportunities: PT.func,
  newChallengeDetails: PT.bool.isRequired,
  openChallengesInNewTabs: PT.bool,
  prizeMode: PT.string.isRequired,
  preListingMsg: PT.node,
  reviewOpportunities: PT.arrayOf(PT.shape()),
  selectBucket: PT.func.isRequired,
  selectChallengeDetailsTab: PT.func.isRequired,
  selectedCommunityId: PT.string.isRequired,
  setFilterState: PT.func.isRequired,
  setSort: PT.func.isRequired,
  sorts: PT.shape().isRequired,
};
