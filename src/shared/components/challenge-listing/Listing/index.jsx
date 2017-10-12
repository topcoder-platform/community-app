/**
 * The actual listing of the challenge cards.
 */

import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { BUCKETS, getBuckets } from 'utils/challenge-listing/buckets';
import Bucket from './Bucket';
import './style.scss';

export default function Listing({
  activeBucket,
  auth,
  challenges,
  challengesUrl,
  communityName,
  filterState,
  keepPastPlaceholders,
  loadingDraftChallenges,
  loadingPastChallenges,
  loadMoreDraft,
  loadMorePast,
  newChallengeDetails,
  openChallengesInNewTabs,
  prizeMode,
  selectBucket,
  selectChallengeDetailsTab,
  selectedCommunityId,
  setFilterState,
  setSort,
  sorts,
}) {
  const buckets = getBuckets(_.get(auth.user, 'handle'));

  if ((activeBucket !== BUCKETS.ALL)
  && (activeBucket !== BUCKETS.SAVED_FILTER)) {
    let keepPlaceholders = false;
    let loading;
    let loadMore;
    switch (activeBucket) {
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
      <div styleName="challengeCardContainer">
        <Bucket
          bucket={buckets[activeBucket]}
          bucketId={activeBucket}
          challenges={challenges}
          challengesUrl={challengesUrl}
          communityName={communityName}
          expanded
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
          setSort={sort => setSort(activeBucket, sort)}
          sort={sorts[activeBucket]}
          userHandle={_.get(auth, 'user.handle')}
        />
      </div>
    );
  }

  /* TODO: Isn't it exactly the same piece of code as above? In case yes,
   * we should move this function up and re-use in both places. */
  const getBucket = (bucket) => {
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
      <Bucket
        bucket={buckets[bucket]}
        bucketId={bucket}
        challenges={challenges}
        challengesUrl={challengesUrl}
        communityName={communityName}
        expand={() => selectBucket(bucket)}
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

  return (
    <div styleName="challengeCardContainer">
      {auth.user ? getBucket(BUCKETS.MY) : null}
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
  loadMoreDraft: null,
  loadMorePast: null,
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
  filterState: PT.shape().isRequired,
  keepPastPlaceholders: PT.bool.isRequired,
  loadingDraftChallenges: PT.bool.isRequired,
  loadingPastChallenges: PT.bool.isRequired,
  loadMoreDraft: PT.func,
  loadMorePast: PT.func,
  newChallengeDetails: PT.bool.isRequired,
  openChallengesInNewTabs: PT.bool,
  prizeMode: PT.string.isRequired,
  selectBucket: PT.func.isRequired,
  selectChallengeDetailsTab: PT.func.isRequired,
  selectedCommunityId: PT.string.isRequired,
  setFilterState: PT.func.isRequired,
  setSort: PT.func.isRequired,
  sorts: PT.shape().isRequired,
};
