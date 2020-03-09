/**
 * Container for the notifications page.
 */

import { actions } from 'topcoder-react-lib';

import Notifications from 'components/Notifications';
import { connect } from 'react-redux';

function mapDispatchToProps(dispatch) {
  return {
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
    notifications: (state.notifications
      && state.notifications.items
      && [...state.notifications.items]) || [],
    auth: state.auth,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Notifications);
