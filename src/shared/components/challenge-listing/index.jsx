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
import React from 'react';
import PT from 'prop-types';
import config from 'utils/config';
import Sticky from 'react-stickynode';

import ChallengeFilterWithSearch from './Filters/ChallengeFilterWithSearch';
import ChallengeFilters from './Filters/ChallengeFilters';
import SideBarFilter, { MODE as SideBarFilterModes } from './SideBarFilters/SideBarFilter';
import SideBarFilters from './SideBarFilters';
import ChallengeCard from './ChallengeCard';
import ChallengeCardContainer from './ChallengeCardContainer';
import ChallengeCardPlaceholder from './placeholders/ChallengeCardPlaceholder';
import SidebarFilterPlaceholder from './placeholders/SidebarFilterPlaceholder';
import SRMCard from './SRMCard';
import ChallengesSidebar from './Sidebar';

import './style.scss';

/**
 * Helper function for generation of VALID_KEYWORDS and VALID_TRACKS arrays.
 * @param {String} keyword
 * @return {Object} The valid object to include into the array which will be
 *  passed into the ChallengeFilters component.
 */
function keywordsMapper(keyword) {
  return {
    label: keyword,
    value: keyword,
  };
}

// Number of challenge placeholder card to display
const CHALLENGE_PLACEHOLDER_COUNT = 8;

// A mock list of SRMs side bar
const SRMsSidebarMock = {
  all: { name: 'All SRMs', value: 853 },
  myChallenges: { name: 'My Challenges', value: 3 },
  others: [
    { name: 'Upcoming SRM', value: 16 },
    { name: 'Past SRM', value: 34 },
  ],
  myFilters: [
    { name: 'TCO Finals', value: 23 },
  ],
};

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
const serialize = filter => filter.getURLEncoded();

// helper function to de-serialize query string to filter object
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

// The demo component itself.
class ChallengeFiltersExample extends React.Component {

  /**
   * ChallengeFiltersExample was brought from another project without server rendering support.
   * To make rendering on the server consistent with the client rendering, we have to make sure all
   * setState calls will preform after this component is mounted. So we moved all the code which
   * can call setState from the constructor to here. Also we added some logic to make sure we
   * load data only once.
   */
  componentDidMount() {
    /*
    if (!this.state.isSRMChallengesLoading && !this.state.isSRMChallengesLoaded) {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ isSRMChallengesLoading: true });
      /* Fetching of SRM challenges */
      /*
      fetch(`${this.props.config.API_URL}/srms/?filter=status=FUTURE`)
        .then(res => res.json())
        .then((json) => {
          this.setState({
            srmChallenges: json.result.content,
            isSRMChallengesLoading: false,
            isSRMChallengesLoaded: true,
          });
        });
    }
    */
  }

  /**
   * Searches the challenges for with the specified search string, competition
   * tracks, and filters.
   *
   * As TopCoder API v2 does not provide all necessary search & filtering
   * capabilites, this function fetches all challenges from the requested
   * tracks, then filters them by searching for 'searchString' in challenge
   * name, platforms, and techologies, and by filtering them with 'filter'
   * function, and then sets the remaining challenges into the component state.
   *
   * @param {String} searchString The search string.
   * @param {Function(Challenge)} filter Additional filter function.
   */
  onSearch(searchString) {
    const f = new ChallengeFilterWithSearch();
    _.merge(f, this.getFilter());
    f.query = searchString;
    if (f.query) this.onFilterByTopFilter(f);
    else this.saveFiltersToHash(this.getFilter());
  }

  onFilterByTopFilter(filter, isSidebarFilter) {
    let updatedFilter;
    if (filter.query && filter.query !== '') {
      updatedFilter = filter;
      updatedFilter.isCustomFilter = true;
      updatedFilter.mode = SideBarFilterModes.CUSTOM;
    } else {
      const f = this.getFilter();
      const mergedFilter = Object.assign({}, f, filter);
      if (isSidebarFilter) {
        if (f.groupId) mergedFilter.groupId = f.groupId;
      }
      updatedFilter = new SideBarFilter(mergedFilter);
      if (!isSidebarFilter) {
        updatedFilter.mode = SideBarFilterModes.CUSTOM;
      }
    }
    this.saveFiltersToHash(updatedFilter, updatedFilter.query || this.getSearchQuery());
  }

