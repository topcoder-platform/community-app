/**
 * Container for the filters panel.
 */

import actions from 'actions/challenge-listing/filter-panel';
import challengeListingActions from 'actions/challenge-listing';
import communityActions from 'actions/tc-communities';
import sidebarActions from 'actions/challenge-listing/sidebar';
import shortId from 'shortid';
import FilterPanel from 'components/challenge-listing/Filters/FiltersPanel';
import PT from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { BUCKETS, isReviewOpportunitiesBucket } from 'utils/challenge-listing/buckets';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import qs from 'qs';
import _ from 'lodash';
import { createStaticRanges } from 'utils/challenge-listing/date-range';

const MIN = 60 * 1000;


export class Container extends React.Component {
  constructor(props) {
    super(props);
    this.initialDefaultChallengeTypes = false;
  }

  componentDidMount() {
    const {
      getTypes,
      loadingTypes,
      setFilterState,
      // filterState,
      communityList,
      getCommunityList,
      auth,
      setSearchText,
    } = this.props;

    if (communityList && !communityList.loadingUuid
    && (Date.now() - communityList.timestamp > 5 * MIN)) {
      getCommunityList(auth);
    }
    if (!loadingTypes) getTypes();

    const query = qs.parse(window.location.search.slice(1));

    if (query.tracks) {
      _.forEach(query.tracks, (value, key) => {
        query.tracks[key] = value === 'true';
      });
    }

    if (query.bucket) {
      if (query.bucket !== BUCKETS.ALL_PAST && query.bucket !== BUCKETS.MY_PAST) {
        delete query.endDateStart;
        delete query.startDateEnd;
      }
      delete query.bucket;
    }

    if (query.endDateStart || query.startDateEnd) {
      let customDate = true;
      createStaticRanges().forEach((range) => {
        if (!range.isCustom && range.isSelected({
          startDate: query.endDateStart,
          endDate: query.startDateEnd,
        })) {
          customDate = false;
        }
      });
      query.customDate = customDate;
    }

    if (query.types && query.types.length) {
      this.initialDefaultChallengeTypes = true;
    }

    if (query.search) {
      setSearchText(query.search);
    }

    if (!_.isEmpty(query)) {
      setFilterState(query);
    }

    this.outlet = document.createElement('div');
    document.body.appendChild(this.outlet);
  }

  componentDidUpdate() {
    const {
      filterState,
      setFilterState,
      validTypes,
    } = this.props;

    if (!filterState.types.length && validTypes.length && !this.initialDefaultChallengeTypes) {
      setFilterState({
        ..._.clone(filterState),
        types: validTypes.map(item => item.abbreviation),
      });
      this.initialDefaultChallengeTypes = true;
    }
  }

  componentWillUnmount() {
    this.outlet.parentElement.removeChild(this.outlet);
  }

  render() {
    const {
      activeBucket,
      communityFilters,
      setFilterState,
      expanded,
      setExpanded,
      hidden,
      onClose,
      setSort,
      selectBucket,
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

    const filterPanel = (
      <FilterPanel
        {...this.props}
        communityFilters={communityFilters2}
        setFilterState={(state) => {
          setFilterState(state);
        }}
        isReviewOpportunitiesBucket={isForReviewOpportunities}
        activeBucket={activeBucket}
        expanded={expanded}
        setExpanded={setExpanded}
        hidden={hidden}
        onClose={onClose}
        setSort={setSort}
        selectBucket={selectBucket}
      />
    );

    if (hidden) {
      return expanded ? ReactDOM.createPortal(filterPanel, this.outlet) : filterPanel;
    }

    return filterPanel;
  }
}

Container.defaultProps = {
  tokenV2: '',
  hidden: false,
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
  selectedCommunityId: PT.string.isRequired,
  getTypes: PT.func.isRequired,
  loadingTypes: PT.bool.isRequired,
  setFilterState: PT.func.isRequired,
  auth: PT.shape().isRequired,
  tokenV2: PT.string,
  expanded: PT.bool.isRequired,
  setExpanded: PT.func.isRequired,
  hidden: PT.bool,
  onClose: PT.func.isRequired,
  validTypes: PT.arrayOf(PT.shape()).isRequired,
  setSearchText: PT.func.isRequired,
  setSort: PT.func.isRequired,
  selectBucket: PT.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  const a = actions.challengeListing.filterPanel;
  const cla = challengeListingActions.challengeListing;
  const sa = sidebarActions.challengeListing.sidebar;
  return {
    ...bindActionCreators(a, dispatch),
    getTypes: () => {
      dispatch(cla.getChallengeTypesInit());
      dispatch(cla.getChallengeTypesDone());
    },
    getCommunityList: (auth) => {
      const uuid = shortId();
      dispatch(communityActions.tcCommunity.getListInit(uuid));
      dispatch(communityActions.tcCommunity.getListDone(uuid, auth));
    },
    selectCommunity: id => dispatch(cla.selectCommunity(id)),
    setFilterState: s => dispatch(cla.setFilter(s)),
    onClose: () => dispatch(a.setExpanded(false)),
    setSort: (bucket, sort) => dispatch(cla.setSort(bucket, sort)),
    selectBucket: (bucket, expanding) => dispatch(sa.selectBucket(bucket, expanding)),
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
    loadingTypes: cl.loadingChallengeTypes,
    validTypes: cl.challengeTypes,
    selectedCommunityId: cl.selectedCommunityId,
    auth: state.auth,
    tokenV2: state.auth.tokenV2,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Container);
