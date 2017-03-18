/**
 * This module provides examples of Flux Standard Actions for Redux, which
 * should be used to update the state of Topcoder Community App.
 * For details read https://github.com/acdlite/redux-actions.
 */

import _ from 'lodash';
import { createActions } from 'redux-actions';

export default createActions({
  EXAMPLE: {
    /* This is the example of simple actions. */
    COUNTER: {
      DECREMENT: amount => -amount,
      INCREMENT: _.identity,
    },

    /* This is the example of async action. When you call an API, you should use
     * similar pattern to start/finalize the call. */
    TIMEOUT: {
      END: duration =>
        new Promise(resolve => setTimeout(() => resolve(), duration)),
      START: _.identity,
    },
  },
});

