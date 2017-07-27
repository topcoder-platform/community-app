/**
 * Container component for the my-dashboard page
 *
 */
/* global location */

import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import shortid from 'shortid';
import _ from 'lodash';

import config from 'utils/config';
import actions from 'actions/dashboard';
import cActions from 'actions/challenge-listing';
import communityActions from 'actions/tc-communities';
import moment from 'moment';
import statsActions from 'actions/stats';
import { processActiveDevDesignChallenges } from 'utils/tc';
import Header from 'components/Dashboard/Header';
import SubtrackStats from 'components/Dashboard/SubtrackStats';
import MyChallenges from 'components/Dashboard/MyChallenges';
import SRM from 'components/Dashboard/SRM';
import Program from 'components/Dashboard/Program';
import CommunityUpdates from 'components/Dashboard/CommunityUpdates';
import LoadingIndicator from 'components/LoadingIndicator';
import './styles.scss';

// The container component
export class DashboardPageContainer extends React.Component {

  componentDidMount() {
    const {
      auth: { tokenV2, user, tokenV3 },
      challengeListing: { challenges },
      tcCommunities: { list: communityList },
      getCommunityStats,
    } = this.props;
    if (!tokenV2) {
      location.href = `${config.URL.AUTH}/member?retUrl=${encodeURIComponent(location.href)}`;
      return false;
    }
    this.props.getBlogs();
    this.props.getCommunityList(this.props.auth);
    if (tokenV3 && user) {
      this.loadChallenges();
      this.props.getSubtrackRanks(tokenV3, user.handle);
      this.props.getSRMs(tokenV3, user.handle);
      this.props.getIosRegistration(tokenV3, user.userId);
      this.props.getUserFinancials(tokenV3, user.handle);
      _.forEach(communityList, c => getCommunityStats(c, challenges, tokenV3));
    }
    return true;
  }

  componentDidUpdate(prevProps) {
    const {
      auth: { user, tokenV3, profile },
      challengeListing: { challenges },
      tcCommunities: { list: communityList },
      getCommunityStats,
    } = this.props;

    if (tokenV3 && tokenV3 !== prevProps.auth.tokenV3) {
      setImmediate(() => {
        this.loadChallenges();
        this.props.getSubtrackRanks(tokenV3, user.handle);
        this.props.getSRMs(tokenV3, user.handle);
        this.props.getIosRegistration(tokenV3, user.userId);
        this.props.getUserFinancials(tokenV3, user.handle);
        _.forEach(communityList, c => getCommunityStats(c, challenges, tokenV3));
      });
    }
    if (profile && !prevProps.auth.profile) {
      setImmediate(() => this.props.getCommunityList(this.props.auth));
    }
    if ((challenges !== prevProps.challengeListing.challenges
      || communityList !== prevProps.tcCommunities.list) && tokenV3) {
      _.forEach(communityList, c => getCommunityStats(c, challenges, tokenV3));
    }
  }

  loadChallenges() {
    this.props.getAllActiveChallenges(this.props.auth.tokenV3);
    if (config.CHALLENGE_LISTING_AUTO_REFRESH) {
      if (this.autoRefreshTimerId) clearTimeout(this.autoRefreshTimerId);
      this.autoRefreshTimerId = setTimeout(() =>
        this.loadChallenges(), 1000 * config.CHALLENGE_LISTING_AUTO_REFRESH);
    }
  }

