/**
 * Actions related to Gamification project
 */
/* global fetch */
import { redux } from 'topcoder-react-utils';
import { actions } from 'topcoder-react-lib';

/**
 * On member authenticate
 */
async function onMemberAuthenticate(profile, store) {
  // load member skills
  const skillsInit = actions.profile.getSkillsInit();
  const skillsDone = actions.profile.getSkillsDone(profile.handle);

  store.dispatch(skillsInit);
  store.dispatch(skillsDone);
}

export default redux.createActions({
  GAMIFICATION: {
    ON_AUTHENTICATE: onMemberAuthenticate,
  },
});
