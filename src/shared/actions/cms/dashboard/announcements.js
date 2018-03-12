/**
 * Actions related to the dashboard announcements.
 */

// import moment from 'moment';
import { createActions } from 'redux-actions';
import {
  cdnService,
  getCurrentDashboardAnnouncementId,
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

  res = await cdnService.getContentEntry(res);

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

  /*
  const now = moment().toISOString();
  const res = await cdnService.getContentEntries({
    content_type: 'dashboardAnnouncement',
    'fields.startDate[lt]': now,
    'fields.endDate[gt]': now,
    limit: 1,
    order: '-fields.startDate',
  });
  return {
    assets: res.assets,
    data: res.items[0],
    uuid,
  };
  */
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
  const data = await previewService.getContentEntry(id);
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

export default createActions({
  CMS: {
    DASHBOARD: {
      ANNOUNCEMENTS: {
        GET_ACTIVE_INIT: getActiveInit,
        GET_ACTIVE_DONE: getActiveDone,
        GET_PREVIEW_INIT: getPreviewInit,
        GET_PREVIEW_DONE: getPreviewDone,
      },
    },
  },
});
