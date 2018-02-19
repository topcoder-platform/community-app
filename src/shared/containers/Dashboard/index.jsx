/**
 * Container for the dashboard page.
 */
/* global location */

import _ from 'lodash';
import Announcement from 'components/Announcement';
import cookies from 'browser-cookies';
import Dashboard from 'components/Dashboard';
import dashActions from 'actions/page/dashboard';
import config from 'utils/config';
import memberActions from 'actions/members';
import PT from 'prop-types';
import React from 'react';
import rssActions from 'actions/rss';
import shortId from 'shortid';

import { connect } from 'react-redux';

import actions from 'actions/dashboard';
import cActions from 'actions/challenge-listing';
import communityActions from 'actions/tc-communities';
import moment from 'moment';
import statsActions from 'actions/stats';
import { processActiveDevDesignChallenges } from 'utils/tc';
import Header from 'components/Dashboard/Header';
import MyChallenges from 'components/Dashboard/MyChallenges';
import SRM from 'components/Dashboard/SRM';
import Program from 'components/Dashboard/Program';
import LoadingIndicator from 'components/LoadingIndicator';

import { isTokenExpired } from 'tc-accounts';
import { cdnService } from 'services/contentful-cms';
import { isClientSide } from 'utils/isomorphy';

import './styles.scss';

/* When mounted, this container triggers (re-)loading of various data it needs.
 * It will not reload any data already present in the Redux store, if they were
 * fetched more recently than this max age [ms]. */
const CACHE_MAX_AGE = 10 * 60 * 1000;

/* Constants for loading Topcoder blog. */
const TOPCODER_BLOG_ID = 'TOPCODER_BLOG';
const TOPOCDER_BLOG_URL = `/community-app-assets/api/proxy-get?url=${
  encodeURIComponent(config.URL.BLOG_FEED)}`;

export class DashboardPageContainer extends React.Component {
  componentDidMount() {
    const {
      achievementsLoading,
      achievementsTimestamp,
      financesLoading,
      financesTimestamp,
      getMemberAchievements,
      getMemberFinances,
      getMemberStats,
      getTopcoderBlogFeed,
      handle,
      statsLoading,
      statsTimestamp,
      tcBlogLoading,
      tcBlogTimestamp,
      tokenV3,
    } = this.props;
    if (!this.authCheck(tokenV3)) return;

    const now = Date.now();

    if (now - achievementsTimestamp > CACHE_MAX_AGE
    && !achievementsLoading) getMemberAchievements(handle);

    if (now - tcBlogTimestamp > CACHE_MAX_AGE && !tcBlogLoading) {
      getTopcoderBlogFeed();
    }

    if (now - financesTimestamp > CACHE_MAX_AGE && !financesLoading) {
      getMemberFinances(handle, tokenV3);
    }

    if (now - statsTimestamp > CACHE_MAX_AGE && !statsLoading) {
      getMemberStats(handle, tokenV3);
    }

    /**
     * POC for loading announcement into the dashboard.
     */
    /*
    const now = moment().toISOString();
    cdnService.getContentEntries({
      content_type: 'dashboardAnnouncement',
      'fields.startDate[lt]': now,
      'fields.endDate[gt]': now,
      limit: 1,
      order: '-fields.startDate',
    }).then((res) => {
      if (!res.items.length) return;
      this.setState({
        announcementId: res.items[0].sys.id,
      });
    });

    /* OLD STUFF BELOW */

    /*
    this.props.getCommunityList(this.props.auth);
    if (tokenV3 && user) {
      this.loadChallenges();
      this.props.getSRMs(tokenV3, user.handle);
      this.props.getUserAchievements(user.handle);
      _.forEach(communityList, c => getCommunityStats(c, challenges, tokenV3));
    }
    */
  }

  componentWillReceiveProps(nextProps) {
    this.authCheck(nextProps.tokenV3);
  }

