/**
 * Container for the Sidebar.
 */

// import _ from 'lodash';
import actions from 'actions/challenge-listing/sidebar';
import challengeListingActions from 'actions/challenge-listing';
// import { config } from 'topcoder-react-utils';
// import filterPanelActions from 'actions/challenge-listing/filter-panel';
import PT from 'prop-types';
import React from 'react';
import Sidebar from 'components/challenge-listing/Sidebar';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import { BUCKETS, getBuckets } from 'utils/challenge-listing/buckets';
// import { updateChallengeType } from 'utils/challenge';

export const SidebarPureComponent = Sidebar;

/**
 * Checks for errors in saved filters
 * @param {Array} savedFilters
 * @param {Array} communityFilters
 * @return {Array} cloned savedFilters with errors set if any detected
 */
// function checkFilterErrors(savedFilters, communityFilters) {
//   const communityIds = _.keyBy(communityFilters, f => f.communityId);

//   const savedFiltersClone = _.clone(savedFilters);
//   savedFilters.forEach((f, index) => {
//     if (f.filter.communityId && !communityIds[f.filter.communityId]) {
//       savedFiltersClone[index] = {
//         ...f,
//         filterError: `Filter uses unknown community '${f.filter.communityId}'`,
//       };
//     }
//   });
//   return savedFiltersClone;
// }

export class SidebarContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      previousBucketOfActiveTab: null,
      previousBucketOfPastChallengesTab: null,
    };
  }

  componentDidMount() {
    // const { tokenV2, getSavedFilters } = this.props;
    // const token = tokenV2;
    // if (config.USER_SETTINGS && token) getSavedFilters(token);
  }

  render() {
    // const {
    // activeBucket,
    // communityFilters,
    // deleteSavedFilter,
    // extraBucket,
    // savedFilters: origSavedFilters,
    // selectCommunity,
    // selectSavedFilter,
    // selectedCommunityId,
    // setFilter,
    // tokenV2,
    // updateAllSavedFilters,
    // updateSavedFilter,
    // userChallenges,
    // } = this.props;

    const {
      previousBucketOfActiveTab,
      previousBucketOfPastChallengesTab,
    } = this.state;

    // const buckets = getBuckets(userChallenges);

    // if (extraBucket) {
    //   buckets[extraBucket.name] = extraBucket;
    // }

    // const updatedCommunityFilters = [
    //   {
    //     communityId: '',
    //     communityName: 'All',
    //     challengeFilter: {},
    //   },
    //   ...communityFilters,
    // ];

    // let communityFilter = updatedCommunityFilters.find(
    //   item => item.communityId === selectedCommunityId,
    // );
    // if (communityFilter) communityFilter = communityFilter.challengeFilter;

    // const savedFilters = checkFilterErrors(origSavedFilters, updatedCommunityFilters);

    return (
      <Sidebar
        {...this.props}
        // bucket={activeBucket}
        // extraBucket={extraBucket}
        // savedFilters={savedFilters}
        // communityFilter={communityFilter}
        // deleteSavedFilter={id => deleteSavedFilter(id, tokenV2)}
        // selectSavedFilter={(index) => {
        //   const { filter } = origSavedFilters[index];
        //   selectSavedFilter(index);
        //   setFilter(_.omit(filter, 'communityId'));
        //   selectCommunity(filter.communityId || '');
        // }}
        // updateAllSavedFilters={() => updateAllSavedFilters(
        //   origSavedFilters,
        //   tokenV2,
        // )
        // }
        // updateSavedFilter={filter => updateSavedFilter(filter, tokenV2)}
        previousBucketOfActiveTab={previousBucketOfActiveTab}
        previousBucketOfPastChallengesTab={previousBucketOfPastChallengesTab}
        setPreviousBucketOfActiveTab={(bucket) => {
          this.setState({ previousBucketOfActiveTab: bucket });
        }}
        setPreviousBucketOfPastChallengesTab={(bucket) => {
          this.setState({ previousBucketOfPastChallengesTab: bucket });
        }}
      />
    );
  }
}

SidebarContainer.defaultProps = {
  // extraBucket: null,
  // selectedCommunityId: '',
  // tokenV2: null,
  // user: null,
  // userChallenges: [],
  expanding: false,
};

SidebarContainer.propTypes = {
  activeBucket: PT.string.isRequired,
  // communityFilters: PT.arrayOf(PT.shape({
  //   challengeFilter: PT.shape(),
  //   communityId: PT.string.isRequired,
  // })).isRequired,
  // deleteSavedFilter: PT.func.isRequired,
  // extraBucket: PT.shape(),
  // getSavedFilters: PT.func.isRequired,
  // savedFilters: PT.arrayOf(PT.shape()).isRequired,
  // selectedCommunityId: PT.string,
  // selectSavedFilter: PT.func.isRequired,
  setFilter: PT.func.isRequired,
  // selectCommunity: PT.func.isRequired,
  // tokenV2: PT.string,
  // updateAllSavedFilters: PT.func.isRequired,
  // updateSavedFilter: PT.func.isRequired,
  // user: PT.shape(),
  // userChallenges: PT.arrayOf(PT.string),
  expanding: PT.bool,
};

function mapDispatchToProps(dispatch) {
  const a = actions.challengeListing.sidebar;
  const cla = challengeListingActions.challengeListing;
  // const fpa = filterPanelActions.challengeListing.filterPanel;
  return {
    ...bindActionCreators(a, dispatch),
    setFilter: filter => dispatch(cla.setFilter(filter)),
    // selectCommunity: communityId => dispatch(cla.selectCommunity(communityId)),
  };
}

function mapStateToProps(state) {
  // const { activeBucket } = state.challengeListing.sidebar;
  // const pending = _.keys(state.challengeListing.pendingRequests);
  // updateChallengeType(
  //   state.challengeListing.challenges, state.challengeListing.challengeTypesMap,
  // );
  const sb = state.challengeListing.sidebar;
  return {
    activeBucket: state.challengeListing.sidebar.activeBucket,
    // ...state.challengeListing.sidebar,
    // challenges: state.challengeListing.challenges,
    // disabled: (activeBucket === BUCKETS.ALL) && Boolean(pending.length),
    // extraBucket: ownProps.extraBucket,
    // hideTcLinksInFooter: ownProps.hideTcLinksInFooter,
    filterState: state.challengeListing.filter,
    isAuth: Boolean(state.auth.user),
    auth: state.auth,
    // communityFilters: state.tcCommunities.list.data,
    // selectedCommunityId: state.challengeListing.selectedCommunityId,
    // tokenV2: state.auth.tokenV2,
    // user: state.auth.user,
    // userChallenges: state.challengeListing.userChallenges,
    expanding: sb.expanding,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarContainer);
