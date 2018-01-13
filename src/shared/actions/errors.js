/**
 * Any actions related to the applications-wide error handling and messaging.
 */
import _ from 'lodash';
import { createActions } from 'redux-actions';

/**
 * Export Actions for usage by Redux
 */
export default createActions({
  ERRORS: {
    CLEAR_ERROR: _.noop,
    NEW_ERROR: (title, details) => ({ title, details }),
    CLEAR_ALL_ERROR_ICONS: _.noop,
    SET_ERROR_ICON: (id, title, message) => ({ id, title, message }),
    CLEAR_ERROR_ICON: id => ({ id }),
  },
});
