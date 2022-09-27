/* eslint-disable react/destructuring-assignment */
/**
 * Challenge listing component.
 */

// import _ from 'lodash';
import FilterPanel from 'containers/challenge-listing/FilterPanel';
// import moment from 'moment';
import React, { useState } from 'react';
import PT from 'prop-types';
// import { challenge as challengeUtils } from 'topcoder-react-lib';
import Sidebar from 'containers/challenge-listing/Sidebar';
// import { isReviewOpportunitiesBucket } from 'utils/challenge-listing/buckets';
// import { config } from 'topcoder-react-utils';
import { useMediaQuery } from 'react-responsive';

import Listing from './Listing';
// import ChallengeCardPlaceholder from './placeholders/ChallengeCard';
import ChallengeTab from './ChallengeTab';

import './style.scss';

// const Filter = challengeUtils.filter;

// Number of challenge placeholder card to display
// const CHALLENGE_PLACEHOLDER_COUNT = 8;

const ChallengeListing = (props) => {
  const {
    activeBucket,
    auth,
    challenges,
    openForRegistrationChallenges,
    myChallenges,
    myPastChallenges,
    allChallenges,
    pastChallenges,
    // communityFilter,
    communityName,
    defaultCommunityId,
    expanding,
    // extraBucket,
    // filterState,
    hideSrm,
    // hideTcLinksInFooter,
    keepPastPlaceholders,
    // loadingChallenges,
    preListingMsg,
    // isBucketSwitching,
    isLoggedIn,
    setSearchText,
    selectBucket,
    setPreviousBucketOfActiveTab,
    setPreviousBucketOfPastChallengesTab,
    previousBucketOfPastChallengesTab,
    previousBucketOfActiveTab,
  } = props;

  const [recommendedToggle, setRecommendedToggle] = useState(false);
  const [tcoToggle, setTcoToggle] = useState(false);

  // const { challenges } = props;

  // if (communityFilter) {
  //   challenges = challenges.filter(Filter.getFilterFunction(props.communityFilter));
  // }

  // challenges = challenges.filter(Filter.getFilterFunction(filterState));

  // const expanded = false;

  /* When we automatically reload cached challenge objects, we do not want to
   * show the loading state, if the currently loaded challenges are not very
   * outdated (i.e. no need to show placeholders in the situations when it is
   * fine to reload silently, keeping showing the previously cached challenges,
   * while the reload is going on).
   *
   * In this code lastUpdateOfActiveChallenges serves as an adequate indication
   * when the challenges were fetched the last time, and the magic numbers are:
   * 1000 - to conver config.CHALLENGE_LISTING_AUTO_REFRESH from seconds to ms.
   * 1.5 - a reasonable margin factor, to decide when we consider already cached
   * challenges too old to display while the reload takes place.
   */
  // let suppressPlaceholders = false;
  // if (config.CHALLENGE_LISTING_AUTO_REFRESH) {
  //   const outage = moment().diff(props.lastUpdateOfActiveChallenges);
  //   suppressPlaceholders = outage < 1.5 * 1000 * config.CHALLENGE_LISTING_AUTO_REFRESH;
  // }

  // let challengeCardContainer;
  // if ((!expanded
  //       && loadingChallenges
  //       && !suppressPlaceholders
  //       && !isReviewOpportunitiesBucket(activeBucket))
  //     || isBucketSwitching) { // Skip, Review Opps are not auto-refreshed
  // if (!expanded && loadingChallenges) {
  //   const challengeCards = _.range(CHALLENGE_PLACEHOLDER_COUNT)
  //     .map(key => <ChallengeCardPlaceholder id={key} key={key} />);
  //   challengeCardContainer = (
  //     <div styleName="challenge-cards-container">
  //       <div styleName="ChallengeCardExamples">
  //         { challengeCards }
  //       </div>
  //     </div>
  //   );
  // } else {
  const challengeCardContainer = (
    <Listing
      activeBucket={activeBucket}
      auth={props.auth}
      challenges={challenges}
      openForRegistrationChallenges={openForRegistrationChallenges}
      myChallenges={myChallenges}
      myPastChallenges={myPastChallenges}
      allChallenges={allChallenges}
      pastChallenges={pastChallenges}
      challengesUrl={props.challengesUrl}
      communityName={props.communityName}
      expandedTags={props.expandedTags}
      expandTag={props.expandTag}
            // extraBucket={extraBucket}
      filterState={props.filterState}
      keepPastPlaceholders={keepPastPlaceholders}
      loadingPastChallenges={props.loadingPastChallenges}
      loadingMyChallenges={props.loadingMyChallenges}
      loadingMyPastChallenges={props.loadingMyPastChallenges}
      loadingAllChallenges={props.loadingAllChallenges}
      loadingOpenForRegistrationChallenges={props.loadingOpenForRegistrationChallenges}
      loadingOnGoingChallenges={props.loadingOnGoingChallenges}
      loadingReviewOpportunities={props.loadingReviewOpportunities}
      loadMoreMy={props.loadMoreMy}
      loadMoreMyPast={props.loadMoreMyPast}
      loadMoreAll={props.loadMoreAll}
      loadMoreOpenForRegistration={props.loadMoreOpenForRegistration}
      loadMoreOnGoing={props.loadMoreOnGoing}
      loadMorePast={props.loadMorePast}
      loadMoreReviewOpportunities={props.loadMoreReviewOpportunities}
      newChallengeDetails={props.newChallengeDetails}
      openChallengesInNewTabs={props.openChallengesInNewTabs}
      preListingMsg={preListingMsg}
      prizeMode={props.prizeMode}
      reviewOpportunities={props.reviewOpportunities}
      selectBucket={props.selectBucket}
      selectChallengeDetailsTab={props.selectChallengeDetailsTab}
      selectedCommunityId={props.selectedCommunityId}
      setFilterState={props.setFilterState}
      setSort={props.setSort}
      sorts={props.sorts}
      loadMoreActive={props.loadMoreActive}
      expanding={expanding}
        // loadingActiveChallenges={props.loadingChallenges}
        // userChallenges={props.userChallenges}
      isLoggedIn={isLoggedIn}
      setSearchText={setSearchText}
    />
  );

  const desktop = useMediaQuery({ minWidth: 1024 });

  return (
    <div styleName="ChallengeFiltersExample" id="challengeFilterContainer">

      <h1 styleName="tc-title">CHALLENGES</h1>
      <hr styleName="tc-seperator" />

      <ChallengeTab
        activeBucket={activeBucket}
        setPreviousBucketOfActiveTab={setPreviousBucketOfActiveTab}
        setPreviousBucketOfPastChallengesTab={setPreviousBucketOfPastChallengesTab}
        previousBucketOfPastChallengesTab={previousBucketOfPastChallengesTab}
        previousBucketOfActiveTab={previousBucketOfActiveTab}
        selectBucket={selectBucket}
      />

      <div styleName="tc-content-wrapper">
        <div styleName={desktop ? 'sidebar-container-desktop' : 'sidebar-container-mobile'}>
          <Sidebar
            expanding={expanding}
            setFilterState={props.setFilterState}
            recommendedToggle={recommendedToggle}
            setRecommendedToggle={setRecommendedToggle}
            tcoToggle={tcoToggle}
            setTcoToggle={setTcoToggle}
          />

          <FilterPanel
            communityName={communityName}
            defaultCommunityId={defaultCommunityId}
            hideSrm={hideSrm}
            isAuth={Boolean(auth.user)}
            setFilterState={props.setFilterState}
            hidden={!desktop}
            recommendedToggle={recommendedToggle}
            setRecommendedToggle={setRecommendedToggle}
            tcoToggle={tcoToggle}
            setTcoToggle={setTcoToggle}
          />
        </div>

        { challengeCardContainer }

      </div>
    </div>
  );
};

