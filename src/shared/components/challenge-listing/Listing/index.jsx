/**
 * The actual listing of the challenge cards.
 */

import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import {
  BUCKETS, isReviewOpportunitiesBucket,
  // BUCKETS, getBuckets, isReviewOpportunitiesBucket, NO_LIVE_CHALLENGES_CONFIG,
} from 'utils/challenge-listing/buckets';
// import { challenge as challengeUtils } from 'topcoder-react-lib';
import Bucket from './Bucket';
import ReviewOpportunityBucket from './ReviewOpportunityBucket';
import './style.scss';

// const Filter = challengeUtils.filter;

function Listing({
  activeBucket,
  auth,
  challenges,
  openForRegistrationChallenges,
  myChallenges,
  // pastChallenges,
  challengeTypes,
  // userChallenges,
  challengesUrl,
  communityName,
  // extraBucket,
  filterState,
  keepPastPlaceholders,
  // loadingPastChallenges,
  loadingReviewOpportunities,
  loadingMyChallenges,
  loadMoreMy,
  loadingOpenForRegistrationChallenges,
  loadMoreOpenForRegistration,
  loadingOnGoingChallenges,
  loadMoreOnGoing,
  // loadMorePast,
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
  // pastSearchTimestamp,
  isLoggedIn,
}) {
  // const buckets = getBuckets(userChallenges);
  // const isChallengesAvailable = (bucket) => {
  //   // const filter = Filter.getFilterFunction(buckets[bucket].filter);
  //   const clonedChallenges = _.clone(challenges);
  //   const filteredChallenges = [];
  //   for (let i = 0; i < clonedChallenges.length; i += 1) {
  //     // if (filter(clonedChallenges[i])) {
  //       // filteredChallenges.push(clonedChallenges[i]);
  //     // }
  //   }
  //   return filteredChallenges.length > 0;
  // };
  const getBucket = (bucket, expanded = false) => {
    // const keepPlaceholders = false;
    let loading;
    let loadMore;
    // let searchTimestamp;
    let bucketChallenges = [];
    switch (bucket) {
      // case BUCKETS.PAST:
      //   keepPlaceholders = keepPastPlaceholders;
      //   bucketChallenges = [].concat(pastChallenges);
      //   loading = loadingPastChallenges;
      //   loadMore = loadMorePast;
      //   // searchTimestamp = pastSearchTimestamp;
      //   break;
      case BUCKETS.MY:
        bucketChallenges = [].concat(myChallenges);
        loading = loadingMyChallenges;
        loadMore = loadMoreMy;
        break;
      case BUCKETS.OPEN_FOR_REGISTRATION:
        bucketChallenges = [].concat(openForRegistrationChallenges);
        loading = loadingOpenForRegistrationChallenges;
        loadMore = loadMoreOpenForRegistration;
        break;
      case BUCKETS.ONGOING:
        bucketChallenges = [].concat(challenges);
        loading = loadingOnGoingChallenges;
        loadMore = loadMoreOnGoing;
        break;
      default:
        break;
    }
    return (
      /* Review Opportunities use a different Bucket, Card and data source than normal challenges
       * and are only shown when explicitly chosen from the sidebar */
      isReviewOpportunitiesBucket(bucket)
        ? (
          <ReviewOpportunityBucket
            // bucket={buckets[bucket]}
            bucket={bucket}
            challengesUrl={challengesUrl}
            expandedTags={expandedTags}
            expandTag={expandTag}
            filterState={filterState}
            keepPlaceholders={keepPastPlaceholders}
            loading={loadingReviewOpportunities}
            loadMore={loadMoreReviewOpportunities}
            opportunities={reviewOpportunities}
            setFilterState={setFilterState}
            setSort={sort => setSort(bucket, sort)}
            sort={sorts[bucket]}
            challengeTypes={challengeTypes}
            isLoggedIn={isLoggedIn}
          />
        )
        : (
          <Bucket
            // bucket={buckets[bucket]}
            bucket={bucket}
            // bucketId={bucket}
            challenges={bucketChallenges}
            challengeTypes={challengeTypes}
            challengesUrl={challengesUrl}
            communityName={communityName}
            expand={() => selectBucket(bucket)}
            expanded={expanded}
            expandedTags={expandedTags}
            expandTag={expandTag}
            filterState={filterState}
            // keepPlaceholders={keepPlaceholders}
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
            userId={_.get(auth, 'user.userId')}
            activeBucket={activeBucket}
            // searchTimestamp={searchTimestamp}
            isLoggedIn={isLoggedIn}
          />
        )
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

  // let isFilled = isChallengesAvailable(BUCKETS.OPEN_FOR_REGISTRATION)
  // || isChallengesAvailable(BUCKETS.ONGOING);
  // if (auth.user) {
  //   isFilled = isFilled || isChallengesAvailable(BUCKETS.MY);
  // }
  // if (!isFilled) {
  //   return (
  //     <div styleName="challengeCardContainer">
  //       <div styleName="no-results">
  //         {`${NO_LIVE_CHALLENGES_CONFIG[activeBucket]}`}
  //       </div>
  //     </div>
  //   );
  // }
  return (
    <div styleName="challengeCardContainer">
      {preListingMsg}
      {(auth.user && myChallenges.length > 0) ? getBucket(BUCKETS.MY) : null}
      {/* {extraBucket ? getBucket(extraBucket) : null} */}
      {openForRegistrationChallenges.length > 0 && getBucket(BUCKETS.OPEN_FOR_REGISTRATION)}
      {/* {getBucket(BUCKETS.ONGOING)} */}
    </div>
  );
}

Listing.defaultProps = {
  challenges: [],
  openForRegistrationChallenges: [],
  myChallenges: [],
  // pastChallenges: [],
  challengeTypes: [],
  communityName: null,
  // currentFilterName: '',
  // expanded: false,
  expandedTags: [],
  expandTag: null,
  // extraBucket: null,
  // loadMorePast: null,
  loadMoreReviewOpportunities: null,
  loadMoreMy: null,
  loadMoreOpenForRegistration: null,
  loadMoreOnGoing: null,
  preListingMsg: null,
  reviewOpportunities: [],
  // onTechTagClicked: _.noop,
  // onExpandFilterResult: _.noop,
  openChallengesInNewTabs: false,
  // pastSearchTimestamp: 0,
  // userChallenges: [],
};

Listing.propTypes = {
  activeBucket: PT.string.isRequired,
  auth: PT.shape({
    tokenV3: PT.string,
    user: PT.shape({
      userId: PT.string,
    }),
  }).isRequired,
  challenges: PT.arrayOf(PT.shape()),
  openForRegistrationChallenges: PT.arrayOf(PT.shape()),
  myChallenges: PT.arrayOf(PT.shape()),
  // pastChallenges: PT.arrayOf(PT.shape()),
  challengeTypes: PT.arrayOf(PT.shape()),
  challengesUrl: PT.string.isRequired,
  communityName: PT.string,
  expandedTags: PT.arrayOf(PT.number),
  expandTag: PT.func,
  // extraBucket: PT.string,
  filterState: PT.shape().isRequired,
  keepPastPlaceholders: PT.bool.isRequired,
  // loadingPastChallenges: PT.bool.isRequired,
  loadingMyChallenges: PT.bool.isRequired,
  loadingOpenForRegistrationChallenges: PT.bool.isRequired,
  loadingOnGoingChallenges: PT.bool.isRequired,
  loadingReviewOpportunities: PT.bool.isRequired,
  loadMoreMy: PT.func,
  loadMoreOnGoing: PT.func,
  loadMoreOpenForRegistration: PT.func,
  // loadMorePast: PT.func,
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
  // pastSearchTimestamp: PT.number,
  // userChallenges: PT.arrayOf(PT.string),
  isLoggedIn: PT.bool.isRequired,
};

const mapStateToProps = (state) => {
  const cl = state.challengeListing;
  return {
    // allActiveChallengesLoaded: cl.allActiveChallengesLoaded,
    // pastSearchTimestamp: cl.pastSearchTimestamp,
    challengeTypes: cl.challengeTypes,
  };
};

const ListingContainer = connect(
  mapStateToProps,
)(Listing);

export default ListingContainer;
