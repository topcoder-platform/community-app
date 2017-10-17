/**
 * This module combines all available actions into a single object, which is
 * more convenient for use inside containers that need access to different
 * groups of actions.
 */

import directActions from './direct';
import memberTasks from './member-tasks';
import pageActions from './page';

export default {
  ...directActions,
  ...memberTasks,
  ...pageActions,
};
