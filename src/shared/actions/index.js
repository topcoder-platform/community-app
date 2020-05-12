/**
 * This module combines all available actions into a single object, which is
 * more convenient for use inside containers that need access to different
 * groups of actions.
 */

import { actions } from 'topcoder-react-lib';
import pageActions from './page';
import * as tracking from './tracking';

export { tracking };

export default {
  ...pageActions,
  memberTasks: actions.memberTasks,
  direct: actions.direct,
};
