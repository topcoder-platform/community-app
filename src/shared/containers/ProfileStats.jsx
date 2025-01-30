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
import { shouldShowGraph, isValidTrack, loadPublicStatsOnly } from 'utils/memberStats';
import MetaTags from 'components/MetaTags';
import _ from 'lodash';
import shortId from 'shortid';

class ProfileStatsContainer extends React.Component {
  componentDidMount() {
    const {
      handleParam,
      track,
      subTrack,
      loadStats,
      loadStatsHistoryAndDistribution,
      meta,
      auth,
    } = this.props;

    loadStats(handleParam, _.join(loadPublicStatsOnly(meta) ? undefined : _.get(meta, 'groupIds', [])), auth.tokenV3);
    if (shouldShowGraph({ track, subTrack })) {
      loadStatsHistoryAndDistribution(
        handleParam,
        _.join(loadPublicStatsOnly(meta) ? undefined : _.get(meta, 'groupIds', [])),
        track,
        subTrack,
        auth.tokenV3,
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      handleParam: nextHandleParam,
      track: nextTrack,
      subTrack: nextSubTrack,
      tab: nextTab,
      loadStats,
      loadStatsHistoryAndDistribution,
      meta,
      auth,
    } = nextProps;
    const {
      handleParam,
      track,
      subTrack,
    } = this.props;

    if (nextHandleParam !== handleParam) {
      loadStats(nextHandleParam, _.join(loadPublicStatsOnly(meta) ? undefined : _.get(meta, 'groupIds', [])), auth.tokenV3);
    }
    if (
      nextTrack !== track
      || nextSubTrack !== subTrack
    ) {
      if (shouldShowGraph({ track: nextTrack, subTrack: nextSubTrack })
        && !nextTab) {
        loadStatsHistoryAndDistribution(
          nextHandleParam,
          _.join(loadPublicStatsOnly(meta) ? undefined : _.get(meta, 'groupIds', [])),
          nextTrack,
          nextSubTrack,
          auth.tokenV3,
        );
      }
    }
  }

  render() {
    const {
      loadingError,
      isLoading,
      handleParam,
      track,
      subTrack,
    } = this.props;

    if (loadingError || !isValidTrack(track, subTrack)) {
      return <Error404 />;
    }
    const title = `${handleParam} | Community Profile | Topcoder`;
    const description = `Meet Topcoder member ${handleParam} and view their skills and development and design activity. You can also see wins and tenure with Topcoder.`;

    return (
      <React.Fragment>
        <MetaTags
          description={description}
          title={title}
        />
        {
          isLoading ? <LoadingIndicator />
            : (
              <ProfileStatsPage
                {...this.props}
              />
            )
        }
      </React.Fragment>
    );
  }
}

ProfileStatsContainer.defaultProps = {
  loadingError: false,
  statsHistory: null,
  statsDistribution: null,
  stats: null,
  info: null,
  meta: null,
  auth: {},
  isAlreadyLoadChallenge: {
    current: false,
  },
};

ProfileStatsContainer.propTypes = {
  track: PT.string.isRequired,
  subTrack: PT.string.isRequired,
  tab: PT.string.isRequired,
  setTab: PT.func.isRequired,
  loadingError: PT.bool,
  loadStats: PT.func.isRequired,
  loadStatsHistoryAndDistribution: PT.func.isRequired,
  handleParam: PT.string.isRequired,
  statsHistory: PT.arrayOf(PT.shape()),
  statsDistribution: PT.shape(),
  stats: PT.arrayOf(PT.shape()),
  info: PT.shape(),
  isLoading: PT.bool.isRequired,
  meta: PT.shape(),
  auth: PT.shape(),
  isAlreadyLoadChallenge: PT.shape({
    current: PT.bool,
  }),
};

const mapStateToProps = (state, ownProps) => {
  const { handleParam } = ownProps;
  const obj = _.get(state.members, handleParam, {});
  return ({
    loadingError: state.members.loadingError,
    isLoading: !state.profile.info
      || !_.get(obj, 'stats.data')
      || ('loadingUuid' in _.get(obj, 'statsHistory', {}))
      || ('loadingUuid' in _.get(obj, 'statsDistribution', {})),
    stats: _.get(obj, 'stats.data'),
    statsHistory: _.get(obj, 'statsHistory.data'),
    statsDistribution: _.get(obj, 'statsDistribution.data'),
    info: state.profile.info,
    auth: {
      ...state.auth,
    },
  });
};

function mapDispatchToProps(dispatch) {
  const a = actions.members;
  const pa = actions.profile;

  return {
    loadStats: (handle, groupIds, tokenV3) => {
      const uuid = shortId();
      dispatch(a.getStatsInit(handle, uuid));
      dispatch(a.getStatsDone(handle, groupIds, uuid, tokenV3));
      dispatch(pa.getInfoInit(handle));
      dispatch(pa.getInfoDone(handle));
      dispatch(a.getActiveChallengesInit(handle));
      dispatch(a.getActiveChallengesDone(handle));
    },
    loadStatsHistoryAndDistribution: (handle, groupIds, track, subTrack, tokenV3) => {
      const uuid = shortId();
      dispatch(a.getStatsHistoryInit(handle, uuid));
      dispatch(a.getStatsHistoryDone(handle, groupIds, uuid, tokenV3));
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
