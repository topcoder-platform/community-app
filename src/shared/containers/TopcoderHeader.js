/**
 * Container for the standard Topcoder header.
 */

import _ from 'lodash';
import headerActions from 'actions/topcoder_header';
import { actions } from 'topcoder-react-lib';

import TopcoderHeader from 'components/Header';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(headerActions.topcoderHeader, dispatch),
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
  };
}
export default connect(
  state => ({
    ...state.topcoderHeader,
    profile: {
      ...state.auth.profile,
      ..._.pickBy({ roles: state.auth.user ? state.auth.user.roles : undefined }),
    },
    notifications: (state.notifications
      && state.notifications.items
      && [...state.notifications.items]) || [],
  }),
  mapDispatchToProps,
)(TopcoderHeader);
