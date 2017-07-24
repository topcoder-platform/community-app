/**
 * Container for the header filters panel.
 */

import actions from 'actions/challenge-listing/filter-panel';
import challengeListingActions from 'actions/challenge-listing';
import FilterPanel from 'components/challenge-listing/Filters/ChallengeFilters';
import PT from 'prop-types';
import React from 'react';
import sidebarActions from 'actions/challenge-listing/sidebar';
import { BUCKETS } from 'utils/challenge-listing/buckets';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/* The default name for user-saved challenge filters. An integer
 * number will be appended to it, when necessary, to keep filter
 * names unique. */
const DEFAULT_SAVED_FILTER_NAME = 'My Filter';

export class Container extends React.Component {

  componentDidMount() {
    if (!this.props.loadingSubtracks) this.props.getSubtracks();
    if (!this.props.loadingKeywords) this.props.getKeywords();
  }

  render() {
    return (
      <FilterPanel
        {...this.props}
        saveFilter={() => {
          const name = this.props.getAvailableFilterName();
          this.props.saveFilter(
            name, this.props.filterState, this.props.tokenV2);
        }}
        setFilterState={(state) => {
          this.props.setFilterState(state);
          if (this.props.activeBucket === BUCKETS.SAVED_FILTER) {
            this.props.selectBucket(BUCKETS.ALL);
          }
        }}
      />
    );
  }
}

/**
 * Returns a vacant name for the user saved filter.
 * @param {Object} state Redux state.
 * @return {String}
 */
function getAvailableFilterName(state) {
  let res = DEFAULT_SAVED_FILTER_NAME;
  let id = 0;
  state.challengeListing.sidebar.savedFilters.forEach((f) => {
    while (res === f.name) {
      res = `${DEFAULT_SAVED_FILTER_NAME} ${id += 1}`;
    }
  });
  return res;
}

Container.defaultProps = {
  tokenV2: '',
};

Container.propTypes = {
  activeBucket: PT.string.isRequired,
  filterState: PT.shape().isRequired,
  getAvailableFilterName: PT.func.isRequired,
  getKeywords: PT.func.isRequired,
  getSubtracks: PT.func.isRequired,
  loadingKeywords: PT.bool.isRequired,
  loadingSubtracks: PT.bool.isRequired,
  saveFilter: PT.func.isRequired,
  selectBucket: PT.func.isRequired,
  setFilterState: PT.func.isRequired,
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
    saveFilter: (...rest) =>
      dispatch(sa.saveFilter(...rest)),
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
    communityFilters: [{ communityId: '', communityName: 'All' }].concat(tc.list),
    filterState: cl.filter,
    getAvailableFilterName: () => getAvailableFilterName(state),
    loadingKeywords: cl.loadingChallengeTags,
    loadingSubtracks: cl.loadingChallengeSubtracks,
    validKeywords: cl.challengeTags,
    validSubtracks: cl.challengeSubtracks,
    selectedCommunityId: cl.selectedCommunityId,
    tokenV2: state.auth.tokenV2,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Container);
