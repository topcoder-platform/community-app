/**
 * Profile details api actions.
 */
import _, { noop } from 'lodash';
import { createActions } from 'redux-actions';

import { getService as getMembersService } from 'services/members';
import { getService as getUserService } from 'services/user';
import { getService as getChallengesService } from 'services/challenges';

/**
 * Gets count of user's active challenges from the backend.
 * @param {String} handle Topcoder user handle.
 * @param {String} tokenV3 Optional. Topcoder auth token v3. Without token only
 *  public challenges will be counted. With the token provided, the action will
 *  also count private challenges related to this user.
 * @return {Promise}
 */
function getActiveChallengesCountDone(handle, tokenV3) {
  const service = getChallengesService(tokenV3);
  const filter = { status: 'ACTIVE' };
  const params = { limit: 1, offset: 0 };

  const calls = [];
  calls.push(service.getUserChallenges(handle, filter, params));
  calls.push(service.getUserMarathonMatches(handle, filter, params));

  return Promise.all(calls).then(([uch, umm]) => uch.totalCount + umm.totalCount);
}

/**
 * Gets linked accounts.
 *
 * @param {Object} profile Topcoder member profile.
 * @param {String} tokenV3 Topcoder auth token v3.
 * @returns {Promise} Resolves to the credential result
 */
function getLinkedAccountsDone(profile, tokenV3) {
  const service = getUserService(tokenV3);
  return service.getLinkedAccounts(profile.userId);
}

/**
 * Gets credential.
 *
 * @param {Object} profile Topcoder member profile.
 * @param {String} tokenV3 Topcoder auth token v3.
 * @returns {Promise} Resolves to the credential result
 */
function getCredentialDone(profile, tokenV3) {
  const service = getUserService(tokenV3);
  return service.getCredential(profile.userId);
}

/**
 * Gets email preferences.
 *
 * @param {Object} profile Topcoder member profile.
 * @param {String} tokenV3 Topcoder auth token v3.
 * @returns {Promise} Resolves to the email preferences result
 */
function getEmailPreferencesDone(profile, tokenV3) {
  const service = getUserService(tokenV3);
  return service.getEmailPreferences(profile.userId);
}

/**
 * Uploads user's photo.
 * @param {String} handle Topcoder user handle.
 * @param {String} tokenV3 Topcoder auth token v3.
 * @param {String} file The photo file.
 * @return {Promise}
 */
function uploadPhotoDone(handle, tokenV3, file) {
  const service = getMembersService(tokenV3);
  return service.getPresignedUrl(handle, file)
    .then(res => service.uploadFileToS3(res))
    .then(res => service.updateMemberPhoto(res))
    .then(photoURL => ({ handle, photoURL }));
}

/**
 * Update user's profile.
 * @param {String} profile Topcoder user profile.
 * @param {String} tokenV3 Topcoder auth token v3.
 * @return {Promise}
 */
function updateProfileDone(profile, tokenV3) {
  const service = getMembersService(tokenV3);
  return service.updateMemberProfile(profile);
}

/**
 * Adds user's skill.
 * @param {String} handle Topcoder user handle.
 * @param {String} tokenV3 Topcoder auth token v3.
 * @param {Object} skill Skill to add.
 * @return {Promise}
 */
function addSkillDone(handle, tokenV3, skill) {
  const service = getMembersService(tokenV3);
  return service.addSkill(handle, skill.tagId)
    .then(res => ({ skills: res.skills, handle, skill }));
}

/**
 * Hides user's skill.
 * @param {String} handle Topcoder user handle.
 * @param {String} tokenV3 Topcoder auth token v3.
 * @param {Object} skill Skill to hide.
 * @return {Promise}
 */
function hideSkillDone(handle, tokenV3, skill) {
  const service = getMembersService(tokenV3);
  return service.hideSkill(handle, skill.tagId)
    .then(res => ({ skills: res.skills, handle, skill }));
}

/**
 * Adds user's web link.
 * @param {String} handle Topcoder user handle.
 * @param {String} tokenV3 Topcoder auth token v3.
 * @param {String} webLink Web link to add.
 * @return {Promise}
 */
function addWebLinkDone(handle, tokenV3, webLink) {
  const service = getMembersService(tokenV3);
  return service.addWebLink(handle, webLink).then(res => ({ data: res, handle }));
}

/**
 * Deletes user's web link.
 * @param {String} handle Topcoder user handle.
 * @param {String} tokenV3 Topcoder auth token v3.
 * @param {String} webLink Web link to delete.
 * @return {Promise}
 */
