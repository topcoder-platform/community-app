/**
 * Actions related to the dashboard announcements.
 */

import moment from 'moment';
import { createActions } from 'redux-actions';
import { cdnService } from 'services/contentful-cms';

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
}

export default createActions({
  CMS: {
    DASHBOARD: {
      ANNOUNCEMENTS: {
        GET_ACTIVE_INIT: getActiveInit,
        GET_ACTIVE_DONE: getActiveDone,
      },
    },
  },
});
