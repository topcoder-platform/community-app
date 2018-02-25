/**
 * TCO Hall of Fame Actions.
 */
import _ from 'lodash';
import { createActions } from 'redux-actions';

export default createActions({
  PAGE: {
    HALL_OF_FAME: {
      SET_SELECTED_EVENT: _.identity,
    },
  },
});
