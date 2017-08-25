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

import Listing from './Listing';
import ChallengeCardPlaceholder from './placeholders/ChallengeCard';
import SRMCard from './SRMCard';

import './style.scss';

// Number of challenge placeholder card to display
const CHALLENGE_PLACEHOLDER_COUNT = 8;

export default function ChallengeListing(props) {
  function CheckDateTime(str) {
    const reg = /^(\d{4})-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2})\.(\d{3})Z$/;
    const r = str.match(reg);
    if (r == null) return false;
    r[2] -= 1;
    const d = new Date(r[1], r[2], r[3], r[4], r[5], r[6]);
    if (d.getFullYear() !== r[1]) return false;
    if (d.getMonth() !== r[2]) return false;
    if (d.getDate() !== r[3]) return false;
    if (d.getHours() !== r[4]) return false;
    if (d.getMinutes() !== r[5]) return false;
    if (d.getSeconds() !== r[6]) return false;
    return true;
  }
  const filterState = props.filterState;
  if (filterState) {
    if (!!filterState.startDate && CheckDateTime(filterState.startDate) === false) {
      delete filterState.startDate;
    }
    if (!!filterState.endDate && CheckDateTime(filterState.endDate) === false) {
      delete filterState.endDate;
    }
  }
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
  if (!expanded && props.loadingChallenges && !suppressPlaceholders) {
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
        activeBucket={props.activeBucket}
        auth={props.auth}
        challenges={challenges}
        communityName={props.communityName}
        loadingDraftChallenges={props.loadingDraftChallenges}
        loadingPastChallenges={props.loadingPastChallenges}
        loadMoreDraft={props.loadMoreDraft}
        loadMorePast={props.loadMorePast}
        openChallengesInNewTabs={props.openChallengesInNewTabs}
        prizeMode={props.prizeMode}
        selectBucket={props.selectBucket}
        setFilterState={props.setFilterState}
        setSort={props.setSort}
        sorts={props.sorts}
      />
    );
  }

  return (
    <div styleName="ChallengeFiltersExample">
      <ChallengeFilters
        groupId={props.groupId}
        communityName={props.communityName}
        setCardType={_.noop/* cardType => this.setCardType(cardType) */}
        isCardTypeSet={'Challenges' /* this.state.currentCardType */}
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
          <Sticky top={20}>
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
  groupId: '',
  hideTcLinksInFooter: false,
  loadMoreDraft: null,
  loadMorePast: null,
  openChallengesInNewTabs: false,
  prizeMode: 'money-usd',
};

ChallengeListing.propTypes = {
  activeBucket: PT.string.isRequired,
  challenges: PT.arrayOf(PT.shape()).isRequired,
  communityFilter: PT.shape(),
  communityName: PT.string,
  filterState: PT.shape().isRequired,
  hideTcLinksInFooter: PT.bool,
  lastUpdateOfActiveChallenges: PT.number.isRequired,
  loadingChallenges: PT.bool.isRequired,
  loadingDraftChallenges: PT.bool.isRequired,
  loadingPastChallenges: PT.bool.isRequired,
  loadMoreDraft: PT.func,
  loadMorePast: PT.func,
  openChallengesInNewTabs: PT.bool,
  prizeMode: PT.string,
  selectBucket: PT.func.isRequired,
  setFilterState: PT.func.isRequired,
  setSort: PT.func.isRequired,
  sorts: PT.shape().isRequired,
  groupId: PT.string,
  auth: PT.shape(),
};
