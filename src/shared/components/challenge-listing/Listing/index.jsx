/**
 * The actual listing of the challenge cards.
 */

import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import {
  BUCKETS, isReviewOpportunitiesBucket, NO_LIVE_CHALLENGES_CONFIG,
  // BUCKETS, getBuckets, isReviewOpportunitiesBucket, NO_LIVE_CHALLENGES_CONFIG,
} from 'utils/challenge-listing/buckets';
// import { challenge as challengeUtils } from 'topcoder-react-lib';
import Bucket from './Bucket';
import ReviewOpportunityBucket from './ReviewOpportunityBucket';
import CardPlaceholder from '../placeholders/ChallengeCard';
import './style.scss';

// const Filter = challengeUtils.filter;
const LOADING_MESSAGE = 'Loading Challenges';

function Listing({
  activeBucket,
  auth,
  allActiveChallengesLoaded,
  allMyChallengesLoaded,
  allMyPastChallengesLoaded,
  allChallengesLoaded,
  allPastChallengesLoaded,
  allOpenForRegistrationChallengesLoaded,
  challenges,
  openForRegistrationChallenges,
  myChallenges,
  myPastChallenges,
  allChallenges,
  pastChallenges,
  challengeTypes,
  // userChallenges,
  challengesUrl,
  communityName,
  // extraBucket,
  filterState,
  keepPastPlaceholders,
  needLoad,
  loadingPastChallenges,
  loadingReviewOpportunities,
  loadingMyChallenges,
  loadingMyPastChallenges,
  loadMoreMy,
  loadMoreMyPast,
  loadingAllChallenges,
  loadMoreAll,
  loadingOpenForRegistrationChallenges,
  loadMoreOpenForRegistration,
  loadingOnGoingChallenges,
  loadMoreOnGoing,
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
  expanding,
  expandedTags,
  expandTag,
  // pastSearchTimestamp,
  isLoggedIn,
  meta,
  setSearchText,
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
    let newExpanded = expanded;
    switch (bucket) {
      case BUCKETS.ALL_PAST:
        bucketChallenges = [].concat(pastChallenges);
        loading = loadingPastChallenges;
        loadMore = allPastChallengesLoaded ? null : loadMorePast;
        newExpanded = newExpanded || (+meta.pastChallengesCount === bucketChallenges.length);
        break;
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
        loadMore = allMyChallengesLoaded ? null : loadMoreMy;
        newExpanded = newExpanded || (+meta.myChallengesCount === bucketChallenges.length);
        break;
      case BUCKETS.MY_PAST:
        bucketChallenges = [].concat(myPastChallenges);
        loading = loadingMyPastChallenges;
        loadMore = allMyPastChallengesLoaded ? null : loadMoreMyPast;
        newExpanded = newExpanded || (+meta.myPastChallengesCount === bucketChallenges.length);
        break;
      case BUCKETS.OPEN_FOR_REGISTRATION:
        bucketChallenges = [].concat(openForRegistrationChallenges);
        loading = loadingOpenForRegistrationChallenges;
        loadMore = allOpenForRegistrationChallengesLoaded ? null : loadMoreOpenForRegistration;
        newExpanded = newExpanded || (+meta.openChallengesCount === bucketChallenges.length);
        break;
      case BUCKETS.ONGOING:
        bucketChallenges = [].concat(challenges);
        loading = loadingOnGoingChallenges;
        loadMore = allActiveChallengesLoaded ? null : loadMoreOnGoing;
        newExpanded = newExpanded || (+meta.ongoingChallengesCount === bucketChallenges.length);
        break;
      case BUCKETS.ALL:
        bucketChallenges = [].concat(allChallenges);
        loading = loadingAllChallenges;
        loadMore = allChallengesLoaded ? null : loadMoreAll;
        newExpanded = newExpanded || (+meta.allChallengesCount === bucketChallenges.length);
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
            needLoad={needLoad}
            loading={loadingReviewOpportunities}
            loadMore={loadMoreReviewOpportunities}
            opportunities={reviewOpportunities}
            setFilterState={setFilterState}
            setSort={sort => setSort(bucket, sort)}
            sort={sorts[bucket]}
            challengeTypes={challengeTypes}
            isLoggedIn={isLoggedIn}
            setSearchText={setSearchText}
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
            expand={() => {
              selectBucket(bucket, true);
              loadMore();
            }}
            expanded={newExpanded}
            expanding={expanding}
            expandedTags={expandedTags}
            expandTag={expandTag}
            filterState={filterState}
            // keepPlaceholders={keepPlaceholders}
            needLoad={needLoad}
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
            setSearchText={setSearchText}
          />
        )
    );
  };

  if ((activeBucket !== BUCKETS.SAVED_FILTER)) {
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
  const loading = loadingMyChallenges
    || loadingMyPastChallenges
    || loadingOpenForRegistrationChallenges
    || loadingOnGoingChallenges
    || loadingAllChallenges
    || loadingPastChallenges;
  const placeholders = [];
  if (challenges.length > 0 || (activeBucket === BUCKETS.ALL && allChallenges.length > 0)) {
    return (
      <div styleName="challengeCardContainer">
        {preListingMsg}
        {/* (auth.user && myChallenges.length > 0) ? getBucket(BUCKETS.MY) : null */}
        {/* {extraBucket ? getBucket(extraBucket) : null} */}
        {/* openForRegistrationChallenges.length > 0 && getBucket(BUCKETS.OPEN_FOR_REGISTRATION) */}
        {/* {getBucket(BUCKETS.ONGOING)} */}
        {getBucket(BUCKETS.ALL)}
      </div>
    );
  }

  if (loading) {
    for (let i = 0; i < 10; i += 1) {
      placeholders.push(<CardPlaceholder id={i} key={i} />);
    }
  }
  return (
    <div styleName="challengeCardContainer">
      {
        loading
          ? placeholders
          : (!filterState.recommended || activeBucket !== 'openForRegistration') && (
            <div styleName="no-results">
              {
                needLoad ? LOADING_MESSAGE
                  : (
                    `${NO_LIVE_CHALLENGES_CONFIG[activeBucket]}`
                  )
              }
            </div>
          )
      }
    </div>
  );
}

