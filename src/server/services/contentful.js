/**
 * Server-side functions necessary for effective integration with Contentful
 * CMS.
 */

import config from 'config';
import fetch from 'isomorphic-fetch';
import logger from 'utils/logger';
import moment from 'moment';

import {
  CONTENTFUL_CDN,
  INDEX_MAXAGE,
  getIndex as getIndexViaCdn,
} from 'services/contentful-cms';

/**
 * Gets the index of current dashboard announcements via CDN.
 * @param {Number} version Optional. The version of index to fetch. Defaults to
 *  the latest version.
 * @return {Promise}
 */
async function getCurrentDashAnnouncementsViaCdn(version) {
  let v = version;
  if (!v) {
    v = Date.now();
    v -= v % INDEX_MAXAGE;
  }
  const res =
    await fetch(`${config.CDN.PUBLIC}/contenful/current-dashboard-announcements-index?version=${v}`);
  if (!res.ok) {
    logger.error('Failed to get the index', res.statusText);
    throw new Error('Failed to get the index');
  }
  return res.json();
}

/**
 * Gets the next sync URL via CDN.
 * @param {Number} version Optional. The version of index to fetch. Defaults to
 *  the latest version.
 * @return {Promise}
 */
async function getNextSyncUrlViaCdn(version) {
  let v = version;
  if (!v) {
    v = Date.now();
    v -= v % INDEX_MAXAGE;
  }
  const res =
    await fetch(`${config.CDN.PUBLIC}/contentful/next-sync-url?version=${v}`);
  if (!res.ok) {
    logger.error('Failed to get the next sync URL', res.statusText);
    throw new Error('Failed to get the next sync URL');
  }
  return res.text();
}

/* THE INDEX OF CMS ASSETS AND ENTRIES.
 *
 * A tricky logic is involved to keep it all working properly, beware to modify
 * and in all cases prefer to use exported functions that provide access to the
 * index and take care about its correct updating. */

/* The barrier for syncronization of parallel calls to async functions exported
 * by this module. If not null, then it is a promise that signals that the index
 * update is in progress; in this case any function that needs to access the
 * index should wait until the promise is resolved. */
let barrier = null;

/* The map of current dashboard announcements (only those with startDate before
 * now, and the endDate after now). Each value in the map is an object that
 * contains the following fields:
 *  - id {String} - CMS ID of the announcement entry;
 *  - startDate {Number} - Timestamp of the moment when the announcement should
 *    be shown;
 *  - endDate {Number} - The timestamp of the moment when the announcement
 *    should be hidden. */
let currentDashboardAnnouncementsMap;

/* CMS ID of the announcement entry that should be shown right now. */
let currentDashboardAnnouncementId = '';

/* Holds the next sync URL provided by the CMS. */
let nextSyncUrl;

/* The public index of CMS assets and entries. It is the map between CMS IDs of
 * these assets/entries and the timestamps of their last updates. Note that this
 * index is accessible by the frontend via CDN, thus anybody can access it and
 * thus all assets and entries mentioned in this index. That's why announcements
 * with future startDate are not included into this index. */
let publicIndex;

/**
 * Adds a new asset to the index, or updates the existing one.
 * @param {Object} asset
 */
function indexAsset(asset) {
  const { id, createdAt, updatedAt } = asset.sys;
  publicIndex.assets[id] = moment(updatedAt || createdAt).valueOf();
}

/**
 * Adds a new entry to the index, or updates the existing one.
 * @param {Object} entry
 */
function indexEntry(entry) {
  let isPublic = true;
  const { id, createdAt, updatedAt } = entry.sys;
  const timestamp = moment(updatedAt || createdAt).valueOf();

  const type = entry.sys.contentType.sys.id;
  switch (type) {
    /* We use an additional index of dashboard announcement to be able to find
     * out which announcement should be show at any moment, without a call to
     * CMS. We also do not include future announcements into the public index
     * to avoid any exposure to general public before the time. */
    case 'dashboardAnnouncement': {
      const now = Date.now();
      const endDate = moment(entry.fields.endDate['en-US']).valueOf();
      const startDate = moment(entry.fields.startDate['en-US']).valueOf();
      isPublic = now > startDate;
      if (now < endDate) {
        currentDashboardAnnouncementsMap[id] = {
          id,
          endDate,
          startDate,
          timestamp,
        };
      }
      break;
    }
    default:
  }

  if (isPublic) publicIndex.entries[id] = timestamp;
}

/**
 * Adds a new asset or entry to the index, or updates / removes the existing
 * one.
 * @param {Object} item
 */
function indexItem(item) {
  if (item.type) { /* `true` for deleted items only */
    switch (item.type) {
      case 'DeletedAsset': delete publicIndex.assets[item.id]; break;
      case 'DeletedEntry':
        delete publicIndex.entries[item.id];
        delete currentDashboardAnnouncementsMap[item.id];
        break;
      default: throw new Error('Invariant violation');
    }
  } else {
    switch (item.sys.type) {
      case 'Asset': indexAsset(item); break;
      case 'Entry': indexEntry(item); break;
      default: throw new Error('Invariant violation');
    }
  }
}

/**
 * Updates the current announcement ID.
 */
