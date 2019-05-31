/**
 * Container for the header filters panel.
 */
/* global window */

import actions from 'actions/challenge-listing/filter-panel';
import challengeListingActions from 'actions/challenge-listing';
import communityActions from 'actions/tc-communities';
import shortId from 'shortid';
import FilterPanel from 'components/challenge-listing/Filters/ChallengeFilters';
import PT from 'prop-types';
import React from 'react';
import sidebarActions from 'actions/challenge-listing/sidebar';
import { BUCKETS, isReviewOpportunitiesBucket } from 'utils/challenge-listing/buckets';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import qs from 'qs';

/* The default name for user-saved challenge filters. An integer
 * number will be appended to it, when necessary, to keep filter
 * names unique. */
const DEFAULT_SAVED_FILTER_NAME = 'My Filter';
const MIN = 60 * 1000;

/**
 * Returns a vacant name for the user saved filter.
 * @param {Object} state Redux state.
 * @return {String}
 */
function getAvailableFilterName(savedFilters) {
  let res = DEFAULT_SAVED_FILTER_NAME;
  let id = 0;
  savedFilters.forEach((f) => {
    while (res === f.name) {
      res = `${DEFAULT_SAVED_FILTER_NAME} ${id += 1}`;
    }
  });
  return res;
}

export class Container extends React.Component {
  componentDidMount() {
    const {
      getKeywords,
      getSubtracks,
      loadingKeywords,
      loadingSubtracks,
      setFilterState,
      filterState,
      communityList,
      getCommunityList,
      auth,
    } = this.props;

    if (communityList && !communityList.loadingUuid
    && (Date.now() - communityList.timestamp > 5 * MIN)) {
      getCommunityList(auth);
    }

    if (!loadingSubtracks) getSubtracks();
    if (!loadingKeywords) getKeywords();


    const query = qs.parse(window.location.search.slice(1));
    if (query.filter && !filterState.track) {
      setFilterState(query.filter);
    }
  }

  render() {
    const {
      activeBucket,
      communityFilters,
      filterState,
      isSavingFilter,
      saveFilter,
      savedFilters,
      selectBucket,
      selectedCommunityId,
      setFilterState,
      tokenV2,
    } = this.props;
    const communityFilters2 = [
      {
        communityId: '',
        communityName: 'All',
        challengeFilter: {},
      },
      ...communityFilters,
    ];

    const isForReviewOpportunities = isReviewOpportunitiesBucket(activeBucket);

    return (
      <FilterPanel
        {...this.props}
        communityFilters={communityFilters2}
        saveFilter={() => {
          const name = getAvailableFilterName(savedFilters);
          const filter = {
            ...filterState,
            communityId: selectedCommunityId,
          };

          if (isForReviewOpportunities) filter.isForReviewOpportunities = true;

          saveFilter(name, filter, tokenV2);
        }}
        setFilterState={(state) => {
          setFilterState(state);
          if (activeBucket === BUCKETS.SAVED_FILTER) {
            selectBucket(BUCKETS.ALL);
          } else if (activeBucket === BUCKETS.SAVED_REVIEW_OPPORTUNITIES_FILTER) {
            selectBucket(BUCKETS.REVIEW_OPPORTUNITIES);
          }
        }}
        isSavingFilter={isSavingFilter}
        isReviewOpportunitiesBucket={isForReviewOpportunities}
      />
    );
  }
}

Container.defaultProps = {
  isSavingFilter: false,
  tokenV2: '',
  challenges: [],
};

Container.propTypes = {
  activeBucket: PT.string.isRequired,
  communityFilters: PT.arrayOf(PT.object).isRequired,
  defaultCommunityId: PT.string.isRequired,
  getCommunityList: PT.func.isRequired,
  communityList: PT.shape({
    data: PT.arrayOf(PT.shape({
      communityId: PT.string.isRequired,
      communityName: PT.string.isRequired,
    })).isRequired,
    loadingUuid: PT.string.isRequired,
    timestamp: PT.number.isRequired,
  }).isRequired,
  filterState: PT.shape().isRequired,
  challenges: PT.arrayOf(PT.shape()),
  selectedCommunityId: PT.string.isRequired,
  getKeywords: PT.func.isRequired,
  getSubtracks: PT.func.isRequired,
  isSavingFilter: PT.bool,
  savedFilters: PT.arrayOf(PT.shape()).isRequired,
  loadingKeywords: PT.bool.isRequired,
  loadingSubtracks: PT.bool.isRequired,
  saveFilter: PT.func.isRequired,
  selectBucket: PT.func.isRequired,
  setFilterState: PT.func.isRequired,
  auth: PT.shape().isRequired,
  tokenV2: PT.string,
};

function mapDispatchToProps(dispatch) {
  const a = actions.challengeListing.filterPanel;
  const cla = challengeListingActions.challengeListing;
  const sa = sidebarActions.challengeListing.sidebar;
  return {
    ...bindActionCreators(a, dispatch),
    getSubtracks: () => {
      dispatch(cla.getChallengeSubtracksInit());
      dispatch(cla.getChallengeSubtracksDone());
    },
    getCommunityList: (auth) => {
      const uuid = shortId();
      dispatch(communityActions.tcCommunity.getListInit(uuid));
      dispatch(communityActions.tcCommunity.getListDone(uuid, auth));
    },
    getKeywords: () => {
      dispatch(cla.getChallengeTagsInit());
      dispatch(cla.getChallengeTagsDone());
    },
    saveFilter: (...rest) => {
      dispatch(sa.saveFilterInit());
      dispatch(sa.saveFilterDone(...rest));
    },
    selectBucket: bucket => dispatch(sa.selectBucket(bucket)),
    selectCommunity: id => dispatch(cla.selectCommunity(id)),
    setFilterState: s => dispatch(cla.setFilter(s)),
  };
}

function mapStateToProps(state, ownProps) {
  const cl = state.challengeListing;
  const tc = state.tcCommunities;
  return {
    ...ownProps,
    ...state.challengeListing.filterPanel,
    activeBucket: cl.sidebar.activeBucket,
    communityFilters: tc.list.data,
    communityList: tc.list,
    defaultCommunityId: ownProps.defaultCommunityId,
    filterState: cl.filter,
    loadingKeywords: cl.loadingChallengeTags,
    loadingSubtracks: cl.loadingChallengeSubtracks,
    validKeywords: cl.challengeTags,
    validSubtracks: cl.challengeSubtracks,
    selectedCommunityId: cl.selectedCommunityId,
    auth: state.auth,
    tokenV2: state.auth.tokenV2,
    isSavingFilter: cl.sidebar.isSavingFilter,
    savedFilters: cl.sidebar.savedFilters,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Container);
