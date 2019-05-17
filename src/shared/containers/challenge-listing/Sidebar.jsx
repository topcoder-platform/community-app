/**
 * Container for the Sidebar.
 */

import _ from 'lodash';
import sactions from 'actions/challenge-listing/sidebar';
import { actions, challenge as challengeUtil } from 'topcoder-react-lib';
import { config } from 'topcoder-react-utils';
import filterPanelActions from 'actions/challenge-listing/filter-panel';
import PT from 'prop-types';
import React from 'react';
import Sidebar from 'components/challenge-listing/Sidebar';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

export const SidebarPureComponent = Sidebar;

const { BUCKETS, getBuckets } = challengeUtil.buckets;

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
    const { tokenV2, getSavedFilters } = this.props;
    const token = tokenV2;
    if (config.USER_SETTINGS && token) getSavedFilters(token);
  }

  render() {
    const {
      communityFilters,
      deleteSavedFilter,
      extraBucket,
      savedFilters: origSavedFilters,
      selectCommunity,
      selectSavedFilter,
      selectedCommunityId,
      setFilter,
      setSearchText,
      tokenV2,
      updateAllSavedFilters,
      updateSavedFilter,
      user,
    } = this.props;

    const buckets = getBuckets(user && user.handle);

    if (extraBucket) {
      buckets[extraBucket.name] = extraBucket;
    }

    const updatedCommunityFilters = [
      {
        communityId: '',
        communityName: 'All',
        challengeFilter: {},
      },
      ...communityFilters,
    ];

    let communityFilter = updatedCommunityFilters.find(
      item => item.communityId === selectedCommunityId,
    );
    if (communityFilter) communityFilter = communityFilter.challengeFilter;

    const savedFilters = checkFilterErrors(origSavedFilters, updatedCommunityFilters);

    return (
      <Sidebar
        {...this.props}
        buckets={buckets}
        extraBucket={extraBucket}
        savedFilters={savedFilters}
        communityFilter={communityFilter}
        deleteSavedFilter={id => deleteSavedFilter(id, tokenV2)}
        selectSavedFilter={(index) => {
          const { filter } = origSavedFilters[index];
          selectSavedFilter(index);
          setFilter(_.omit(filter, 'communityId'));
          setSearchText(filter.text || '');
          selectCommunity(filter.communityId || '');
        }}
        updateAllSavedFilters={() => updateAllSavedFilters(
          origSavedFilters,
          tokenV2,
        )
        }
        updateSavedFilter={filter => updateSavedFilter(filter, tokenV2)}
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
  const a = sactions.challengeListingFrontend.sidebar;
  const cla = actions.challengeListing;
  const fpa = filterPanelActions.challengeListingFrontend.filterPanel;
  return {
    ...bindActionCreators(a, dispatch),
    setFilter: filter => dispatch(cla.setFilter(filter)),
    selectCommunity: communityId => dispatch(cla.selectCommunity(communityId)),
    setSearchText: text => dispatch(fpa.setSearchText(text)),
  };
}

function mapStateToProps(state, ownProps) {
  const { activeBucket } = state.challengeListingFrontend.sidebar;
  const pending = _.keys(state.challengeListing.pendingRequests);
  return {
    ...state.challengeListingFrontend.sidebar,
    challenges: _.has(state.challengeListing.challenges, BUCKETS.ALL)
      ? state.challengeListing.challenges[BUCKETS.ALL] : [],
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
