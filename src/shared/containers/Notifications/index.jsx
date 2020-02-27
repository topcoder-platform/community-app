/**
 * Container for the notifications page.
 */

import { actions } from 'topcoder-react-lib';

import Notifications from 'components/Notifications';
import { connect } from 'react-redux';

function mapDispatchToProps(dispatch) {
  return {
    loadNotifications: () => {
      dispatch(actions.notifications.getNotificationsInit());
      dispatch(actions.notifications.getNotificationsDone());
    },
    markNotificationAsRead: (item) => {
      dispatch(actions.notifications.markNotificationAsReadInit());
      dispatch(actions.notifications.markNotificationAsReadDone(item));
    },
    markAllNotificationAsRead: () => {
      dispatch(actions.notifications.markAllNotificationAsReadInit());
      dispatch(actions.notifications.markAllNotificationAsReadDone());
    },
    markAllNotificationAsSeen: () => {
      dispatch(actions.notifications.markAllNotificationAsSeenInit());
      dispatch(actions.notifications.markAllNotificationAsSeenDone());
    },
    dismissChallengeNotifications: (challegeId) => {
      dispatch(actions.notifications.dismissChallengeNotificationsInit());
      dispatch(actions.notifications.dismissChallengeNotificationsDone(challegeId));
    },
  };
}
export default connect(
  state => ({
    notifications: (state.notifications
      && state.notifications.items
      && [...state.notifications.items]) || [],
  }),
  mapDispatchToProps,
)(Notifications);
