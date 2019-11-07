/**
 * Challenge listing component.
 */

import _ from 'lodash';
import ChallengeFilters from 'containers/challenge-listing/FilterPanel';
import moment from 'moment';
import React from 'react';
import PT from 'prop-types';
import Sticky from 'react-stickynode';
import { challenge as challengeUtils } from 'topcoder-react-lib';
import Sidebar from 'containers/challenge-listing/Sidebar';
import { isReviewOpportunitiesBucket } from 'utils/challenge-listing/buckets';
import { config } from 'topcoder-react-utils';

import Listing from './Listing';
import ChallengeCardPlaceholder from './placeholders/ChallengeCard';
import SRMCard from './SRMCard';

import './style.scss';

const Filter = challengeUtils.filter;

// Number of challenge placeholder card to display
const CHALLENGE_PLACEHOLDER_COUNT = 8;

export default function ChallengeListing(props) {
  const {
    activeBucket,
    auth,
    challenges: propChallenges,
    communityFilter,
    communityName,
    defaultCommunityId,
    extraBucket,
    filterState,
    hideSrm,
    hideTcLinksInFooter,
    keepPastPlaceholders,
    keepMyPlaceholders,
    loadingChallenges,
    preListingMsg,
  } = props;

  let { challenges, myChallenges } = props;

  if (communityFilter) {
    challenges = challenges.filter(Filter.getFilterFunction(props.communityFilter));
    myChallenges = myChallenges.filter(Filter.getFilterFunction(props.communityFilter));
  }

  challenges = challenges.filter(Filter.getFilterFunction(filterState));
  myChallenges = myChallenges.filter(Filter.getFilterFunction(filterState));

  const expanded = false;

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
  let suppressPlaceholders = false;
  if (config.CHALLENGE_LISTING_AUTO_REFRESH) {
    const outage = moment().diff(props.lastUpdateOfActiveChallenges);
    suppressPlaceholders = outage < 1.5 * 1000 * config.CHALLENGE_LISTING_AUTO_REFRESH;
  }

  let challengeCardContainer;
  if (!expanded && loadingChallenges && !suppressPlaceholders
    && !isReviewOpportunitiesBucket(activeBucket)) { // Skip, Review Opps are not auto-refreshed
    const challengeCards = _.range(CHALLENGE_PLACEHOLDER_COUNT)
      .map(key => <ChallengeCardPlaceholder id={key} key={key} />);
    challengeCardContainer = (
      <div styleName="challenge-cards-container">
        <div styleName="ChallengeCardExamples">
          { challengeCards }
        </div>
      </div>
    );
  } else {
    challengeCardContainer = (
      <Listing
        activeBucket={activeBucket}
        auth={props.auth}
        challenges={challenges}
        myChallenges={myChallenges}
        challengesUrl={props.challengesUrl}
        communityName={props.communityName}
        expandedTags={props.expandedTags}
        expandTag={props.expandTag}
        extraBucket={extraBucket}
        filterState={props.filterState}
        keepPastPlaceholders={keepPastPlaceholders}
        keepMyPlaceholders={keepMyPlaceholders}
        loadingPastChallenges={props.loadingPastChallenges}
        loadingMyChallenges={props.loadingMyChallenges}
        loadingReviewOpportunities={props.loadingReviewOpportunities}
        loadMorePast={props.loadMorePast}
        loadMyChallenges={props.loadMyChallenges}
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
        loadingActiveChallenges={props.loadingChallenges}
      />
    );
  }

  return (
    <div styleName="ChallengeFiltersExample" id="challengeFilterContainer">
      <ChallengeFilters
        challenges={propChallenges}
        communityName={communityName}
        defaultCommunityId={defaultCommunityId}
        hideSrm={hideSrm}
        setCardType={_.noop/* cardType => this.setCardType(cardType) */}
        isCardTypeSet="Challenges"
        isAuth={Boolean(auth.user)}
      />
      <div styleName={`tc-content-wrapper ${/* this.state.currentCardType === 'SRMs' ? '' : */'hidden'}`}>
        <div styleName="sidebar-container-mobile">
          {/* <ChallengesSidebar SidebarMock={SRMsSidebarMock} /> */}
        </div>

        <div styleName="challenges-container SRMs-container">
          {/* happening now */}
          <div>
            <SRMCard category="now" />
          </div>
          {/* upcoming SRMs */}
          <div>
            <div styleName="title">
Upcoming SRMs
            </div>
            { /* UpcomingSrm */ }
          </div>
          {/* past SRMs */}
          <div>
            <div styleName="title">
Past SRMs
            </div>
            <SRMCard category="past" />
          </div>
        </div>

        <div styleName="sidebar-container-desktop">
          <Sticky top={20}>
            {/* <ChallengesSidebar SidebarMock={SRMsSidebarMock} /> */}
          </Sticky>
        </div>
      </div>

      <div styleName={`tc-content-wrapper ${/* this.state.currentCardType === 'Challenges' ? '' : 'hidden' */''}`}>
        <div styleName="sidebar-container-mobile">
          <Sidebar />
        </div>

        {challengeCardContainer}

        <div styleName="sidebar-container-desktop">
          <Sticky top={20} bottomBoundary="#challengeFilterContainer">
            <Sidebar
              extraBucket={extraBucket}
              hideTcLinksInFooter={hideTcLinksInFooter}
            />
          </Sticky>
        </div>
      </div>
    </div>
  );
}

ChallengeListing.defaultProps = {
  auth: null,
  communityFilter: null,
  communityName: null,
  extraBucket: null,
  hideTcLinksInFooter: false,
  loadMorePast: null,
  loadMyChallenges: null,
  loadMoreReviewOpportunities: null,
  newChallengeDetails: false,
  openChallengesInNewTabs: false,
  reviewOpportunities: [],
  preListingMsg: null,
  prizeMode: 'money-usd',
  expandedTags: [],
  expandTag: null,
  loadMoreActive: null,
};

ChallengeListing.propTypes = {
  activeBucket: PT.string.isRequired,
  challenges: PT.arrayOf(PT.shape()).isRequired,
  myChallenges: PT.arrayOf(PT.shape()).isRequired,
  challengesUrl: PT.string.isRequired,
  communityFilter: PT.shape(),
  communityName: PT.string,
  defaultCommunityId: PT.string.isRequired,
  expandedTags: PT.arrayOf(PT.number),
  expandTag: PT.func,
  extraBucket: PT.string,
  filterState: PT.shape().isRequired,
  hideSrm: PT.bool.isRequired,
  hideTcLinksInFooter: PT.bool,
  keepPastPlaceholders: PT.bool.isRequired,
  keepMyPlaceholders: PT.bool.isRequired,
  lastUpdateOfActiveChallenges: PT.number.isRequired,
  loadingChallenges: PT.bool.isRequired,
  loadingPastChallenges: PT.bool.isRequired,
  loadingMyChallenges: PT.bool.isRequired,
  loadingReviewOpportunities: PT.bool.isRequired,
  loadMorePast: PT.func,
  loadMyChallenges: PT.func,
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
};
