/**
 * Provides misc event helper functions.
 */
import _ from 'lodash';

/**
 * Filter Asset or Entry Data
 * @param LinkData includes link data with Asset and Entry
 * @param entry entry data
 * @returns {Array} return filtered data
 */
function filterLinkData(LinkData, entry) {
  let result = [];
  switch (entry.sys.linkType) {
    case 'Entry':
      result = _.filter(LinkData.Entry, en => en.sys.id === entry.sys.id);
      break;
    case 'Asset':
      result = _.filter(LinkData.Asset, en => en.sys.id === entry.sys.id);
      break;
    default:
      break;
  }
  return result;
}

/**
 * Return entry with link data
 * @param {object} entry entry data
 * @param {object} includes link data with Asset and Entry
 */
export function processLinkData(entry, includes) {
  const LinkData = includes;
  const keys = _.keys(entry);
  const newEntry = {};
  let result = [];
  _.forEach(keys, (key) => {
    if (_.isArray(entry[key])) {
      const subEntryList = [];
      _.forEach(entry[key], (e) => {
        if (!_.has(e, 'fields')) {
          result = filterLinkData(LinkData, e);
          if (result && result.length > 0) {
            const subEntry = processLinkData(result[0].fields, LinkData);
            subEntryList.push(subEntry);
          }
        }
      });
      _.set(newEntry, key, subEntryList);
    } else if (_.has(entry[key], 'sys') && !_.has(entry[key], 'fields')) {
      result = filterLinkData(LinkData, entry[key]);
      if (result && result.length > 0) {
        const subEntry = processLinkData(result[0].fields, LinkData);
        _.set(newEntry, key, subEntry);
      }
    } else {
      _.set(newEntry, key, entry[key]);
    }
  });
  return newEntry;
}

/**
 * Return all events with link data
 * @param {object} data Contains all the data without link data
 */
export function getEvents(data) {
  const events = [];
  _.forEach(data.versions, item => events.push(processLinkData(item.fields, data.includes)));
  return events;
}

/**
 * Return single track list by track name
 * @param {string} track name
 * @param {array} finalists data
 * @returns {object} Contains finalist and champion data
 */
export function getSingleTrackList(track, list) {
  const result = _.filter(list, item => item.track === track);
  if (result && result.length > 0) {
    return result[0];
  }
  return null;
}


/**
 * Gets x random stories
 * @param {Number} count The number of random stories to return
 * @return {Array} Array of stories objects
 */
export function getStories(count, list) {
  return _.shuffle(list).slice(0, count);
}


export default undefined;
