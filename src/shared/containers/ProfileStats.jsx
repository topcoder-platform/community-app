/**
 * Connects the Redux store to the Profile display components.
 */
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { actions } from 'topcoder-react-lib';
import Error404 from 'components/Error404';
import LoadingIndicator from 'components/LoadingIndicator';
import ProfileStatsPage from 'components/ProfilePage/Stats';
import { shouldShowGraph, isValidTrack } from 'utils/memberStats';
import _ from 'lodash';
import qs from 'qs';

const getQueryParamsQuery = location => (
  location.search ? qs.parse(location.search.slice(1)) : {}
);

class ProfileStatsContainer extends React.Component {
  componentDidMount() {
    const {
      handleParam,
      location,
      loadStats,
      loadStatsHistoryAndDistribution,
      meta,
    } = this.props;

    const trackAndSubTrack = getQueryParamsQuery(location);
    loadStats(handleParam, _.join(_.get(meta, 'groupIds', [])));
    if (shouldShowGraph(trackAndSubTrack)) {
      loadStatsHistoryAndDistribution(
        handleParam,
        _.join(_.get(meta, 'groupIds', [])),
        trackAndSubTrack.track,
        trackAndSubTrack.subTrack,
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      handleParam: nextHandleParam,
      location: nextLocation,
      loadStats,
      loadStatsHistoryAndDistribution,
      meta,
    } = nextProps;
    const {
      handleParam,
      location,
    } = this.props;

    const nextQueryParams = getQueryParamsQuery(nextLocation);
    const trackAndSubTrack = getQueryParamsQuery(location);

    if (nextHandleParam !== handleParam) {
      loadStats(nextHandleParam, _.join(_.get(meta, 'groupIds', [])));
      if (
        nextQueryParams.track !== trackAndSubTrack.track
        || nextQueryParams.subTrack !== trackAndSubTrack.subTrack
      ) {
        if (shouldShowGraph(nextQueryParams)
          && !nextQueryParams.tab) {
          loadStatsHistoryAndDistribution(
            nextHandleParam,
            _.join(_.get(meta, 'groupIds', [])),
            nextQueryParams.track,
            nextQueryParams.subTrack,
          );
        }
      }
    }
  }

  render() {
    const {
      loadingError,
      location,
      isLoading,
    } = this.props;

    const { track, subTrack, tab } = getQueryParamsQuery(location);
    if (loadingError || !isValidTrack(track, subTrack)) {
      return <Error404 />;
    }

    return isLoading
      ? <LoadingIndicator />
      : (
        <ProfileStatsPage
          {...this.props}
          track={track}
          subTrack={subTrack}
          tab={tab}
        />
      );
  }
}

ProfileStatsContainer.defaultProps = {
  loadingError: false,
  statsHistory: null,
  statsDistribution: null,
  stats: null,
  info: null,
  achievements: null,
  meta: null,
};

ProfileStatsContainer.propTypes = {
  location: PT.shape().isRequired,
  loadingError: PT.bool,
  loadStats: PT.func.isRequired,
  loadStatsHistoryAndDistribution: PT.func.isRequired,
  handleParam: PT.string.isRequired,
  statsHistory: PT.arrayOf(PT.shape()),
  statsDistribution: PT.shape(),
  stats: PT.arrayOf(PT.shape()),
  info: PT.shape(),
  achievements: PT.arrayOf(PT.shape()),
  isLoading: PT.bool.isRequired,
  meta: PT.shape(),
};

const mapStateToProps = (state, ownProps) => {
  const handleParam = ownProps.match.params.handle;
  const obj = _.get(state.members, handleParam, {});
  return ({
    handleParam,
    loadingError: state.members.loadingError,
    isLoading: !state.profile.info
      || !_.get(obj, 'stats.data')
      || ('loadingUuid' in _.get(obj, 'statsHistory', {}))
      || ('loadingUuid' in _.get(obj, 'statsDistribution', {})),
    stats: _.get(obj, 'stats.data'),
    statsHistory: _.get(obj, 'statsHistory.data'),
    statsDistribution: _.get(obj, 'statsDistribution.data'),
    activeChallengesCount: _.get(obj, 'activeChallengesCount'),
    info: state.profile.info,
    meta: ownProps.meta,
    achievements: state.profile.achievements,
  });
};

function mapDispatchToProps(dispatch) {
  const a = actions.members;
  const pa = actions.profile;

  return {
    loadStats: (handle, groupIds) => {
      dispatch(a.getStatsInit(handle));
      dispatch(a.getStatsDone(handle, groupIds));
      dispatch(pa.getInfoInit(handle));
      dispatch(pa.getInfoDone(handle));
      dispatch(a.getActiveChallengesInit(handle));
      dispatch(a.getActiveChallengesDone(handle));
    },
    loadStatsHistoryAndDistribution: (handle, groupIds, track, subTrack) => {
      dispatch(a.getStatsHistoryInit(handle));
      dispatch(a.getStatsHistoryDone(handle, groupIds));
      dispatch(a.getStatsDistributionInit(handle));
      dispatch(a.getStatsDistributionDone(handle, track, subTrack));
    },
  };
}

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileStatsContainer);

export default Container;
