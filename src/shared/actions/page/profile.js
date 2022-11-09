/**
 * Actions for member profile page.
 */
/* global fetch */
import { redux, config } from 'topcoder-react-utils';

/**
 * @static
 * @desc Initiates an action that fetch member's badges
 * @param {String} handle Member handle.
 * @return {Action}
 */
async function getGamificationBadgesInit(handle) {
  return { handle };
}

/**
 * @static
 * @desc Creates an action that gets member's badges
 *
 * @param {String} handle Topcoder member handle.
 * @return {Action}
 */
async function getGamificationBadgesDone(handle, limit) {
  try {
    const memberInfo = await fetch(`${config.API.V5}/members/${handle}`)
      .then(response => response.json());
    const badges = await fetch(`${config.API.V5}/gamification/badges/assigned/${memberInfo.userId}?organization_id=${config.GAMIFICATION.ORG_ID}&limit=${limit || 4}`)
      .then(response => response.json());

    return {
      handle,
      badges,
    };
  } catch (error) {
    return {
      handle,
      error,
    };
  }
}

export default redux.createActions({
  PAGE: {
    PROFILE: {
      GET_GAMIFICATION_BADGES_INIT: getGamificationBadgesInit,
      GET_GAMIFICATION_BADGES_DONE: getGamificationBadgesDone,
    },
  },
});
