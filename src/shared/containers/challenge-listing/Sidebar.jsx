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

/**
 * Checks for errors in saved filters
 * @param {Array} savedFilters
 * @param {Array} communityFilters
 * @return {Array} cloned savedFilters with errors set if any detected
 */
function checkFilterErrors(savedFilters, communityFilters) {
  const communityIds = _.keyBy(communityFilters, f => f.communityId);

  const savedFiltersClone = _.clone(savedFilters);
  savedFilters.forEach((f, index) => {
    if (f.filter.communityId && !communityIds[f.filter.communityId]) {
      savedFiltersClone[index] = {
        ...f,
        filterError: `Filter uses unknown community '${f.filter.communityId}'`,
      };
    }
  });
  return savedFiltersClone;
}

export class SidebarContainer extends React.Component {
  componentDidMount() {
    const token = this.props.tokenV2;
    if (token) this.props.getSavedFilters(token);
  }

  render() {
    const {
      extraBucket,
    } = this.props;

    const buckets = getBuckets(this.props.user && this.props.user.handle);

    if (extraBucket) {
      buckets[extraBucket.name] = extraBucket;
    }

    const tokenV2 = this.props.tokenV2;
    const { communityFilters } = this.props;
    const updatedCommunityFilters = [
      {
        communityId: '',
        communityName: 'All',
        challengeFilter: {},
      },
      ...communityFilters,
    ];

    let communityFilter = updatedCommunityFilters.find(item =>
      item.communityId === this.props.selectedCommunityId);
    if (communityFilter) communityFilter = communityFilter.challengeFilter;

    const savedFilters = checkFilterErrors(this.props.savedFilters, updatedCommunityFilters);

    return (
      <Sidebar
        {...this.props}
        buckets={buckets}
        extraBucket={extraBucket}
        savedFilters={savedFilters}
        communityFilter={communityFilter}
        deleteSavedFilter={id => this.props.deleteSavedFilter(id, tokenV2)}
        selectSavedFilter={(index) => {
          const filter = this.props.savedFilters[index].filter;
          this.props.selectSavedFilter(index);
          this.props.setFilter(_.omit(filter, 'communityId'));
          this.props.setSearchText(filter.text || '');
          this.props.selectCommunity(filter.communityId || '');
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
  extraBucket: null,
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
  extraBucket: PT.shape(),
  getSavedFilters: PT.func.isRequired,
  savedFilters: PT.arrayOf(PT.shape()).isRequired,
  selectedCommunityId: PT.string,
  selectSavedFilter: PT.func.isRequired,
  setFilter: PT.func.isRequired,
  selectCommunity: PT.func.isRequired,
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
    selectCommunity: communityId => dispatch(cla.selectCommunity(communityId)),
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
    extraBucket: ownProps.extraBucket,
    hideTcLinksInFooter: ownProps.hideTcLinksInFooter,
    filterState: state.challengeListing.filter,
    isAuth: Boolean(state.auth.user),
    communityFilters: state.tcCommunities.list.data,
    selectedCommunityId: state.challengeListing.selectedCommunityId,
    tokenV2: state.auth.tokenV2,
    user: state.auth.user,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarContainer);