  componentDidUpdate(prevProps) {
    /*
    if (tokenV3 && tokenV3 !== prevProps.auth.tokenV3) {
      setImmediate(() => {
        this.loadChallenges();
        this.props.getSRMs(tokenV3, user.handle);
        _.forEach(communityList, c => getCommunityStats(c, challenges, tokenV3));
      });
    }
    if (profile && !prevProps.auth.profile) {
      setImmediate(() => this.props.getCommunityList(this.props.auth));
    }
    if ((challenges !== prevProps.challengeListing.challenges
      || communityList !== prevProps.tcCommunities.list.data) && tokenV3) {
      _.forEach(communityList, c => getCommunityStats(c, challenges, tokenV3));
    }
    */
  }

  /**
   * Does nothing if a valid TC API v3 token is passed in; otherwise redirects
   * user to the TC auth page, with proper return URL.
   * @param {String} tokenV3
   * @return {Boolean} `true` if the user is authenticated; `false` otherwise.
   */
  authCheck(tokenV3) {
    if (tokenV3 && !isTokenExpired(tokenV3)) return true;

    /* This implements front-end redirection. Once the server-side rendering of
     * the Dashboard is in place, this should be updated to work for the server
     * side rendering as well. */
    let url = `retUrl=${encodeURIComponent(location.href)}`;
    url = `${config.URL.AUTH}/member?${url}&utm_source=community-app-main`;
    location.href = url;

    _.noop(this);
    return false;
  }

  loadChallenges() {
    /*
    this.props.getAllActiveChallenges(this.props.auth.tokenV3);
    if (config.CHALLENGE_LISTING_AUTO_REFRESH) {
      if (this.autoRefreshTimerId) clearTimeout(this.autoRefreshTimerId);
      this.autoRefreshTimerId = setTimeout(() =>
        this.loadChallenges(), 1000 * config.CHALLENGE_LISTING_AUTO_REFRESH);
    }
    */
  }

  render() {
    const {
      achievements,
      achievementsLoading,
      finances,
      financesLoading,
      showEarnings,
      stats,
      statsLoading,
      switchShowEarnings,
      tcBlogLoading,
      tcBlogPosts,
    } = this.props;

    const {
      auth: { profile, user, tokenV3 },
      dashboard: {
        srms, loadingSRMs,
      },
      challengeListing: { challenges },
      lastUpdateOfActiveChallenges,
      tcCommunities: {
        list: {
          data: communityList,
        },
      },
    } = this.props;
    const myChallenges = processActiveDevDesignChallenges(
      _.filter(challenges, c => !!c.users[user.handle]),
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
      <Dashboard
        achievements={achievements}
        achievementsLoading={achievementsLoading}
        finances={finances}
        financesLoading={financesLoading}
        showEarnings={showEarnings}
        stats={stats}
        statsLoading={statsLoading}
        switchShowEarnings={switchShowEarnings}
        tcBlogLoading={tcBlogLoading}
        tcBlogPosts={tcBlogPosts}
      />
    );
  }
}

DashboardPageContainer.defaultProps = {
  achievements: [],
  achievementsTimestamp: 0,
  finances: [],
  financesTimestamp: 0,
  handle: '',
  showEarnings:
    isClientSide() ? cookies.get('showEarningsInDashboard') !== 'false' : true,
  stats: {},
  statsTimestamp: 0,
  tcBlogPosts: [],
  tcBlogTimestamp: 0,
  tokenV3: null,

  /* OLD STUFF BELOW */
  auth: {},
  dashboard: {},
  challengeListing: {},
  tcCommunities: {},
};

