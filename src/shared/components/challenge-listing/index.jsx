/**
 * Challenge listing component.
 */

import _ from 'lodash';
import ChallengeFilters from 'containers/challenge-listing/FilterPanel';
import moment from 'moment';
import React from 'react';
import PT from 'prop-types';
import Sticky from 'react-stickynode';
import { challenge as challengeUtil } from 'topcoder-react-lib';
import Sidebar from 'containers/challenge-listing/Sidebar';
import { config } from 'topcoder-react-utils';

import Listing from './Listing';
import ChallengeCardPlaceholder from './placeholders/ChallengeCard';
import SRMCard from './SRMCard';

import './style.scss';

const { isReviewOpportunitiesBucket } = challengeUtil.buckets;

// Number of challenge placeholder card to display
const CHALLENGE_PLACEHOLDER_COUNT = 8;

export default function ChallengeListing(props) {
  const {
    activeBucket,
    auth,
    challenges: propChallenges,
    communityName,
    defaultCommunityId,
    extraBucket,
    hideSrm,
    hideTcLinksInFooter,
    keepPastPlaceholders,
    loadingChallenges,
    preListingMsg,
    loadMoreChallenges,
  } = props;

  const { challenges } = props;
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
    && !isReviewOpportunitiesBucket(activeBucket)) {
    // Skip, Review Opps are not auto-refreshed
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
        challengesUrl={props.challengesUrl}
        communityName={props.communityName}
        expandedTags={props.expandedTags}
        expandTag={props.expandTag}
        extraBucket={extraBucket}
        filterState={props.filterState}
        keepPastPlaceholders={keepPastPlaceholders}
        loadingPastChallenges={props.loadingPastChallenges}
        loadingMyChallenges={props.loadingMyChallenges}
        loadingOpenChallenges={props.loadingOpenChallenges}
        loadingOnGoingChallenges={props.loadingOnGoingChallenges}
        loadingReviewOpportunities={props.loadingReviewOpportunities}
        loadMorePast={props.loadMorePast}
        loadMoreMy={props.loadMoreMy}
        loadMoreOpen={props.loadMoreOpen}
        loadMoreOnGoing={props.loadMoreOnGoing}
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
        loadMoreChallenges={props.loadMoreChallenges}
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
          <Sidebar loadMoreChallenges={loadMoreChallenges} />
        </div>

        {challengeCardContainer}

        <div styleName="sidebar-container-desktop">
          <Sticky top={20} bottomBoundary="#challengeFilterContainer">
            <Sidebar
              extraBucket={extraBucket}
              hideTcLinksInFooter={hideTcLinksInFooter}
              loadMoreChallenges={loadMoreChallenges}
            />
          </Sticky>
        </div>
      </div>
    </div>
  );
}

ChallengeListing.defaultProps = {
  auth: null,
  communityName: null,
  extraBucket: null,
  hideTcLinksInFooter: false,
  loadMorePast: null,
  loadMoreMy: null,
  loadMoreOpen: null,
  loadMoreOnGoing: null,
  loadMoreReviewOpportunities: null,
  newChallengeDetails: false,
  openChallengesInNewTabs: false,
  reviewOpportunities: [],
  preListingMsg: null,
  prizeMode: 'money-usd',
  expandedTags: [],
  expandTag: null,
  loadMoreActive: null,
  loadMoreChallenges: null,
};

ChallengeListing.propTypes = {
  activeBucket: PT.string.isRequired,
  challenges: PT.shape().isRequired,
  challengesUrl: PT.string.isRequired,
  communityName: PT.string,
  defaultCommunityId: PT.string.isRequired,
  expandedTags: PT.arrayOf(PT.number),
  expandTag: PT.func,
  extraBucket: PT.string,
  filterState: PT.shape().isRequired,
  hideSrm: PT.bool.isRequired,
  hideTcLinksInFooter: PT.bool,
  keepPastPlaceholders: PT.bool.isRequired,
  lastUpdateOfActiveChallenges: PT.number.isRequired,
  loadingChallenges: PT.bool.isRequired,
  loadingPastChallenges: PT.bool.isRequired,
  loadingMyChallenges: PT.bool.isRequired,
  loadingOpenChallenges: PT.bool.isRequired,
  loadingOnGoingChallenges: PT.bool.isRequired,
  loadingReviewOpportunities: PT.bool.isRequired,
  loadMorePast: PT.func,
  loadMoreMy: PT.func,
  loadMoreOpen: PT.func,
  loadMoreOnGoing: PT.func,
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
  loadMoreChallenges: PT.func,
};