  render() {
    const {
      auth: { profile, user, tokenV3 },
      dashboard: {
        subtrackRanks, srms, iosRegistered, blogs, financials,
        loadingSubtrackRanks, loadingSRMs, loadingBlogs,
      },
      challengeListing: { challenges },
      lastUpdateOfActiveChallenges,
      tcCommunities: { list: communityList },
      registerIos,
      stats,
    } = this.props;
    const myChallenges = processActiveDevDesignChallenges(
      _.filter(challenges, c => !!c.users[user.handle]),
    );
    const iosChallenges = processActiveDevDesignChallenges(
      _.filter(challenges, c => c.platforms === 'iOS'),
    );

  /* When we automatically reload cached challenge objects, we do not want to
   * show the loading state, if the currently loaded challenges are not very
   * outdated (i.e. no need to show placeholders in the situations when it is
   * fine to reload silently, keeping showing the previously cached challenges,
   * while the reload is going on).
   *
   * In this code lastUpdateOfActiveChallenges serves as an adequate indication
   * when the challenges were fetched the last time, and the magic numbers are:
   * 1000 - to conver config.CHALLENGE_LISTING_AUTO_REFRESH from seconds to ms.
   * 1.5 - a reasonable margin factor, to decide when we consider already cached
   * challenges too old to display while the reload takes place.
   */
    let loadingActiveChallenges =
      Boolean(this.props.challengeListing.loadingActiveChallengesUUID);
    if (loadingActiveChallenges && config.CHALLENGE_LISTING_AUTO_REFRESH) {
      const outage = moment().diff(lastUpdateOfActiveChallenges);
      loadingActiveChallenges = outage > 1.5 * 1000 * config.CHALLENGE_LISTING_AUTO_REFRESH;
    }

    return (
      <div styleName="dashboard-container">
        <div styleName="page-container">
          <Header title={'Dashboard'} profile={profile} financials={financials} />
          <div styleName="my-dashboard-container">
            <div styleName="subtrack-stats">
              {
                loadingSubtrackRanks &&
                <LoadingIndicator theme={{}} />
              }
              {
                !loadingSubtrackRanks &&
                <SubtrackStats subtracks={subtrackRanks} handle={user ? user.handle : ''} />
              }
            </div>
            <div styleName="challenges">
              {
                loadingActiveChallenges &&
                <LoadingIndicator theme={{}} />
              }
              {
                !loadingActiveChallenges &&
                <MyChallenges
                  challenges={myChallenges}
                  communityList={communityList}
                  stats={stats}
                  groups={profile ? profile.groups : []}
                />
              }
            </div>
            <div styleName="tco tco17">
              <div styleName="tc-banner-placeholder cognitive">
                <div styleName="container">
                  <div styleName="img" />
                  <div styleName="description">
                    Learn about Cognitive technologies and get hands on
                    experience as a member of the Topcoder Cognitive Community.
                  </div>
                  <a
                    href={config.URL.COGNITIVE}
                    styleName="cta tc-btn-white tc-btn-radius"
                  >Learn More</a>
                </div>
              </div>
            </div>
            <div styleName="tco tco17">
              <div styleName="tc-banner-placeholder black bg-image">
                <div styleName="container">
                  <div styleName="title">2017 Topcoder Open</div>
                  <div styleName="subtitle">October 21-24, 2017 <br /> Buffalo, NY, USA</div>
                  <div styleName="description">
                    The Ultimate Programming and Design Tournament - The Final Stage</div>
                  <a href={config.URL.TCO17} styleName="cta tc-btn-radius tc-btn-white">
                    Learn More
                  </a>
                </div>
              </div>
            </div>
            <div styleName="srms">
              {
                loadingSRMs &&
                <LoadingIndicator theme={{}} />
              }
              {
                !loadingSRMs &&
                <SRM srms={srms} />
              }
            </div>
            <div styleName="programs">
              {
                loadingActiveChallenges &&
                <LoadingIndicator theme={{}} />
              }
              {
                !loadingActiveChallenges &&
                <Program
                  challenges={iosChallenges.slice(0, 3)}
                  iosRegistered={iosRegistered}
                  registerIos={() => registerIos(tokenV3, user.userId)}
                />
              }
            </div>
            <div styleName="community-updates">
              {
                loadingBlogs &&
                <LoadingIndicator theme={{}} />
              }
              {
                !loadingBlogs &&
                <CommunityUpdates blogs={blogs} />
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DashboardPageContainer.propTypes = {
  auth: PT.shape(),
  dashboard: PT.shape(),
  challengeListing: PT.shape(),
  tcCommunities: PT.shape({
    list: PT.arrayOf(PT.shape()).isRequired,
  }),
  stats: PT.shape(),
  getAllActiveChallenges: PT.func.isRequired,
  getSubtrackRanks: PT.func.isRequired,
  getSRMs: PT.func.isRequired,
  getIosRegistration: PT.func.isRequired,
  registerIos: PT.func.isRequired,
  getBlogs: PT.func.isRequired,
  getUserFinancials: PT.func.isRequired,
  getCommunityStats: PT.func.isRequired,
  getCommunityList: PT.func.isRequired,
  lastUpdateOfActiveChallenges: PT.number.isRequired,
};

DashboardPageContainer.defaultProps = {
  auth: {},
  dashboard: {},
  challengeListing: {},
  tcCommunities: {},
  stats: {},
};

const mapStateToProps = state => ({
  auth: state.auth,
  dashboard: state.dashboard,
  challengeListing: state.challengeListing,
  lastUpdateOfActiveChallenges: state.challengeListing.lastUpdateOfActiveChallenges,
  tcCommunities: state.tcCommunities,
  stats: state.stats,
});

const mapDispatchToProps = dispatch => ({
  getSubtrackRanks: (tokenV3, handle) => {
    dispatch(actions.dashboard.getSubtrackRanksInit());
    dispatch(actions.dashboard.getSubtrackRanksDone(tokenV3, handle));
  },
  getAllActiveChallenges: (tokenV3) => {
    const uuid = shortid();
    dispatch(cActions.challengeListing.getAllActiveChallengesInit(uuid));
    dispatch(cActions.challengeListing.getAllActiveChallengesDone(uuid, tokenV3));
  },
  getSRMs: (tokenV3, handle) => {
    dispatch(actions.dashboard.getSrmsInit());
    dispatch(actions.dashboard.getSrmsDone(tokenV3, handle, {
      filter: 'status=future',
      orderBy: 'registrationStartAt',
      limit: 3,
    }));
  },
  getIosRegistration: (tokenV3, userId) => {
    dispatch(actions.dashboard.getIosRegistration(tokenV3, userId));
  },
  registerIos: (tokenV3, userId) => {
    dispatch(actions.dashboard.registerIos(tokenV3, userId));
  },
  getBlogs: () => {
    dispatch(actions.dashboard.getBlogsInit());
    dispatch(actions.dashboard.getBlogsDone());
  },
  getUserFinancials: (tokenV3, handle) => {
    dispatch(actions.dashboard.getUserFinancials(tokenV3, handle));
  },
  getCommunityList: auth => dispatch(communityActions.tcCommunity.getList(auth)),
  getCommunityStats: (community, challenges, token) =>
    dispatch(statsActions.stats.getCommunityStats(community, challenges, token)),
});

const DashboardContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DashboardPageContainer);

export default DashboardContainer;
