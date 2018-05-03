/**
 * My submissions management page specific actions.
 */

import _ from 'lodash';
import { createActions } from 'redux-actions';
import { actions } from 'topcoder-react-lib';

export default _.merge({ smp: actions.smp }, createActions({
  SMP: {
    SHOW_DETAILS: _.identity,
    CANCEL_DELETE: _.noop,
    CONFIRM_DELETE: _.identity,
  },
}));
