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
  return {
    ...state.topcoderHeader,
    profile: {
      ...state.auth.profile,
      ..._.pickBy({ roles: state.auth.user ? state.auth.user.roles : undefined }),
    },
    notifications: (state.notifications
      && state.notifications.items
      && [...state.notifications.items]) || [],
    auth: {
      ...state.auth,
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TopcoderHeader);
