/**
 * Provides misc track home pages helper functions.
 */
import _ from 'lodash';

/**
 * Get x random array items
 * @param {Number} count The number of random tips&quotes to return
 * @returns {Array} list of array items objects
 */
export function getItems(count, list) {
  return _.shuffle(list).slice(0, count);
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
  _.forEach(keys, (key) => {
    if (_.isArray(entry[key])) {
      const subEntryList = [];
      _.forEach(entry[key], (e) => {
        if (!_.has(e, 'fields')) {
          let result = [];
          switch (e.sys.linkType) {
            case 'Entry':
              result = _.filter(LinkData.Entry, en => en.sys.id === e.sys.id);
              break;
            case 'Asset':
              result = _.filter(LinkData.Asset, en => en.sys.id === e.sys.id);
              break;
            default:
              break;
          }
          if (result && result.length > 0) {
            const subEntry = processLinkData(result[0].fields, LinkData);
            subEntryList.push(subEntry);
          }
        }
      });
      _.set(newEntry, key, subEntryList);
    } else if (_.has(entry[key], 'sys') && !_.has(entry[key], 'fields')) {
      let result = [];
      switch (entry[key].sys.linkType) {
        case 'Entry':
          result = _.filter(LinkData.Entry, en => en.sys.id === entry[key].sys.id);
          break;
        case 'Asset':
          result = _.filter(LinkData.Asset, en => en.sys.id === entry[key].sys.id);
          break;
        default:
          break;
      }
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


export default undefined;

