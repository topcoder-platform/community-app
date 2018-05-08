/**
 * Actions related to the dashboard announcements.
 */

import _ from 'lodash';
import { createActions } from 'redux-actions';
import {
  cdnService,
  getCurrentDashboardAnnouncementId,
  getCurrentDashboardAnnouncementsIndex,
  previewService,
} from 'services/contentful';

/**
 * Payload creator for the action that inits the loading of the active dashboard
 * announcement.
 * @param {String} uuid
 * @return {String}
 */
function getActiveInit(uuid) {
  return uuid;
}

/**
 * Payload creator for the action that loads the active dashboard announcement.
 * @param {String} uuid
 * @return {Promise}
 */
async function getActiveDone(uuid) {
  let res = await getCurrentDashboardAnnouncementId();
  if (!res) return { assets: {}, data: null, uuid };

  res = await cdnService.getEntry(res);

  const assets = {};
  let img = res.fields.backgroundImage;
  if (img) {
    img = await cdnService.getAsset(img.sys.id);
    assets[img.sys.id] = img;
  }

  return {
    assets,
    data: res,
    uuid,
  };
}

/**
 * Payload creator for the action that inits the loading of the announcement
 * preview.
 * @param {String} uuid
 * @return {String}
 */
function getPreviewInit(uuid) {
  return uuid;
}

/**
 * Payload creator for the action that loads an announcement preview.
 * @param {String} id Announcement ID in the CMS.
 * @param {String} uuid Operation UUID.
 * @return {Promise}
 */
async function getPreviewDone(id, uuid) {
  const data = await previewService.getEntry(id);
  const assets = {};

  let img = data.fields.backgroundImage;
  if (img) {
    img = await previewService.getAsset(img.sys.id);
    assets[img.sys.id] = img;
  }

  return {
    assets,
    data,
    uuid,
  };
}

/**
 * Payload creator for the action that inits the loading of all scheduled
 * announcements, bypassing the cache, as it is intended for use by editors.
 * @param {String} uuid
 * @return {String}
 */
async function getScheduledInit(uuid) {
  return uuid;
}

/**
 * Payload creator for the action that actually loads all scheduled
 * announcements, bypassing the cache, as it is intended for use by editors.
 * @param {String} uuid
 * @return {Object}
 */
async function getScheduledDone(uuid) {
  const data = [];
  const index = _.keys(await getCurrentDashboardAnnouncementsIndex());
  for (let i = 0; i !== index.length; i += 1) {
    /* eslint-disable no-await-in-loop */
    data.push(await cdnService.getEntry(index[i]));
    /* eslint-enable no-await-in-loop */
  }
  return { uuid, data };
}

export default createActions({
  CMS: {
    DASHBOARD: {
      ANNOUNCEMENTS: {
        GET_ACTIVE_INIT: getActiveInit,
        GET_ACTIVE_DONE: getActiveDone,
        GET_PREVIEW_INIT: getPreviewInit,
        GET_PREVIEW_DONE: getPreviewDone,
        GET_SCHEDULED_INIT: getScheduledInit,
        GET_SCHEDULED_DONE: getScheduledDone,
      },
    },
  },
});
