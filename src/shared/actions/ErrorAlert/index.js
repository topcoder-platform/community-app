/**
 * ErrorAlert Actions
 *
 * Description:
 *   Contains the Redux Actions for adding and removing errors to the reporting queue
 */
import _ from 'lodash';
import { createActions } from 'redux-actions';

/**
 * Export Actions for usage by Redux
 */
export default createActions({
  ERROR_ALERT: {
    CLEAR_ERROR: _.noop,
    NEW_ERROR: (title, details) => ({ title, details }),
  },
});