DashboardPageContainer.propTypes = {
  achievements: PT.arrayOf(PT.object),
  achievementsLoading: PT.bool.isRequired,
  achievementsTimestamp: PT.number,
  finances: PT.arrayOf(PT.object),
  financesLoading: PT.bool.isRequired,
  financesTimestamp: PT.number,
  getMemberAchievements: PT.func.isRequired,
  getMemberFinances: PT.func.isRequired,
  getMemberStats: PT.func.isRequired,
  getTopcoderBlogFeed: PT.func.isRequired,
  handle: PT.string,
  showEarnings: PT.bool,
  stats: PT.shape(),
  statsLoading: PT.bool.isRequired,
  statsTimestamp: PT.number,
  switchShowEarnings: PT.func.isRequired,
  tcBlogLoading: PT.bool.isRequired,
  tcBlogPosts: PT.arrayOf(PT.object),
  tcBlogTimestamp: PT.number,
  tokenV3: PT.string,

  /* OLD STUFF BELOW */
  auth: PT.shape(),
  dashboard: PT.shape(),
  challengeListing: PT.shape(),
  tcCommunities: PT.shape({
    list: PT.shape({
      data: PT.arrayOf(PT.shape()).isRequired,
    }).isRequired,
  }),
  getAllActiveChallenges: PT.func.isRequired,
  getSRMs: PT.func.isRequired,
  getCommunityStats: PT.func.isRequired,
  getCommunityList: PT.func.isRequired,
  lastUpdateOfActiveChallenges: PT.number.isRequired,
};

function mapStateToProps(state) {
  const userHandle = _.get(state.auth, 'user.handle');
  const member = state.members[userHandle] || {};
  const achievements = member.achievements || {};
  const finances = member.finances || {};
  const stats = member.stats || {};

  const tcBlog = state.rss[TOPCODER_BLOG_ID] || {};
  return {
    achievements: achievements.data,
    achievementsLoading: Boolean(achievements.loadingUuid),
    achievementsTimestamp: achievements.timestamp,
    finances: finances.data,
    financesLoading: Boolean(finances.loadingUuid),
    financesTimestamp: finances.timestamp,
    handle: userHandle,
    showEarnings: state.page.dashboard.showEarnings,
    stats: stats.data,
    statsLoading: Boolean(stats.loadingUuid),
    statsTimestamp: stats.timestamp,
    tcBlogLoading: Boolean(tcBlog.loadingUuid),
    tcBlogPosts: _.get(tcBlog, 'data.item'),
    tcBlogTimestamp: tcBlog.timestamp,
    tokenV3: state.auth.tokenV3,

    /* OLD STUFF BELOW */
    auth: state.auth,
    dashboard: state.dashboard,
    challengeListing: state.challengeListing,
    lastUpdateOfActiveChallenges: state.challengeListing.lastUpdateOfActiveChallenges,
    tcCommunities: state.tcCommunities,
  };
}

function mapDispatchToProps(dispatch) {
  const dash = dashActions.page.dashboard;
  const members = memberActions.members;
  return {
    getMemberAchievements: (handle) => {
      const uuid = shortId();
      dispatch(members.getAchievementsInit(handle, uuid));
      dispatch(members.getAchievementsDone(handle, uuid));
    },
    getMemberFinances: (handle, tokenV3) => {
      const uuid = shortId();
      dispatch(members.getFinancesInit(handle, uuid));
      dispatch(members.getFinancesDone(handle, uuid, tokenV3));
    },
    getMemberStats: (handle, tokenV3) => {
      const uuid = shortId();
      dispatch(members.getStatsInit(handle, uuid));
      dispatch(members.getStatsDone(handle, uuid, tokenV3));
    },
    getTopcoderBlogFeed: () => {
      const uuid = shortId();
      const a = rssActions.rss;
      dispatch(a.getInit(TOPCODER_BLOG_ID, uuid));
      dispatch(a.getDone(TOPCODER_BLOG_ID, uuid, TOPOCDER_BLOG_URL));
    },
    switchShowEarnings: show => dispatch(dash.showEarnings(show)),

    /* OLD STUFF BELOW */
    getAllActiveChallenges: (tokenV3) => {
      const uuid = shortId();
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
    getCommunityList: (auth) => {
      const uuid = shortId();
      dispatch(communityActions.tcCommunity.getListInit(uuid));
      dispatch(communityActions.tcCommunity.getListDone(uuid, auth));
    },
    getCommunityStats: (community, challenges, token) =>
      dispatch(statsActions.stats.getCommunityStats(community, challenges, token)),
  };
}

const DashboardContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DashboardPageContainer);

export default DashboardContainer;
