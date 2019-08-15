/**
 * Connects the Redux store to the Profile display components.
 */
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';

import { actions } from 'topcoder-react-lib';
import Error404 from 'components/Error404';
import LoadingIndicator from 'components/LoadingIndicator';
import ProfilePage from 'components/ProfilePage';

class ProfileContainer extends React.Component {
  componentDidMount() {
    const {
      handleParam,
      profileForHandle,
      loadProfile,
      communityGroupIds,
    } = this.props;

    if (handleParam !== profileForHandle) {
      loadProfile(handleParam, communityGroupIds);
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      handleParam,
      profileForHandle,
      loadProfile,
      communityGroupIds,
    } = nextProps;

    if (handleParam !== profileForHandle) {
      loadProfile(handleParam, communityGroupIds);
    }
  }

  render() {
    const {
      info,
      loadingError,
      stats,
    } = this.props;

    if (loadingError) {
      return <Error404 />;
    }

    if (info && info.tracks && info.tracks.length > 0) {
      const trackRankings = {
        COPILOT: 0,
        DATA_SCIENCE: 1,
        DESIGN: 2,
        DEVELOP: 3,
      };
      info.tracks.sort((track1, track2) => {
        const track1Ranking = trackRankings[track1];
        const track2Ranking = trackRankings[track2];
        return track2Ranking - track1Ranking;
      });
    }

    return (info && stats)
      ? (
        <ProfilePage
          {...this.props}
        />
      ) : <LoadingIndicator />;
  }
}

ProfileContainer.defaultProps = {
  achievements: null,
  copilot: false,
  country: '',
  externalAccounts: null,
  externalLinks: null,
  info: null,
  profileForHandle: '',
  skills: null,
  stats: null,
  communityGroupIds: [],
  baseUrl: '',
};

ProfileContainer.propTypes = {
  achievements: PT.arrayOf(PT.shape()),
  copilot: PT.bool,
  country: PT.string,
  externalAccounts: PT.shape(),
  externalLinks: PT.arrayOf(PT.shape()),
  handleParam: PT.string.isRequired,
  info: PT.shape(),
  loadingError: PT.bool.isRequired,
  loadProfile: PT.func.isRequired,
  profileForHandle: PT.string,
  skills: PT.shape(),
  stats: PT.shape(),
  lookupData: PT.shape().isRequired,
  communityGroupIds: PT.arrayOf(PT.string),
  baseUrl: PT.string,
};

const mapStateToProps = (state, ownProps) => {
  let { profile: { stats } } = state;
  if (stats && stats instanceof Array && stats.length === 1) {
    const firstStat = stats[0];
    stats = firstStat;
  }

  return ({
    achievements: state.profile.achievements,
    copilot: state.profile.copilot,
    country: state.profile.country,
    externalAccounts: state.profile.externalAccounts,
    externalLinks: state.profile.externalLinks,
    handleParam: ownProps.match.params.handle,
    info: state.profile.info,
    loadingError: state.profile.loadingError,
    profileForHandle: state.profile.profileForHandle,
    skills: state.profile.skills,
    stats,
    lookupData: state.lookup,
  });
};

function mapDispatchToProps(dispatch) {
  const a = actions.profile;
  const lookupActions = actions.lookup;
  return {
    loadProfile: (handle, communityGroupIds) => {
      dispatch(a.clearProfile());
      dispatch(a.loadProfile(handle));
      dispatch(a.getAchievementsInit());
      dispatch(a.getExternalAccountsInit());
      dispatch(a.getExternalLinksInit());
      dispatch(a.getInfoInit());
      dispatch(a.getSkillsInit());
      dispatch(a.getStatsInit());
      dispatch(lookupActions.getCountriesInit());
      dispatch(a.getAchievementsV3Done(handle));
      dispatch(a.getExternalAccountsDone(handle));
      dispatch(a.getExternalLinksDone(handle));
      dispatch(a.getInfoDone(handle));
      dispatch(a.getSkillsDone(handle));
      if (communityGroupIds.length > 0) {
        dispatch(a.getStatsDone(handle, communityGroupIds[0])); // get stats with community group id
      } else {
        dispatch(a.getStatsDone(handle));
      }
      dispatch(lookupActions.getCountriesDone());
    },
  };
}

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileContainer);

export default Container;
