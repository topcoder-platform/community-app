/**
 * Container component for the my-dashboard page
 *
 */
/* global location */

import _ from 'lodash';
import Announcement from 'components/Announcement';
import Dashboard from 'components/Dashboard';
import config from 'utils/config';
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
import SubtrackStats from 'components/Dashboard/SubtrackStats';
import MyChallenges from 'components/Dashboard/MyChallenges';
import SRM from 'components/Dashboard/SRM';
import Program from 'components/Dashboard/Program';
import CommunityUpdates from 'components/Dashboard/CommunityUpdates';
import LoadingIndicator from 'components/LoadingIndicator';

import { isTokenExpired } from 'tc-accounts';
import { cdnService } from 'services/contentful-cms';

import './styles.scss';

/* When mounted, this container triggers (re-)loading of various data it needs.
 * It will not reload any data already present in the Redux store, if they were
 * fetched more recently than this max age [ms]. */
const CACHE_MAX_AGE = 10 * 60 * 1000;

/* Constants for loading Topcoder blog. */
const TOPCODER_BLOG_ID = 'TOPCODER_BLOG';
const TOPOCDER_BLOG_URL = `/community-app-assets/api/proxy-get?url=${
  encodeURIComponent(config.URL.BLOG_FEED)}`;

// The container component
export class DashboardPageContainer extends React.Component {
  componentDidMount() {
    const {
      getTopcoderBlogFeed,
      tcBlogLoading,
      tcBlogTimestamp,
      tokenV3,
    } = this.props;
    this.authCheck(tokenV3);

    const now = Date.now();

    if (now - tcBlogTimestamp > CACHE_MAX_AGE && !tcBlogLoading) {
      getTopcoderBlogFeed();
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

    /* TODO: They way communities list is loaded should be re-worked:
     * now there are timestamps of the last loading, thus it can be optimized
     *  */

    const {
      auth: { tokenV2, user },
      challengeListing: { challenges },
      tcCommunities: {
        list: {
          data: communityList,
        },
      },
      getCommunityStats,
    } = this.props;
    if (!tokenV2) {
      /*
      location.href = `${config.URL.AUTH}/member?retUrl=${encodeURIComponent(location.href)}&utm_source=community-app-main`;
      return false;
      */
    }
    /*
    this.props.getBlogs();
    this.props.getCommunityList(this.props.auth);
    if (tokenV3 && user) {
      this.loadChallenges();
      this.props.getSubtrackRanks(tokenV3, user.handle);
      this.props.getSRMs(tokenV3, user.handle);
      this.props.getIosRegistration(tokenV3, user.userId);
      this.props.getUserFinancials(tokenV3, user.handle);
      this.props.getUserAchievements(user.handle);
      _.forEach(communityList, c => getCommunityStats(c, challenges, tokenV3));
    }
    */
    return true;
  }

  componentWillReceiveProps(nextProps) {
    this.authCheck(nextProps.tokenV3);
  }

  componentDidUpdate(prevProps) {
    /*
    const {
      auth: { user, tokenV3, profile },
      challengeListing: { challenges },
      tcCommunities: {
        list: {
          data: communityList,
        },
      },
      getCommunityStats,
    } = this.props;

    if (tokenV3 && tokenV3 !== prevProps.auth.tokenV3) {
      setImmediate(() => {
        this.loadChallenges();
        this.props.getSubtrackRanks(tokenV3, user.handle);
        this.props.getSRMs(tokenV3, user.handle);
        this.props.getIosRegistration(tokenV3, user.userId);
        this.props.getUserFinancials(tokenV3, user.handle);
        this.props.getUserAchievements(user.handle);
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
   */
  authCheck(tokenV3) {
    if (tokenV3 && !isTokenExpired(tokenV3)) return;

    /* This implements front-end redirection. Once the server-side rendering of
     * the Dashboard is in place, this should be updated to work for the server
     * side rendering as well. */
    let url = `retUrl=${encodeURIComponent(location.href)}`;
    url = `${config.URL.AUTH}/member?${url}&utm_source=community-app-main`;
    location.href = url;

    _.noop(this);
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
      tcBlogLoading,
      tcBlogPosts,
    } = this.props;

    const {
      auth: { profile, user, tokenV3 },
      dashboard: {
        subtrackRanks, srms, iosRegistered, blogs, financials,
        loadingSubtrackRanks, loadingSRMs, loadingBlogs, achievements,
      },
      challengeListing: { challenges },
      lastUpdateOfActiveChallenges,
      tcCommunities: {
        list: {
          data: communityList,
        },
      },
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

    const st = this.state || {};

    return (
      <Dashboard
        tcBlogLoading={tcBlogLoading}
        tcBlogPosts={tcBlogPosts}
      />
    );
  }
}

DashboardPageContainer.defaultProps = {
  tokenV3: null,

  /* OLD STUFF BELOW */
  auth: {},
  dashboard: {},
  challengeListing: {},
  tcCommunities: {},
  stats: {},
};

DashboardPageContainer.propTypes = {
  getTopcoderBlogFeed: PT.func.isRequired,
  tcBlogLoading: PT.bool.isRequired,
  tcBlogTimestamp: PT.number.isRequired,
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
  stats: PT.shape(),
  getAllActiveChallenges: PT.func.isRequired,
  getSubtrackRanks: PT.func.isRequired,
  getSRMs: PT.func.isRequired,
  getIosRegistration: PT.func.isRequired,
  registerIos: PT.func.isRequired,
  getBlogs: PT.func.isRequired,
  getUserFinancials: PT.func.isRequired,
  getUserAchievements: PT.func.isRequired,
  getCommunityStats: PT.func.isRequired,
  getCommunityList: PT.func.isRequired,
  lastUpdateOfActiveChallenges: PT.number.isRequired,
};

function mapStateToProps(state, props) {
  const tcBlog = state.rss[TOPCODER_BLOG_ID] || {};
  return {
    tcBlogLoading: Boolean(tcBlog.loadingUuid),
    tcBlogPosts: _.get(tcBlog, 'data.item', []),
    tcBlogTimestamp: tcBlog.timestamp || 0,
    tokenV3: state.auth.tokenV3,

    /* OLD STUFF BELOW */
    auth: state.auth,
    dashboard: state.dashboard,
    challengeListing: state.challengeListing,
    lastUpdateOfActiveChallenges: state.challengeListing.lastUpdateOfActiveChallenges,
    tcCommunities: state.tcCommunities,
    stats: state.stats,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getTopcoderBlogFeed: () => {
      const uuid = shortId();
      const a = rssActions.rss;
      dispatch(a.getInit(TOPCODER_BLOG_ID, uuid));
      dispatch(a.getDone(TOPCODER_BLOG_ID, uuid, TOPOCDER_BLOG_URL));
    },

    /* OLD STUFF BELOW */
    getSubtrackRanks: (tokenV3, handle) => {
      dispatch(actions.dashboard.getSubtrackRanksInit());
      dispatch(actions.dashboard.getSubtrackRanksDone(tokenV3, handle));
    },
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
    getIosRegistration: (tokenV3, userId) => {
      dispatch(actions.dashboard.getIosRegistration(tokenV3, userId));
    },
    registerIos: (tokenV3, userId) => {
      dispatch(actions.dashboard.registerIos(tokenV3, userId));
    },

    getUserFinancials: (tokenV3, handle) => {
      dispatch(actions.dashboard.getUserFinancials(tokenV3, handle));
    },
    getUserAchievements: (handle) => {
      dispatch(actions.dashboard.getUserAchievements(handle));
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
