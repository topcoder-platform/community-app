/**
 * Connects the Redux store to the Profile display components.
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { config } from 'topcoder-react-utils';
import { actions } from 'topcoder-react-lib';
import profileActions from 'actions/page/profile';
import shortId from 'shortid';
import MetaTags from 'components/MetaTags';
import Error404 from 'components/Error404';
import LoadingIndicator from 'components/LoadingIndicator';
import ProfilePage from 'components/ProfilePage';
import { loadPublicStatsOnly } from 'utils/memberStats';

// how many challenges to query per batch
const CHALLENGE_PER_PAGE = 36;

class ProfileContainer extends React.Component {
  componentDidMount() {
    const {
      handleParam,
      loadProfile,
      loadMarathon,
      loadCertificates,
      meta,
      auth,
      info,
    } = this.props;
    loadProfile(handleParam, _.get(meta, 'groupIds', []), auth.tokenV3, loadPublicStatsOnly(meta));

    if (info) {
      loadMarathon(handleParam, auth.tokenV3, info.userId);
      loadCertificates(info.userId);
    }

    // Redirect to the communities own profile page if
    //  - the member whose profile is being viewed is part of one of the configured communities
    //  - the user is not a topcoder user (has an email with @topcoder.com)
    const communityId = _.get(meta, 'communityId'); // null when on topcoder site
    if (auth.tokenV3 && auth.memberGroups && auth.memberGroups.length > 0 && auth.user) {
      if (auth.user.handle === handleParam) {
        _.forEach(auth.memberGroups, (memberGroup) => { /* eslint consistent-return: off */
          const profileConfig = _.find(
            config.URL.SUBDOMAIN_PROFILE_CONFIG,
            { groupId: memberGroup },
          );
          if (profileConfig && profileConfig.userProfile) {
            if (communityId === profileConfig.communityId // are we on the community page?
            // are we on topcoder page and user does not have a @topcoder.com email?
            || (communityId == null && auth.user.email.toLowerCase().indexOf('@topcoder.com') === -1)) {
              // redirect user to configured profile url
              window.location.href = profileConfig.userProfile;
              return false;
            }
          }
        });
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      handleParam,
      profileForHandle,
      loadProfile,
      loadMarathon,
      loadMemberGroups,
      loadCertificates,
      meta,
      auth,
      info,
      memberGroups,
    } = nextProps;

    const {
      info: prevInfo,
      memberGroups: prevMemberGroups,
    } = this.props;

    if (handleParam !== profileForHandle) {
      loadProfile(handleParam, _.get(meta, 'groupIds', []), auth.tokenV3, loadPublicStatsOnly(meta));
    }

    if (info && info.userId && info !== prevInfo) {
      loadMarathon(handleParam, auth.tokenV3, info.userId);
      loadCertificates(info.userId);
    }
    if (auth.tokenV3 && auth.user && auth.user.handle !== handleParam
      && info != null && info.userId != null
      && (prevInfo == null || info.userId !== prevInfo.userId)) {
      loadMemberGroups(info.userId, auth.tokenV3);
    }

    if (memberGroups && memberGroups !== prevMemberGroups) {
      _.forEach(auth.memberGroups, (memberGroup) => { /* eslint consistent-return: off */
        const profileConfig = _.find(config.URL.SUBDOMAIN_PROFILE_CONFIG, { groupId: memberGroup });
        if (profileConfig && profileConfig.userProfile
          && memberGroups.indexOf(profileConfig.groupId) === -1) {
          if (window.location.href.indexOf(profileConfig.communityName) !== -1) {
            window.location.href = `${config.URL.BASE}/members/${handleParam}`;
          }
          return false;
        }
      });
    }
  }

  render() {
    const {
      info,
      loadingError,
      handleParam,
    } = this.props;

    if (loadingError || (info && info.status !== 'ACTIVE')) {
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
    const title = `${handleParam} | Community Profile | Topcoder`;
    const description = `Meet Topcoder member ${handleParam} and view their skills and development and design activity. You can also see wins and tenure with Topcoder.`;

    const {
      copilot,
      externalAccounts,
      externalLinks,
      challenges,
      skills,
      stats,
      lookupData,
      badges,
      meta,
      tcAcademyCertifications,
      tcAcademyCourses
    } = this.props;

    return (
      <React.Fragment>
        <MetaTags
          description={description}
          title={title}
        />
        {
          info ? (
            <ProfilePage
              copilot={copilot}
              externalAccounts={externalAccounts}
              challenges={challenges}
              externalLinks={externalLinks}
              info={info}
              skills={skills}
              stats={stats}
              lookupData={lookupData}
              badges={badges}
              handleParam={handleParam}
              meta={meta}
              tcAcademyCertifications={tcAcademyCertifications}
              tcAcademyCourses={tcAcademyCourses}
            />
          ) : <LoadingIndicator />
        }
      </React.Fragment>
    );
  }
}

