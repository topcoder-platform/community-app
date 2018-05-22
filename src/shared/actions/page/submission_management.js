import _ from 'lodash';
import { redux } from 'topcoder-react-utils';

export default redux.createActions({
  PAGE: {
    SUBMISSION_MANAGEMENT: {
      SHOW_DETAILS: _.identity,
      CANCEL_DELETE: _.noop,
      CONFIRM_DELETE: _.identity,
    },
  },
});
