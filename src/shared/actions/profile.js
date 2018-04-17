/**
 * Profile details api actions.
 */
import { noop } from 'lodash';
import { createActions } from 'redux-actions';

import { getService as getMembersService } from 'services/members';
import { getService as getUserService } from 'services/user';

export default createActions({
  PROFILE: {
    LOAD_PROFILE: handle => handle,
    GET_ACHIEVEMENTS_INIT: noop,
    GET_ACHIEVEMENTS_DONE: handle => getUserService().getUserPublic(handle),
    GET_EXTERNAL_ACCOUNTS_INIT: noop,
    GET_EXTERNAL_ACCOUNTS_DONE: handle => getMembersService().getExternalAccounts(handle),
    GET_EXTERNAL_LINKS_INIT: noop,
    GET_EXTERNAL_LINKS_DONE: handle => getMembersService().getExternalLinks(handle),
    GET_INFO_INIT: noop,
    GET_INFO_DONE: handle => getMembersService().getMemberInfo(handle),
    GET_SKILLS_INIT: noop,
    GET_SKILLS_DONE: handle => getMembersService().getSkills(handle),
    GET_STATS_INIT: noop,
    GET_STATS_DONE: handle => getMembersService().getStats(handle),
  },
});
