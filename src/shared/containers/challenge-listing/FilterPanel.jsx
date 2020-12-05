/**
 * Container for the filters panel.
 */

import actions from 'actions/challenge-listing/filter-panel';
import challengeListingActions from 'actions/challenge-listing';
import sidebarActions from 'actions/challenge-listing/sidebar';
import communityActions from 'actions/tc-communities';
import shortId from 'shortid';
import FilterPanel from 'components/challenge-listing/Filters/FiltersPanel';
import PT from 'prop-types';
import React from 'react';
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
      getKeywords,
      getTypes,
      loadingKeywords,
      loadingTypes,
      setFilterState,
      // filterState,
      communityList,
      getCommunityList,
      auth,
      setPast,
      setSearchText,
    } = this.props;

    if (communityList && !communityList.loadingUuid
    && (Date.now() - communityList.timestamp > 5 * MIN)) {
      getCommunityList(auth);
    }
    if (!loadingTypes) getTypes();
    if (!loadingKeywords) getKeywords();

    const query = qs.parse(window.location.search.slice(1));

    if (query.tracks) {
      _.forEach(query.tracks, (value, key) => {
        query.tracks[key] = value === 'true';
      });
    }

    if (query.bucket) {
      if (query.bucket === BUCKETS.ALL_PAST || query.bucket === BUCKETS.MY_PAST) {
        setPast(true);
        query.status = 'Completed';
      }

      if (query.bucket === BUCKETS.REVIEW_OPPORTUNITIES) {
        this.initialDefaultChallengeTypes = true;
      }

      if (!(query.bucket === BUCKETS.ALL_PAST || query.bucket === BUCKETS.MY_PAST)) {
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

    if (query.name) {
      setSearchText(query.name);
    }

    if (!_.isEmpty(query)) {
      setFilterState(query);
    }
  }

  componentDidUpdate() {
    const {
      filterState,
      setFilterState,
      validTypes,
    } = this.props;

    if (validTypes.length && !this.initialDefaultChallengeTypes) {
      this.initialDefaultChallengeTypes = true;
      setFilterState({
        ..._.clone(filterState),
        types: validTypes.map(item => item.abbreviation),
      });
    }
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
        setFilterState={(state) => {
          setFilterState(state);
        }}
        isReviewOpportunitiesBucket={isForReviewOpportunities}
        activeBucket={activeBucket}
        expanded={expanded}
        setExpanded={setExpanded}
        hidden={hidden}
        onClose={onClose}
      />
    );
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
  getKeywords: PT.func.isRequired,
  getTypes: PT.func.isRequired,
  loadingKeywords: PT.bool.isRequired,
  loadingTypes: PT.bool.isRequired,
  setFilterState: PT.func.isRequired,
  auth: PT.shape().isRequired,
  tokenV2: PT.string,
  expanded: PT.bool.isRequired,
  setExpanded: PT.func.isRequired,
  hidden: PT.bool,
  onClose: PT.func.isRequired,
  validTypes: PT.arrayOf(PT.shape()).isRequired,
  past: PT.bool.isRequired,
  setPast: PT.func.isRequired,
  setSearchText: PT.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  const a = actions.challengeListing.filterPanel;
  const cla = challengeListingActions.challengeListing;
  const sba = sidebarActions.challengeListing.sidebar;
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
    getKeywords: () => {
      dispatch(cla.getChallengeTagsInit());
      dispatch(cla.getChallengeTagsDone());
    },
    selectCommunity: id => dispatch(cla.selectCommunity(id)),
    setFilterState: s => dispatch(cla.setFilter(s)),
    onClose: () => dispatch(a.setExpanded(false)),
    setPast: isPast => dispatch(sba.setPast(isPast)),
  };
}

function mapStateToProps(state, ownProps) {
  const cl = state.challengeListing;
  const tc = state.tcCommunities;
  const sb = state.challengeListing.sidebar;
  return {
    ...ownProps,
    ...state.challengeListing.filterPanel,
    activeBucket: cl.sidebar.activeBucket,
    communityFilters: tc.list.data,
    communityList: tc.list,
    defaultCommunityId: ownProps.defaultCommunityId,
    filterState: cl.filter,
    loadingKeywords: cl.loadingChallengeTags,
    loadingTypes: cl.loadingChallengeTypes,
    validKeywords: cl.challengeTags,
    validTypes: cl.challengeTypes,
    selectedCommunityId: cl.selectedCommunityId,
    auth: state.auth,
    tokenV2: state.auth.tokenV2,
    past: sb.past,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Container);
