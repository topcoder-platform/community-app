/**
 * Any actions related to the API/network status handling and messaging.
 */
import _ from 'lodash';
import { createActions } from 'redux-actions';

/**
 * Export Actions for usage by Redux
 */
export default createActions({
  STATUS: {
    CLEAR_ALL_ERRORS_STATUS: _.noop(),
    SET_NETWORK_ERRORS_STATUS: (url, message) => ({ url, message }),
    CLEAR_NETWORK_ERRORS_STATUS: _.noop(),
    SET_API_ERRORS_STATUS: (url, message) => ({ url, message }),
    CLEAR_API_ERRORS_STATUS: _.identity,
  },
});
