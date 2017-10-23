/**
 * This module combines all available actions into a single object, which is
 * more convenient for use inside containers that need access to different
 * groups of actions.
 */

import challengeActions from './challenge';
import directActions from './direct';
import memberTasks from './member-tasks';
import pageActions from './page';

export default {
  ...challengeActions,
  ...directActions,
  ...memberTasks,
  ...pageActions,
};