ProfileContainer.defaultProps = {
  copilot: false,
  challenges: null,
  externalAccounts: null,
  externalLinks: null,
  info: null,
  profileForHandle: '',
  skills: null,
  stats: null,
  meta: null,
  memberGroups: null,
  auth: {},
  badges: {},
  tcAcademyCertifications: [],
  tcAcademyCourses: [],
};

ProfileContainer.propTypes = {
  badges: PT.shape(),
  challenges: PT.arrayOf(PT.shape()),
  copilot: PT.bool,
  externalAccounts: PT.shape(),
  externalLinks: PT.arrayOf(PT.shape()),
  handleParam: PT.string.isRequired,
  info: PT.shape(),
  loadingError: PT.bool.isRequired,
  loadMarathon: PT.func.isRequired,
  loadProfile: PT.func.isRequired,
  loadMemberGroups: PT.func.isRequired,
  loadCertificates: PT.func.isRequired,
  profileForHandle: PT.string,
  skills: PT.shape(),
  stats: PT.arrayOf(PT.shape()),
  memberGroups: PT.arrayOf(PT.string),
  lookupData: PT.shape().isRequired,
  meta: PT.shape(),
  auth: PT.shape(),
  tcAcademyCertifications: PT.arrayOf(PT.shape()),
  tcAcademyCourses: PT.arrayOf(PT.shape()),
};

const mapStateToProps = (state, ownProps) => ({
  challenges: state.members[ownProps.match.params.handle]
    ? state.members[ownProps.match.params.handle].userMarathons : null,
  copilot: state.profile.copilot,
  externalAccounts: state.profile.externalAccounts,
  externalLinks: state.profile.externalLinks,
  handleParam: ownProps.match.params.handle,
  meta: ownProps.meta,
  info: state.profile.info,
  loadingError: state.profile.loadingError,
  profileForHandle: state.profile.profileForHandle,
  skills: state.profile.skills,
  stats: state.profile.stats,
  memberGroups: state.groups.memberGroups,
  lookupData: state.lookup,
  badges: state.page.profile[ownProps.match.params.handle]
    ? state.page.profile[ownProps.match.params.handle].badges : {},
  tcAcademyCertifications: _.get(state.tcAcademy, 'certifications.enrollments', []),
  tcAcademyCourses: Array.isArray(state.tcAcademy.certifications)
    ? state.tcAcademy.certifications
    : _.get(state.tcAcademy, 'certifications.courses', []),
  auth: {
    ...state.auth,
  },
});

function mapDispatchToProps(dispatch) {
  const a = actions.profile;
  const lookupActions = actions.lookup;
  const memberActions = actions.members;
  const tcaActions = actions.tcAcademy;

  return {
    loadMemberGroups: (userId, tokenV3) => {
      dispatch(actions.groups.getMemberGroups(userId, tokenV3));
    },
    loadProfile: (handle, groupIds, tokenV3, showPublicStats) => {
      dispatch(a.clearProfile());
      dispatch(a.loadProfile(handle));
      dispatch(a.getAchievementsInit());
      dispatch(a.getExternalAccountsInit());
      dispatch(a.getExternalLinksInit());
      dispatch(a.getInfoInit());
      dispatch(a.getSkillsInit());
      dispatch(a.getStatsInit());
      dispatch(lookupActions.getCountriesInit());
      dispatch(profileActions.page.profile.getGamificationBadgesInit(handle));
      dispatch(a.getAchievementsV3Done(handle));
      dispatch(a.getExternalAccountsDone(handle));
      dispatch(a.getExternalLinksDone(handle));
      dispatch(a.getInfoDone(handle));
      dispatch(a.getSkillsDone(handle));
      dispatch(a.getStatsDone(handle, showPublicStats ? undefined : groupIds, tokenV3));
      dispatch(lookupActions.getCountriesDone());
      dispatch(profileActions.page.profile.getGamificationBadgesDone(handle));
    },
    loadMarathon: (handle, tokenV3, memberId) => {
      const uuid = shortId();
      dispatch(memberActions.getUserMarathonInit(handle, uuid));
      dispatch(memberActions.getUserMarathonDone(
        uuid,
        handle,
        memberId,
        tokenV3,
        1,
        CHALLENGE_PER_PAGE,
        true,
      ));
    },
    loadCertificates: (userId) => {
      dispatch(tcaActions.getTcaCertificationsInit(userId));
      dispatch(tcaActions.getTcaCertificationsDone(userId));
    },
  };
}

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileContainer);

export default Container;
