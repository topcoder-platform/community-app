/**
 * Actions for the Data Fetch example.
 */

/* global fetch */

import _ from 'lodash';
import { createActions } from 'redux-actions';

function fetchDataDone() {
  /* NOTE: In the real life in most cases you don't want to use fetch() directly
   * in an action. You want to create a service for your calls and use it here.
   * However, in this example, to keep it a bit more compact, we use fetch()
   * directly here. */
  return fetch('http://api.topcoder-dev.com/v2/challenges/active?type=develop')
    .then(res => res.json()).then(res => res.data);
}

export default createActions({
  EXAMPLES: {
    DATA_FETCH: {
      FETCH_DATA_INIT: _.noop,
      FETCH_DATA_DONE: fetchDataDone,
    },
  },
});
