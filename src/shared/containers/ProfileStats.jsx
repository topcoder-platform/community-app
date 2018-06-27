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
    } = this.props;
    const trackAndSubTrack = getQueryParamsQuery(location);
    loadStats(handleParam);
    if (shouldShowGraph(trackAndSubTrack)) {
      loadStatsHistoryAndDistribution(
        handleParam,
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
    } = nextProps;
    const {
      handleParam,
      location,
    } = this.props;

    const nextQueryParams = getQueryParamsQuery(nextLocation);
    const trackAndSubTrack = getQueryParamsQuery(location);

    if (nextHandleParam !== handleParam) {
      loadStats(nextHandleParam);
      if (
        nextQueryParams.track !== trackAndSubTrack.track
        || nextQueryParams.subTrack !== trackAndSubTrack.subTrack
      ) {
        if (shouldShowGraph(nextQueryParams)
          && !nextQueryParams.tab) {
          loadStatsHistoryAndDistribution(
            nextHandleParam,
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
};

ProfileStatsContainer.propTypes = {
  location: PT.shape().isRequired,
  loadingError: PT.bool,
  loadStats: PT.func.isRequired,
  loadStatsHistoryAndDistribution: PT.func.isRequired,
  handleParam: PT.string.isRequired,
  statsHistory: PT.shape(),
  statsDistribution: PT.shape(),
  stats: PT.shape(),
  info: PT.shape(),
  isLoading: PT.bool.isRequired,
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
  });
};

function mapDispatchToProps(dispatch) {
  const a = actions.members;
  const pa = actions.profile;

  return {
    loadStats: (handle) => {
      dispatch(a.getStatsInit(handle));
      dispatch(a.getStatsDone(handle));
      dispatch(pa.getInfoInit(handle));
      dispatch(pa.getInfoDone(handle));
      dispatch(a.getActiveChallengesInit(handle));
      dispatch(a.getActiveChallengesDone(handle));
    },
    loadStatsHistoryAndDistribution: (handle, track, subTrack) => {
      dispatch(a.getStatsHistoryInit(handle));
      dispatch(a.getStatsHistoryDone(handle));
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
