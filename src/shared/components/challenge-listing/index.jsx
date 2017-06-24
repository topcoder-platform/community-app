/* global JSON */

/**
 * This component implements a demo of ChallengeFilters in action.
 *
 * It uses ChallengeFilters component to show the challenge search & filter panel,
 * and it implements a simple logic to search, filter, and display the challenges
 * using TC API V2. As TC API V2 does not really provides the necessary ways to
 * filter and search the challenges, this example component always query all
 * challenges from the queried competition tracks (Data Science, Design, or
 * Development), and then performs the filtering of the results at the front-end
 * side, achieving the same behavior, visible for the end-user, as was requested in
 * the related challenge.
 */

import _ from 'lodash';
import ChallengeFilters from 'containers/challenge-listing/FilterPanel';
import React from 'react';
import PT from 'prop-types';
// import config from 'utils/config';
import Sticky from 'react-stickynode';
import * as Filter from 'utils/challenge-listing/filter';
import Sidebar from 'containers/challenge-listing/Sidebar';

// import ChallengeCard from './ChallengeCard';
import Listing from './Listing';
import ChallengeCardPlaceholder from './placeholders/ChallengeCard';
import SRMCard from './SRMCard';

import './style.scss';

// Number of challenge placeholder card to display
const CHALLENGE_PLACEHOLDER_COUNT = 8;

/** Fetch Past challenges
 * {param} limit: Number of challenges to fetch
 * {param} helper: Function to invoke to map response
 */
/*
function fetchPastChallenges(limit, helper, groupIds, tokenV3) {
  const cService = getChallengesService(tokenV3);
  const MAX_LIMIT = 50;
  const result = [];
  const numFetch = Math.ceil(limit / MAX_LIMIT);
  const handleResponse = res => helper(res);
  for (let i = 0; i < numFetch; i += 1) {
    result.push(cService.getChallenges({
      groupIds,
      status: 'COMPLETED',
    }, {
      limit: MAX_LIMIT,
      offset: i * MAX_LIMIT,
    }).then(handleResponse));
  }
  return result;
}
*/

// helper function to serialize object to query string
// const serialize = filter => filter.getURLEncoded();

// helper function to de-serialize query string to filter object
/*
const deserialize = (queryString) => {
  const filter = new SideBarFilter({
    filter: queryString,
    isSavedFilter: true, // So that we can reuse constructor for deserializing
  });
  if (!_.values(SideBarFilterModes).includes(filter.name)) {
    filter.isCustomFilter = true;
  }
  return filter;
};
*/

// The demo component itself.
export default function ChallengeListing(props) {
  let challenges = props.challenges;
  /*
  if (this.props.challengeGroupId) {
    challenges = challenges.filter(item =>
      item.groups[this.props.challengeGroupId]);
  }
  */

  // filter all challenges by master filter before applying any user filters
  /*
  challenges = _.filter(challenges, this.props.masterFilterFunc);
  const currentFilter = this.getFilter();
  currentFilter.mode = 'custom';
  if (this.props.auth.user) {
    challenges = challenges.map((item) => {
      if (item.users[this.props.auth.user.handle]) {
        _.assign(item, { myChallenge: true });
      }
      return item;
    });
  }
  */

  challenges = challenges.filter(
    Filter.getFilterFunction(props.filterState));

  // challenges.sort((a, b) => b.submissionEndDate - a.submissionEndDate);

  // const filter = this.getFilter();
  // const { name: sidebarFilterName } = filter;

  // const expanded = sidebarFilterName !== 'All Challenges';

  const expanded = false;

  let challengeCardContainer;
  if (!expanded && props.loadingChallenges) {
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
        // config={this.props.config}
        onTechTagClicked={(tag) => {
          _.noop(tag);
          /* TODO: This should be rewired using setFilterState(..) */
          // if (this.challengeFilters) this.challengeFilters.setKeywords(tag);
        }}
        challenges={challenges}
        loadMore={props.loadMore}
        loadMorePast={props.loadMorePast}
        selectBucket={props.selectBucket}
        setFilterState={props.setFilterState}
        setSort={props.setSort}
        sorts={props.sorts}

        // challengeGroupId={this.props.challengeGroupId}
        // currentFilterName={sidebarFilterName}
        // expanded={sidebarFilterName !== 'All Challenges'}
        // getChallenges={this.props.getChallenges}
        // getMarathonMatches={this.props.getMarathonMatches}
        /*
        additionalFilter={
          challenge => filterFunc(challenge) && sidebarFilterFunc(challenge)
        }
        // Handle onExpandFilterResult to update the sidebar
        onExpandFilterResult={
          filterName => this.sidebar.selectFilterWithName(filterName)
        }
        */
      />
    );
  }

  // Upcoming srms
  // let futureSRMChallenge = this.state.srmChallenges.filter(challenge =>
  //  challenge.status === 'FUTURE');
  /*
  futureSRMChallenge = futureSRMChallenge.sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );

  const UpcomingSrm = futureSRMChallenge.map(
    srmChallenge => (
      <SRMCard
        category={'upcoming'}
        srmChallenge={srmChallenge}
        key={JSON.stringify(srmChallenge)}
      />
    ),
  );
  */

  return (
    <div styleName="ChallengeFiltersExample">
      <ChallengeFilters
        onSaveFilter={_.noop /* (filterToSave) => {
          /*
          if (this.sidebar) {
            const f = (new SideBarFilter(SideBarFilterModes.CUSTOM)).merge(filterToSave);
            f.name = this.sidebar.getAvailableFilterName();
            this.sidebar.addFilter(f);
          }
          */
        }
        challengeGroupId={props.challengeGroupId}
        communityName={props.communityName}
        setCardType={_.noop/* cardType => this.setCardType(cardType) */}
        isCardTypeSet={'Challenges' /* this.state.currentCardType */}
      />
      <div styleName={`tc-content-wrapper ${/* this.state.currentCardType === 'SRMs' ? '' :*/'hidden'}`}>
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
            <Sidebar />
          </Sticky>
        </div>
      </div>
    </div>
  );
}

ChallengeListing.defaultProps = {
  challengeGroupId: '',
  communityName: null,
  masterFilterFunc: () => true,
  auth: null,
};

ChallengeListing.propTypes = {
  activeBucket: PT.string.isRequired,
  challenges: PT.arrayOf(PT.shape()).isRequired,
  communityName: PT.string,
  filterState: PT.shape().isRequired,
  // getChallenges: PT.func.isRequired,
  // getMarathonMatches: PT.func.isRequired,
  loadingChallenges: PT.bool.isRequired,
  loadMorePast: PT.func.isRequired,
  loadMore: PT.shape().isRequired,
  selectBucket: PT.func.isRequired,
  setFilterState: PT.func.isRequired,
  setSort: PT.func.isRequired,
  sorts: PT.shape().isRequired,

  challengeGroupId: PT.string,
  // masterFilterFunc: PT.func,
  auth: PT.shape(),
};
