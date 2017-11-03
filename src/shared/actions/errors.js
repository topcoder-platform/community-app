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
  },
});