function updateCurrentDashboardAnnouncementId() {
  const list = [];
  const now = Date.now();
  Object.values(currentDashboardAnnouncementsMap).forEach((item) => {
    if (item.endDate < now) delete currentDashboardAnnouncementsMap[item.id];
    else if (item.startDate < now) list.push(item);
  });
  if (list.length) {
    list.sort((a, b) => b.startDate - a.startDate);
    currentDashboardAnnouncementId = list[0].id;
  } else currentDashboardAnnouncementId = '';
  if (currentDashboardAnnouncementId
  && (!publicIndex.entries[currentDashboardAnnouncementId])) {
    publicIndex.entries[currentDashboardAnnouncementId] = list[0].timestamp;
  }
}

/**
 * Updates the index.
 * @return {Promise}
 */
async function updateIndex() {
  let nextPageUrl = nextSyncUrl;
  while (nextPageUrl) {
    /* Disabled, as we really need to keep these iterations sequential, thus
     * await inside the loop is not an error. */
    /* eslint-disable no-await-in-loop */
    const url = `${CONTENTFUL_CDN}/sync?sync_token=${nextPageUrl}`;
    let d = await fetch(url, {
      headers: {
        Authorization: `Bearer ${config.CONTENTFUL_CMS.CDN_API_KEY}`,
      },
    });
    if (!d.ok) throw new Error('Failed to update the index');
    d = await d.json();
    /* eslint-anable no-await-in-loop */

    d.items.forEach(indexItem);
    nextPageUrl = d.nextPageUrl;
    nextSyncUrl = d.nextSyncUrl;
  }
  publicIndex.timestamp = Date.now();
  updateCurrentDashboardAnnouncementId();
}

/**
 * Inits the index with data from CMS.
 * @return {Promise}
 */
async function initIndex() {
  /* Gets necessary data from CMS. */
  let d = await fetch(`${CONTENTFUL_CDN}/sync?initial=true`, {
    headers: {
      Authorization: `Bearer ${config.CONTENTFUL_CMS.CDN_API_KEY}`,
    },
  });
  if (!d.ok) {
    logger.error('Failed to initialize the index', d.statusText);
    throw new Error('Failed to initialize the index');
  }
  d = await d.json();

  /* Generates the index. */
  publicIndex = {
    assets: {},
    entries: {},
  };
  currentDashboardAnnouncementsMap = {};
  d.items.forEach(indexItem);
  publicIndex.timestamp = Date.now();
  updateCurrentDashboardAnnouncementId();

  /* In case the initial update is too large to fit into a single response.
   * TODO: This updateIndex(..) function can be combined with initIndex(..)
   * into a single function. The URL query is the only real difference between
   * them. */
  if (d.nextPageUrl) {
    nextSyncUrl = d.nextPageUrl;
    await updateIndex();
  } else nextSyncUrl = d.nextSyncUrl;
}

/**
 * Returns the index of CMS assets and content, along with the timestamps of
 * their last updates. This function also takes care about initialization and
 * automatic updates of the index, as necessary.
 * @return {Promise}
 */
export async function getIndex() {
  while (barrier) await barrier;
  if (!publicIndex) barrier = initIndex();
  else if (Date.now() - publicIndex.timestamp > INDEX_MAXAGE) {
    barrier = updateIndex();
  }
  if (barrier) {
    await barrier;
    barrier = null;

    /* These two calls are necessary to cache the updated index by CDN. */
    getIndexViaCdn();
    getCurrentDashAnnouncementsViaCdn();
    getNextSyncUrlViaCdn();
  }

  return publicIndex;
}

/**
 * Returns the index of current dashboard announcements.
 * @return {Promise}
 */
export async function getCurrentDashboardAnnouncementsIndex() {
  while (barrier) await barrier;
  if (!publicIndex || Date.now() - publicIndex.timestamp > INDEX_MAXAGE) {
    await getIndex();
  }
  return currentDashboardAnnouncementsMap;
}

/**
 * Returns ID of the current dashboard announcement to show.
 */
export async function getCurrentDashboardAnnouncementId() {
  while (barrier) await barrier;
  if (!publicIndex || Date.now() - publicIndex.timestamp > INDEX_MAXAGE) {
    await getIndex();
  }
  return currentDashboardAnnouncementId;
}

/**
 * Returns the next sync URL.
 * @return {Promise}
 */
export async function getNextSyncUrl() {
  while (barrier) await barrier;
  if (!publicIndex || Date.now() - publicIndex.timestamp > INDEX_MAXAGE) {
    await getIndex();
  }
  return nextSyncUrl;
}

/* Module initialization.
 * This code tries to pull the current index from CDN, where it is supposed to
 * be cached, to keep it persistent across re-deployments of the app, and also
 * to prevent unnecessary calls to Contentful APIs from a locally deployed
 * server. In case of failure, it initializes the new index using getIndex()
 * function directly. */
let version = Date.now() - INDEX_MAXAGE;
version -= version % INDEX_MAXAGE;
Promise.all([
  getIndexViaCdn(version),
  getCurrentDashAnnouncementsViaCdn(version),
  getNextSyncUrl(version),
]).then(([index, dashIndex, next]) => {
  publicIndex = index;
  currentDashboardAnnouncementsMap = dashIndex;
  nextSyncUrl = next;
  updateCurrentDashboardAnnouncementId();
}).catch(() => getIndex());
