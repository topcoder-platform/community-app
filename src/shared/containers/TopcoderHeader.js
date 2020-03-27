/**
 * Container for the standard Topcoder header.
 */
/* global location */
/* eslint-disable no-restricted-globals */

import _ from 'lodash';
import headerActions from 'actions/topcoder_header';
import { actions } from 'topcoder-react-lib';

import TopcoderHeader from 'components/Header';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { isTokenExpired } from 'tc-accounts';
import { config } from 'topcoder-react-utils';

/**
 * Does nothing if a valid TC API v3 token is passed in; otherwise redirects
 * user to the TC auth page, with proper return URL.
 * @param {String} tokenV3
 * @return {Boolean} `true` if the user is authenticated; `false` otherwise.
 */
function authCheck(tokenV3) {
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

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(headerActions.topcoderHeader, dispatch),
    loadNotifications: (tokenV3) => {
      dispatch(actions.notifications.getNotificationsInit());
      dispatch(actions.notifications.getNotificationsDone(tokenV3));
    },
    markNotificationAsRead: (item, tokenV3) => {
      dispatch(actions.notifications.markNotificationAsReadInit());
      dispatch(actions.notifications.markNotificationAsReadDone(item, tokenV3));
    },
    markAllNotificationAsRead: (tokenV3) => {
      dispatch(actions.notifications.markAllNotificationAsReadInit());
      dispatch(actions.notifications.markAllNotificationAsReadDone(tokenV3));
    },
    markAllNotificationAsSeen: (items, tokenV3) => {
      dispatch(actions.notifications.markAllNotificationAsSeenInit());
      dispatch(actions.notifications.markAllNotificationAsSeenDone(items, tokenV3));
    },
    dismissChallengeNotifications: (challegeId, tokenV3) => {
      dispatch(actions.notifications.dismissChallengeNotificationsInit());
      dispatch(actions.notifications.dismissChallengeNotificationsDone(challegeId, tokenV3));
    },
  };
}

function mapStateToProps(state) {
  authCheck(state.auth.tokenV3);

  return {
    ...state.topcoderHeader,
    profile: {
      ...state.auth.profile,
      ..._.pickBy({ roles: state.auth.user ? state.auth.user.roles : undefined }),
    },
    notifications: (state.notifications
      && state.notifications.items
      && [...state.notifications.items]) || [],
    auth: state.auth,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TopcoderHeader);
