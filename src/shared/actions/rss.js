/**
 * Actions for management of data loaded from RSS feeds.
 */

import fetch from 'isomorphic-fetch';
import { toJson } from 'utils/xml2json';
import { createActions } from 'redux-actions';

const config = require('utils/config');

/**
 * Payload creator for the action that drops data loaded from the specified
 * RSS feed. Also cancels any pending loading of data for that feed.
 * @param {String} feed Internal name of the feed.
 * @return {String}
 */
function drop(feed) {
  return feed;
}

/**
 * Payload creator for the actions that drops all data loaded from RSS feeds.
 */
function dropAll() {}

/**
 * Payload creator for the action that initializes data loading for the
 * specified feed.
 * @param {String} feed Internal name of the feed.
 * @param {String} uuid UUID of the loading operations.
 * @return {Object} Action payload.
 */
function getInit(feed, uuid) {
  return { feed, uuid };
}

/**
 * Payload creator for the action that actually loads data for the specified
 * RSS feed.
 * @param {String} feed Internal name of the feed.
 * @param {String} uuid UUID of the loading operation.
 * @param {String} url URL of the RSS feed.
 * @return {Object} Action payload.
 */
async function getDone(feed, uuid, url) {
  let res = await fetch(url, {
    headers: { Authorization: `ApiKey ${config.SERVER_API_KEY}` },
  });
  if (!res.ok) throw new Error(res.statusText);
  res = await res.text();
  res = await toJson(res);
  return { feed, uuid, data: res.rss.channel };
}

export default createActions({
  RSS: {
    DROP: drop,
    DROP_ALL: dropAll,
    GET_INIT: getInit,
    GET_DONE: getDone,
  },
});