ChallengeListing.defaultProps = {
  auth: null,
  // communityFilter: null,
  communityName: null,
  // extraBucket: null,
  // hideTcLinksInFooter: false,
  loadMoreMy: null,
  loadMoreMyPast: null,
  loadMoreAll: null,
  loadMoreOpenForRegistration: null,
  loadMoreOnGoing: null,
  loadMorePast: null,
  loadMoreReviewOpportunities: null,
  newChallengeDetails: false,
  openChallengesInNewTabs: false,
  reviewOpportunities: [],
  preListingMsg: null,
  prizeMode: 'money-usd',
  expandedTags: [],
  expandTag: null,
  loadMoreActive: null,
  expanding: false,
  // isBucketSwitching: false,
  // userChallenges: [],
};

ChallengeListing.propTypes = {
  activeBucket: PT.string.isRequired,
  expanding: PT.bool,
  challenges: PT.arrayOf(PT.shape()).isRequired,
  openForRegistrationChallenges: PT.arrayOf(PT.shape()).isRequired,
  myChallenges: PT.arrayOf(PT.shape()).isRequired,
  myPastChallenges: PT.arrayOf(PT.shape()).isRequired,
  allChallenges: PT.arrayOf(PT.shape()).isRequired,
  pastChallenges: PT.arrayOf(PT.shape()).isRequired,
  challengesUrl: PT.string.isRequired,
  // communityFilter: PT.shape(),
  communityName: PT.string,
  defaultCommunityId: PT.string.isRequired,
  expandedTags: PT.arrayOf(PT.number),
  expandTag: PT.func,
  // extraBucket: PT.string,
  filterState: PT.shape().isRequired,
  hideSrm: PT.bool.isRequired,
  // hideTcLinksInFooter: PT.bool,
  keepPastPlaceholders: PT.bool.isRequired,
  // lastUpdateOfActiveChallenges: PT.number.isRequired,
  // loadingChallenges: PT.bool.isRequired,
  loadingMyChallenges: PT.bool.isRequired,
  loadingMyPastChallenges: PT.bool.isRequired,
  loadingAllChallenges: PT.bool.isRequired,
  loadingOpenForRegistrationChallenges: PT.bool.isRequired,
  loadingOnGoingChallenges: PT.bool.isRequired,
  loadingPastChallenges: PT.bool.isRequired,
  loadingReviewOpportunities: PT.bool.isRequired,
  loadMoreMy: PT.func,
  loadMoreMyPast: PT.func,
  loadMoreAll: PT.func,
  loadMoreOpenForRegistration: PT.func,
  loadMoreOnGoing: PT.func,
  loadMorePast: PT.func,
  loadMoreReviewOpportunities: PT.func,
  newChallengeDetails: PT.bool,
  openChallengesInNewTabs: PT.bool,
  preListingMsg: PT.node,
  prizeMode: PT.string,
  reviewOpportunities: PT.arrayOf(PT.shape()),
  selectBucket: PT.func.isRequired,
  selectChallengeDetailsTab: PT.func.isRequired,
  selectedCommunityId: PT.string.isRequired,
  setFilterState: PT.func.isRequired,
  setSort: PT.func.isRequired,
  sorts: PT.shape().isRequired,
  auth: PT.shape(),
  loadMoreActive: PT.func,
  // isBucketSwitching: PT.bool,
  // userChallenges: PT.arrayOf(PT.string),
  isLoggedIn: PT.bool.isRequired,
  setSearchText: PT.func.isRequired,
  setPreviousBucketOfActiveTab: PT.func.isRequired,
  setPreviousBucketOfPastChallengesTab: PT.func.isRequired,
  previousBucketOfPastChallengesTab: PT.string.isRequired,
  previousBucketOfActiveTab: PT.string.isRequired,
};

export default ChallengeListing;
