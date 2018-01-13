/**
 * Challenge listing component.
 */

import _ from 'lodash';
import config from 'utils/config';
import ChallengeFilters from 'containers/challenge-listing/FilterPanel';
import moment from 'moment';
import React from 'react';
import PT from 'prop-types';
import Sticky from 'react-stickynode';
import * as Filter from 'utils/challenge-listing/filter';
import Sidebar from 'containers/challenge-listing/Sidebar';
import { isReviewOpportunitiesBucket } from 'utils/challenge-listing/buckets';

import Listing from './Listing';
import ChallengeCardPlaceholder from './placeholders/ChallengeCard';
import SRMCard from './SRMCard';

import './style.scss';

// Number of challenge placeholder card to display
const CHALLENGE_PLACEHOLDER_COUNT = 8;

export default function ChallengeListing(props) {
  const {
    activeBucket,
    defaultCommunityId,
    hideSrm,
    keepPastPlaceholders,
  } = props;

  let challenges = props.challenges;

  if (props.communityFilter) {
    challenges = challenges.filter(
      Filter.getFilterFunction(props.communityFilter));
  }

  challenges = challenges.filter(
    Filter.getFilterFunction(props.filterState));

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
    suppressPlaceholders =
      outage < 1.5 * 1000 * config.CHALLENGE_LISTING_AUTO_REFRESH;
  }

  let challengeCardContainer;
  if (!expanded && props.loadingChallenges && !suppressPlaceholders
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
        challengesUrl={props.challengesUrl}
        communityName={props.communityName}
        expandedTags={props.expandedTags}
        expandTag={props.expandTag}
        filterState={props.filterState}
        keepPastPlaceholders={keepPastPlaceholders}
        loadingDraftChallenges={props.loadingDraftChallenges}
        loadingPastChallenges={props.loadingPastChallenges}
        loadingReviewOpportunities={props.loadingReviewOpportunities}
        loadMoreDraft={props.loadMoreDraft}
        loadMorePast={props.loadMorePast}
        loadMoreReviewOpportunities={props.loadMoreReviewOpportunities}
        newChallengeDetails={props.newChallengeDetails}
        openChallengesInNewTabs={props.openChallengesInNewTabs}
        prizeMode={props.prizeMode}
        reviewOpportunities={props.reviewOpportunities}
        selectBucket={props.selectBucket}
        selectChallengeDetailsTab={props.selectChallengeDetailsTab}
        selectedCommunityId={props.selectedCommunityId}
        setFilterState={props.setFilterState}
        setSort={props.setSort}
        sorts={props.sorts}
      />
    );
  }

  return (
    <div styleName="ChallengeFiltersExample" id="challengeFilterContainer">
      <ChallengeFilters
        challenges={props.challenges}
        communityName={props.communityName}
        defaultCommunityId={defaultCommunityId}
        hideSrm={hideSrm}
        setCardType={_.noop/* cardType => this.setCardType(cardType) */}
        isCardTypeSet={'Challenges' /* this.state.currentCardType */}
        isAuth={Boolean(props.auth.user)}
      />
      <div styleName={`tc-content-wrapper ${/* this.state.currentCardType === 'SRMs' ? '' : */'hidden'}`}>
        <div styleName="sidebar-container-mobile">
          {/* <ChallengesSidebar SidebarMock={SRMsSidebarMock} /> */}
        </div>

        <div styleName="challenges-container SRMs-container">
          {/* happening now */}
          <div>
            <SRMCard category={'now'} />
          </div>
          {/* upcoming SRMs */}
          <div>
            <div styleName="title">Upcoming SRMs</div>
            { /* UpcomingSrm */ }
          </div>
          {/* past SRMs */}
          <div>
            <div styleName="title">Past SRMs</div>
            <SRMCard category={'past'} />
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
            <Sidebar hideTcLinksInFooter={props.hideTcLinksInFooter} />
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
  hideTcLinksInFooter: false,
  loadMoreDraft: null,
  loadMorePast: null,
  loadMoreReviewOpportunities: null,
  newChallengeDetails: false,
  openChallengesInNewTabs: false,
  reviewOpportunities: [],
  prizeMode: 'money-usd',
  expandedTags: [],
  expandTag: null,
};

ChallengeListing.propTypes = {
  activeBucket: PT.string.isRequired,
  challenges: PT.arrayOf(PT.shape()).isRequired,
  challengesUrl: PT.string.isRequired,
  communityFilter: PT.shape(),
  communityName: PT.string,
  defaultCommunityId: PT.string.isRequired,
  expandedTags: PT.arrayOf(PT.number),
  expandTag: PT.func,
  filterState: PT.shape().isRequired,
  hideSrm: PT.bool.isRequired,
  hideTcLinksInFooter: PT.bool,
  keepPastPlaceholders: PT.bool.isRequired,
  lastUpdateOfActiveChallenges: PT.number.isRequired,
  loadingChallenges: PT.bool.isRequired,
  loadingDraftChallenges: PT.bool.isRequired,
  loadingPastChallenges: PT.bool.isRequired,
  loadingReviewOpportunities: PT.bool.isRequired,
  loadMoreDraft: PT.func,
  loadMorePast: PT.func,
  loadMoreReviewOpportunities: PT.func,
  newChallengeDetails: PT.bool,
  openChallengesInNewTabs: PT.bool,
  prizeMode: PT.string,
  reviewOpportunities: PT.arrayOf(PT.shape()),
  selectBucket: PT.func.isRequired,
  selectChallengeDetailsTab: PT.func.isRequired,
  selectedCommunityId: PT.string.isRequired,
  setFilterState: PT.func.isRequired,
  setSort: PT.func.isRequired,
  sorts: PT.shape().isRequired,
  auth: PT.shape(),
};
