/**
 * Container for the header filters panel.
 */

import actions from 'actions/challenge-listing/filter-panel';
import challengeListingActions from 'actions/challenge-listing';
import FilterPanel from 'components/challenge-listing/Filters/ChallengeFilters';
import PT from 'prop-types';
import React from 'react';
import sidebarActions from 'actions/challenge-listing/sidebar';
import { BUCKETS, isReviewOpportunitiesBucket } from 'utils/challenge-listing/buckets';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/* The default name for user-saved challenge filters. An integer
 * number will be appended to it, when necessary, to keep filter
 * names unique. */
const DEFAULT_SAVED_FILTER_NAME = 'My Filter';

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
    if (!this.props.loadingSubtracks) this.props.getSubtracks();
    if (!this.props.loadingKeywords) this.props.getKeywords();
  }

  render() {
    const communityFilters = [
      {
        communityId: '',
        communityName: 'All',
        challengeFilter: {},
      },
      ...this.props.communityFilters,
    ];

    const isForReviewOpportunities = isReviewOpportunitiesBucket(this.props.activeBucket);

    return (
      <FilterPanel
        {...this.props}
        communityFilters={communityFilters}
        saveFilter={() => {
          const name = getAvailableFilterName(this.props.savedFilters);
          const filter = {
            ...this.props.filterState,
            communityId: this.props.selectedCommunityId,
          };

          if (isForReviewOpportunities) filter.isForReviewOpportunities = true;

          this.props.saveFilter(name, filter, this.props.tokenV2);
        }}
        setFilterState={(state) => {
          this.props.setFilterState(state);
          if (this.props.activeBucket === BUCKETS.SAVED_FILTER) {
            this.props.selectBucket(BUCKETS.ALL);
          } else if (this.props.activeBucket === BUCKETS.SAVED_REVIEW_OPPORTUNITIES_FILTER) {
            this.props.selectBucket(BUCKETS.REVIEW_OPPORTUNITIES);
          }
        }}
        isSavingFilter={this.props.isSavingFilter}
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
