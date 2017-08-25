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
  communityName,
  loadingDraftChallenges,
  loadingPastChallenges,
  loadMoreDraft,
  loadMorePast,
  openChallengesInNewTabs,
  prizeMode,
  selectBucket,
  setFilterState,
  setSort,
  sorts,
}) {
  const buckets = getBuckets(_.get(auth.user, 'handle'));

  if ((activeBucket !== BUCKETS.ALL)
  && (activeBucket !== BUCKETS.SAVED_FILTER)) {
    let loading;
    let loadMore;
    switch (activeBucket) {
      case BUCKETS.PAST:
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
          challenges={challenges}
          communityName={communityName}
          expanded
          loading={loading}
          loadMore={loadMore}
          openChallengesInNewTabs={openChallengesInNewTabs}
          prizeMode={prizeMode}
          setFilterState={setFilterState}
          setSort={sort => setSort(activeBucket, sort)}
          sort={sorts[activeBucket]}
        />
      </div>
    );
  }

  const getBucket = (bucket) => {
    let loading;
    let loadMore;
    switch (bucket) {
      case BUCKETS.PAST:
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
        challenges={challenges}
        communityName={communityName}
        expand={() => selectBucket(bucket)}
        loading={loading}
        loadMore={loadMore}
        openChallengesInNewTabs={openChallengesInNewTabs}
        prizeMode={prizeMode}
        setFilterState={setFilterState}
        setSort={sort => setSort(bucket, sort)}
        sort={sorts[bucket]}
      />
    );
  };

  return (
    <div styleName="challengeCardContainer" id="challengeCardContainer">
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
  groupId: '',
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
  communityName: PT.string,
  loadingDraftChallenges: PT.bool.isRequired,
  loadingPastChallenges: PT.bool.isRequired,
  loadMoreDraft: PT.func,
  loadMorePast: PT.func,
  openChallengesInNewTabs: PT.bool,
  prizeMode: PT.string.isRequired,
  selectBucket: PT.func.isRequired,
  setFilterState: PT.func.isRequired,
  setSort: PT.func.isRequired,
  sorts: PT.shape().isRequired,
};