  // set current card type
  /*
  setCardType(cardType) {
    this.setState({
      currentCardType: cardType,
    });
  }
  */

  /**
   * Creates filter object from the text filter representation in the state.
   * @return {Object}
   */
  getFilter() {
    const q = this.getSearchQuery();
    let f = deserialize(this.props.filter);
    if (q) {
      f = _.merge(new ChallengeFilterWithSearch(), f);
      f.query = q;
    }
    return f;
  }

  /**
   * Extracts free text search query from the filter string.
   * @return {String}
   */
  getSearchQuery() {
    return this.props.filter.split('&').filter(e =>
      e.startsWith('query')).map(element => element.split('=')[1])[0];
  }

  /**
   * Saves current filters to the URL hash.
   */
  saveFiltersToHash(filter, searchQuery) {
    let urlString = searchQuery ? `&query=${searchQuery}` : '';
    urlString += serialize(filter);
    this.props.setFilter(urlString);
  }

  // ReactJS render method.
  render() {
    let challenges = this.props.challenges;
    /*
    if (this.props.challengeGroupId) {
      challenges = challenges.filter(item =>
        item.groups[this.props.challengeGroupId]);
    }
    */

    // filter all challenges by master filter before applying any user filters
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

    challenges.sort((a, b) => b.submissionEndDate - a.submissionEndDate);

    const filter = this.getFilter();
    const { name: sidebarFilterName } = filter;

    const expanded = sidebarFilterName !== 'All Challenges';

    let challengeCardContainer;
    if (!expanded && this.props.loadingChallenges) {
      const challengeCards = _.range(CHALLENGE_PLACEHOLDER_COUNT)
      .map(key => <ChallengeCardPlaceholder id={key} key={key} />);
      challengeCardContainer = (
        <div styleName="challenge-cards-container">
          <div styleName="ChallengeCardExamples">
            { challengeCards }
          </div>
        </div>
      );
    } else if (filter.isCustomFilter) {
      if (currentFilter.mode === SideBarFilterModes.CUSTOM) {
        challenges = this.props.challenges.filter(currentFilter.getFilterFunction());
      }

      const cardify = challenge => (
        <ChallengeCard
          challenge={challenge}
          config={this.props.config}
          onTechTagClicked={(tag) => {
            if (this.challengeFilters) this.challengeFilters.setKeywords(tag);
          }}
          key={challenge.id}
        />
      );

      challengeCardContainer = (
        <div styleName="challenge-cards-container">
          <div>
            {challenges.filter(filter.getFilterFunction()).map(cardify)}
          </div>
        </div>
      );
    } else {
      const filterFunc = filter.getFilterFunction();
      const sidebarFilterFunc = (challenge) => {
        if (currentFilter.mode !== SideBarFilterModes.CUSTOM) {
          return true;
        }
        return currentFilter.getFilterFunction()(challenge);
      };

      challengeCardContainer = (
        <ChallengeCardContainer
          auth={this.props.auth}
          config={this.props.config}
          onTechTagClicked={(tag) => {
            if (this.challengeFilters) this.challengeFilters.setKeywords(tag);
          }}
          challenges={_.uniqBy(challenges, 'id')}
          challengeGroupId={this.props.challengeGroupId}
          currentFilterName={sidebarFilterName}
          expanded={sidebarFilterName !== 'All Challenges'}
          getChallenges={this.props.getChallenges}
          getMarathonMatches={this.props.getMarathonMatches}
          additionalFilter={
            challenge => filterFunc(challenge) && sidebarFilterFunc(challenge)
          }
          // Handle onExpandFilterResult to update the sidebar
          onExpandFilterResult={
            filterName => this.sidebar.selectFilterWithName(filterName)
          }
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
          filter={this.getFilter()}
          onFilter={topFilter => this.onFilterByTopFilter(topFilter)}
          onSaveFilter={(filterToSave) => {
            if (this.sidebar) {
              const f = (new SideBarFilter(SideBarFilterModes.CUSTOM)).merge(filterToSave);
              f.name = this.sidebar.getAvailableFilterName();
              this.sidebar.addFilter(f);
            }
          }}
          challengeGroupId={this.props.challengeGroupId}
          communityName={this.props.communityName}
          searchQuery={this.getSearchQuery()}
          onSearch={query => this.onSearch(query)}
          validKeywords={this.props.challengeTags.map(keywordsMapper)}
          validSubtracks={this.props.challengeSubtracks.map(keywordsMapper)}
          setCardType={_.noop/* cardType => this.setCardType(cardType) */}
          isCardTypeSet={'Challenges' /* this.state.currentCardType */}
          ref={(node) => { this.challengeFilters = node; }}
        />
        <div styleName={`tc-content-wrapper ${/* this.state.currentCardType === 'SRMs' ? '' :*/'hidden'}`}>
          <div styleName="sidebar-container-mobile">
            <ChallengesSidebar SidebarMock={SRMsSidebarMock} />
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
              <ChallengesSidebar SidebarMock={SRMsSidebarMock} />
            </Sticky>
          </div>
        </div>

        <div styleName={`tc-content-wrapper ${/* this.state.currentCardType === 'Challenges' ? '' : 'hidden' */''}`}>
          <div styleName="sidebar-container-mobile">
            {!this.props.loadingChallenges || expanded ? (<SideBarFilters
              config={this.props.config}
              challengeGroupId={filter.groupId}
              challenges={challenges}
              filter={this.getFilter()}
              onFilter={topFilter => this.onFilterByTopFilter(topFilter, true)}
              ref={(node) => {
                this.sidebar = node;
              }}
              isAuth={this.props.isAuth}
              myChallenges={this.props.myChallenges}
              auth={this.props.auth}
            />) : <SidebarFilterPlaceholder />}
          </div>

          {challengeCardContainer}

          <div styleName="sidebar-container-desktop">
            <Sticky top={20}>
              {!this.props.loadingChallenges || expanded ? (<SideBarFilters
                config={this.props.config}
                challenges={challenges}
                filter={this.getFilter()}
                challengeGroupId={filter.groupId}
                onFilter={topFilter => this.onFilterByTopFilter(topFilter, true)}
                ref={(node) => {
                  this.sidebar = node;
                }}
                isAuth={this.props.isAuth}
                myChallenges={this.props.myChallenges}
                auth={this.props.auth}
              />) : <SidebarFilterPlaceholder />}
            </Sticky>
          </div>
        </div>
      </div>
    );
  }
}

ChallengeFiltersExample.defaultProps = {
  challengeGroupId: '',
  communityName: null,
  config: {
    API_URL_V2: config.API.V2,
    API_URL: config.API.V3,
    MAIN_URL: config.TC_BASE_URL,
    COMMUNITY_URL: config.COMMUNITY_URL,
  },
  myChallenges: [],
  // challengeFilters: undefined,
  isAuth: false,
  masterFilterFunc: () => true,
  auth: null,
};

ChallengeFiltersExample.propTypes = {
  challenges: PT.arrayOf(PT.shape({

  })).isRequired,
  challengeSubtracks: PT.arrayOf(PT.string).isRequired,
  challengeTags: PT.arrayOf(PT.string).isRequired,
  communityName: PT.string,
  filter: PT.string.isRequired,
  getChallenges: PT.func.isRequired,
  getMarathonMatches: PT.func.isRequired,
  loadingChallenges: PT.bool.isRequired,
  setFilter: PT.func.isRequired,

  /* OLD PROPS BELOW */
  config: PT.shape({
    API_URL_V2: PT.string,
    API_URL: PT.string,
    MAIN_URL: PT.MAIN_URL,
    COMMUNITY_URL: PT.COMMUNITY_URL,
  }),
  challengeGroupId: PT.string,
  myChallenges: PT.arrayOf(PT.shape),
  // challengeFilters: PT.object,
  isAuth: PT.bool,
  masterFilterFunc: PT.func,
  auth: PT.shape(),
};

export default ChallengeFiltersExample;
