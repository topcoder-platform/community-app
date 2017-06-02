/**
 * Challenge listing actions.
 */

import _ from 'lodash';
import { createActions } from 'redux-actions';
// import { getService } from 'services/challenges';

export default createActions({
  CHALLENGE_LISTING: {
    REMOVE_ALL_CHALLENGES: _.noop,
  },
});
