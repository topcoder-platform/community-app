/**
 * Actions related to members data.
 */

import { createActions } from 'redux-actions';
import { getService } from 'services/members';
import { getService as getUserService } from 'services/user';

/**
 * Payload creator for the action that drops all loaded information about
 * a member.
 * @param {String} handle
 * @return {String}
 */
function drop(handle) {
  return handle;
}

/**
 * Payload creator for the action that drops all loaded information about
 * members.
 */
function dropAll() {}

/**
 * Payload creator for the action that inits the loading of member achievements.
 * @param {String} handle
 * @param {String} uuid
 * @return {Object} Payload.
 */
function getAchievementsInit(handle, uuid) {
  return { handle, uuid };
}

/**
 * Payload creator for the action that loads member achievements.
 * @param {String} handle
 * @param {String} uuid
 * @return {Promise} Payload.
 */
async function getAchievementsDone(handle, uuid) {
  let data;
  try {
    data = await getUserService().getAchievements(handle);
  } catch (e) {
    data = [];
  }
  return { data, handle, uuid };
}

/**
 * Payload creator for the action that initializes loading of financial
 * information about a member.
 * @param {String} handle
 * @param {String} uuid
 * @return {Object} Payload.
 */
function getFinancesInit(handle, uuid) {
  return { handle, uuid };
}

/**
 * Payload creator for the action that actually loads financial information
 * about a member.
 * @param {String} handle
 * @param {String} uuid
 * @param {String} tokenV3
 * @return {Object} Payload.
 */
async function getFinancesDone(handle, uuid, tokenV3) {
  const data = await getService(tokenV3).getMemberFinances(handle);
  return { data, handle, uuid };
}

/**
 * Payload creator for the action that inits the loading of member profile.
 * @param {String} handle
 * @param {String} uuid
 * @return {Object} Payload.
 */
async function getProfileInit(handle, uuid) {
  return { handle, uuid };
}

/**
 * Payload creator for the action that loads the member profile.
 * @param {String} handle
 * @param {String} uuid
 * @param {String} tokenV3
 * @return {Object} Payload
 */
async function getProfileDone(handle, uuid, tokenV3) {
  const data = await getService(tokenV3).getMemberInfo(handle);
  return { data, handle, uuid };
}

/**
 * Payload creator for the action that inits the loading of member stats.
 * @param {String} handle
 * @param {String} uuid
 * @return {Object} Payload.
 */
async function getStatsInit(handle, uuid) {
  return { handle, uuid };
}

/**
 * Payload creator for the action that loads the member stats.
 * @param {String} handle
 * @param {String} uuid
 * @param {String} tokenV3
 * @return {Object} Payload
 */
async function getStatsDone(handle, uuid, tokenV3) {
  const data = await getService(tokenV3).getStats(handle);
  return { data, handle, uuid };
}

/**
 * Payload creator for the action that inits the loading of member skills.
 * @param {String} handle
 * @param {String} uuid
 * @return {Object} Payload.
 */
async function getSkillsInit(handle, uuid) {
  return { handle, uuid };
}

/**
 * Payload creator for the action that loads the member skills.
 * @param {String} handle
 * @param {String} uuid
 * @param {String} tokenV3
 * @return {Object} Payload
 */
async function getSkillsDone(handle, uuid, tokenV3) {
  const data = await getService(tokenV3).getSkills(handle);
  return { data, handle, uuid };
}

export default createActions({
  MEMBERS: {
    DROP: drop,
    DROP_ALL: dropAll,
    GET_ACHIEVEMENTS_INIT: getAchievementsInit,
    GET_ACHIEVEMENTS_DONE: getAchievementsDone,
    GET_FINANCES_INIT: getFinancesInit,
    GET_FINANCES_DONE: getFinancesDone,
    GET_STATS_INIT: getStatsInit,
    GET_STATS_DONE: getStatsDone,
    GET_PROFILE_INIT: getProfileInit,
    GET_PROFILE_DONE: getProfileDone,
    GET_SKILLS_INIT: getSkillsInit,
    GET_SKILLS_DONE: getSkillsDone,
  },
});
