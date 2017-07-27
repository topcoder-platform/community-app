/**
 * Container for the Sidebar.
 */

import _ from 'lodash';
import actions from 'actions/challenge-listing/sidebar';
import challengeListingActions from 'actions/challenge-listing';
import filterPanelActions from 'actions/challenge-listing/filter-panel';
import PT from 'prop-types';
import React from 'react';
import Sidebar from 'components/challenge-listing/Sidebar';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { BUCKETS, getBuckets } from 'utils/challenge-listing/buckets';

export const SidebarPureComponent = Sidebar;

export class SidebarContainer extends React.Component {

  componentDidMount() {
    const token = this.props.tokenV2;
    if (token) this.props.getSavedFilters(token);
  }

  render() {
    const buckets = getBuckets(this.props.user && this.props.user.handle);
    const tokenV2 = this.props.tokenV2;

    let communityFilter = this.props.communityFilters.find(item =>
      item.communityId === this.props.selectedCommunityId);
    if (communityFilter) communityFilter = communityFilter.challengeFilter;

    return (
      <Sidebar
        {...this.props}
        buckets={buckets}
        communityFilter={communityFilter}
        deleteSavedFilter={id => this.props.deleteSavedFilter(id, tokenV2)}
        selectSavedFilter={(index) => {
          const filter = this.props.savedFilters[index].filter;
          this.props.selectSavedFilter(index);
          this.props.setFilter(filter);
          this.props.setSearchText(filter.text || '');
        }}
        updateAllSavedFilters={() =>
          this.props.updateAllSavedFilters(
            this.props.savedFilters,
            this.props.tokenV2,
          )
        }
        updateSavedFilter={filter =>
          this.props.updateSavedFilter(filter, this.props.tokenV2)}
      />
    );
  }
}

SidebarContainer.defaultProps = {
  selectedCommunityId: '',
  tokenV2: null,
  user: null,
};

SidebarContainer.propTypes = {
  communityFilters: PT.arrayOf(PT.shape({
    challengeFilter: PT.shape(),
    communityId: PT.string.isRequired,
  })).isRequired,
  deleteSavedFilter: PT.func.isRequired,
  getSavedFilters: PT.func.isRequired,
  savedFilters: PT.arrayOf(PT.shape()).isRequired,
  selectedCommunityId: PT.string,
  selectSavedFilter: PT.func.isRequired,
  setFilter: PT.func.isRequired,
  setSearchText: PT.func.isRequired,
  tokenV2: PT.string,
  updateAllSavedFilters: PT.func.isRequired,
  updateSavedFilter: PT.func.isRequired,
  user: PT.shape(),
};

function mapDispatchToProps(dispatch) {
  const a = actions.challengeListing.sidebar;
  const cla = challengeListingActions.challengeListing;
  const fpa = filterPanelActions.challengeListing.filterPanel;
  return {
    ...bindActionCreators(a, dispatch),
    setFilter: filter => dispatch(cla.setFilter(filter)),
    setSearchText: text => dispatch(fpa.setSearchText(text)),
  };
}

function mapStateToProps(state, ownProps) {
  const activeBucket = state.challengeListing.sidebar.activeBucket;
  const pending = _.keys(state.challengeListing.pendingRequests);
  return {
    ...state.challengeListing.sidebar,
    challenges: state.challengeListing.challenges,
    disabled: (activeBucket === BUCKETS.ALL) && Boolean(pending.length),
    hideTcLinksInFooter: ownProps.hideTcLinksInFooter,
    filterState: state.challengeListing.filter,
    isAuth: Boolean(state.auth.user),
    communityFilters: [{ communityId: '', communityName: 'All' }].concat(state.tcCommunities.list),
    selectedCommunityId: state.challengeListing.selectedCommunityId,
    tokenV2: state.auth.tokenV2,
    user: state.auth.user,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarContainer);