Listing.defaultProps = {
  challenges: [],
  openForRegistrationChallenges: [],
  myChallenges: [],
  myPastChallenges: [],
  allChallenges: [],
  pastChallenges: [],
  challengeTypes: [],
  communityName: null,
  // currentFilterName: '',
  // expanded: false,
  expandedTags: [],
  expandTag: null,
  // extraBucket: null,
  loadMorePast: null,
  loadMoreReviewOpportunities: null,
  loadMoreMy: null,
  loadMoreMyPast: null,
  loadMoreAll: null,
  loadMoreOpenForRegistration: null,
  loadMoreOnGoing: null,
  preListingMsg: null,
  reviewOpportunities: [],
  // onTechTagClicked: _.noop,
  // onExpandFilterResult: _.noop,
  openChallengesInNewTabs: false,
  // pastSearchTimestamp: 0,
  // userChallenges: [],
  expanding: false,
};

Listing.propTypes = {
  activeBucket: PT.string.isRequired,
  expanding: PT.bool,
  auth: PT.shape({
    tokenV3: PT.string,
    user: PT.shape({
      userId: PT.number,
    }),
  }).isRequired,
  allActiveChallengesLoaded: PT.bool.isRequired,
  allMyChallengesLoaded: PT.bool.isRequired,
  allMyPastChallengesLoaded: PT.bool.isRequired,
  allChallengesLoaded: PT.bool.isRequired,
  allPastChallengesLoaded: PT.bool.isRequired,
  allOpenForRegistrationChallengesLoaded: PT.bool.isRequired,
  challenges: PT.arrayOf(PT.shape()),
  openForRegistrationChallenges: PT.arrayOf(PT.shape()),
  myChallenges: PT.arrayOf(PT.shape()),
  myPastChallenges: PT.arrayOf(PT.shape()),
  allChallenges: PT.arrayOf(PT.shape()),
  pastChallenges: PT.arrayOf(PT.shape()),
  challengeTypes: PT.arrayOf(PT.shape()),
  challengesUrl: PT.string.isRequired,
  communityName: PT.string,
  expandedTags: PT.arrayOf(PT.number),
  expandTag: PT.func,
  // extraBucket: PT.string,
  filterState: PT.shape().isRequired,
  keepPastPlaceholders: PT.bool.isRequired,
  needLoad: PT.bool.isRequired,
  loadingPastChallenges: PT.bool.isRequired,
  loadingMyChallenges: PT.bool.isRequired,
  loadingMyPastChallenges: PT.bool.isRequired,
  loadingAllChallenges: PT.bool.isRequired,
  loadingOpenForRegistrationChallenges: PT.bool.isRequired,
  loadingOnGoingChallenges: PT.bool.isRequired,
  loadingReviewOpportunities: PT.bool.isRequired,
  loadMoreMy: PT.func,
  loadMoreMyPast: PT.func,
  loadMoreAll: PT.func,
  loadMoreOnGoing: PT.func,
  loadMoreOpenForRegistration: PT.func,
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
  // pastSearchTimestamp: PT.number,
  // userChallenges: PT.arrayOf(PT.string),
  isLoggedIn: PT.bool.isRequired,
  meta: PT.shape().isRequired,
  setSearchText: PT.func.isRequired,
};

const mapStateToProps = (state) => {
  const cl = state.challengeListing;
  return {
    // allActiveChallengesLoaded: cl.allActiveChallengesLoaded,
    allActiveChallengesLoaded: cl.allActiveChallengesLoaded,
    allMyChallengesLoaded: cl.allMyChallengesLoaded,
    allMyPastChallengesLoaded: cl.allMyPastChallengesLoaded,
    allChallengesLoaded: cl.allChallengesLoaded,
    allPastChallengesLoaded: cl.allPastChallengesLoaded,
    allOpenForRegistrationChallengesLoaded: cl.allOpenForRegistrationChallengesLoaded,
    // pastSearchTimestamp: cl.pastSearchTimestamp,
    challengeTypes: cl.challengeTypes,
  };
};

const ListingContainer = connect(
  mapStateToProps,
)(Listing);

export default ListingContainer;