function deleteWebLinkDone(handle, tokenV3, webLink) {
  const service = getMembersService(tokenV3);
  return service.deleteWebLink(handle, webLink.key).then(res => ({ data: res, handle }));
}

/**
 * Links external account.
 * @param {Object} profile Topcoder member handle.
 * @param {String} tokenV3 Topcoder auth token v3.
 * @param {String} providerType The external account service provider
 * @param {String} callbackUrl Optional. The callback url
 * @returns {Promise}
 */
function linkExternalAccountDone(profile, tokenV3, providerType, callbackUrl) {
  const service = getUserService(tokenV3);
  return service.linkExternalAccount(profile.userId, providerType, callbackUrl)
    .then(res => ({ data: res, handle: profile.handle }));
}

/**
 * Unlinks external account.
 * @param {Object} profile Topcoder member profile.
 * @param {String} tokenV3 Topcoder auth token v3.
 * @param {String} providerType The external account service provider
 * @returns {Promise}
 */
function unlinkExternalAccountDone(profile, tokenV3, providerType) {
  const service = getUserService(tokenV3);
  return service.unlinkExternalAccount(profile.userId, providerType)
    .then(() => ({ providerType, handle: profile.handle }));
}

/**
 * Saves email preferences.
 *
 * @param {Object} profile Topcoder member profile.
 * @param {String} tokenV3 Topcoder auth token v3.
 * @param {Object} preferences The email preferences
 * @returns {Promise} Resolves to the email preferences result
 */
function saveEmailPreferencesDone(profile, tokenV3, preferences) {
  const service = getUserService(tokenV3);
  return service.saveEmailPreferences(profile, preferences)
    .then(res => ({ data: res, handle: profile.handle }));
}

/**
 * Updates user password.
 *
 * @param {Object} profile Topcoder member profile.
 * @param {String} tokenV3 Topcoder auth token v3.
 * @param {String} newPassword The new password
 * @param {String} oldPassword The old password
 * @return {Promise} Resolves to the update result.
 */
function updatePasswordDone(profile, tokenV3, newPassword, oldPassword) {
  const service = getUserService(tokenV3);
  return service.updatePassword(profile.userId, newPassword, oldPassword)
    .then(res => ({ data: res, handle: profile.handle }));
}

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
    GET_ACTIVE_CHALLENGES_COUNT_INIT: noop,
    GET_ACTIVE_CHALLENGES_COUNT_DONE: getActiveChallengesCountDone,
    GET_LINKED_ACCOUNTS_INIT: noop,
    GET_LINKED_ACCOUNTS_DONE: getLinkedAccountsDone,
    GET_EMAIL_PREFERENCES_INIT: noop,
    GET_EMAIL_PREFERENCES_DONE: getEmailPreferencesDone,
    GET_CREDENTIAL_INIT: noop,
    GET_CREDENTIAL_DONE: getCredentialDone,
    UPLOAD_PHOTO_INIT: _.identity,
    UPLOAD_PHOTO_DONE: uploadPhotoDone,
    DELETE_PHOTO_INIT: _.identity,
    DELETE_PHOTO_DONE: updateProfileDone,
    UPDATE_PROFILE_INIT: _.identity,
    UPDATE_PROFILE_DONE: updateProfileDone,
    ADD_SKILL_INIT: _.identity,
    ADD_SKILL_DONE: addSkillDone,
    HIDE_SKILL_INIT: _.identity,
    HIDE_SKILL_DONE: hideSkillDone,
    ADD_WEB_LINK_INIT: _.identity,
    ADD_WEB_LINK_DONE: addWebLinkDone,
    DELETE_WEB_LINK_INIT: _.identity,
    DELETE_WEB_LINK_DONE: deleteWebLinkDone,
    LINK_EXTERNAL_ACCOUNT_INIT: _.identity,
    LINK_EXTERNAL_ACCOUNT_DONE: linkExternalAccountDone,
    UNLINK_EXTERNAL_ACCOUNT_INIT: _.identity,
    UNLINK_EXTERNAL_ACCOUNT_DONE: unlinkExternalAccountDone,
    SAVE_EMAIL_PREFERENCES_INIT: _.identity,
    SAVE_EMAIL_PREFERENCES_DONE: saveEmailPreferencesDone,
    UPDATE_PASSWORD_INIT: _.identity,
    UPDATE_PASSWORD_DONE: updatePasswordDone,
  },
});
