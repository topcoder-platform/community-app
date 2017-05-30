/**
 * Collection of small Topcoder-related functions.
 */
/**
 * Given a rating value, returns corresponding color.
 * @param {Number} rating Rating.
 * @return {String} Color.
 */
/* TODO: The actual color values below are taken from topcoder-app. Probably,
 * they don't match colors in the current Topcoder style guide. */
const RATING_COLORS = [{
  color: '#9D9FA0' /* Grey */,
  limit: 900,
}, {
  color: '#69C329' /* Green */,
  limit: 1200,
}, {
  color: '#616BD5' /* Blue */,
  limit: 1500,
}, {
  color: '#FCD617' /* Yellow */,
  limit: 2200,
}, {
  color: '#EF3A3A' /* Red */,
  limit: Infinity,
}];
export function getRatingColor(rating) {
  let i = 0; const r = Number(rating);
  while (RATING_COLORS[i].limit <= r) i += 1;
  return RATING_COLORS[i].color || 'black';
}

/**
 * Returns community meta data on server side
 *
 * This is used to mock API.
 * Basically it returns json files form directory
 * /src/server/tc-communities/{communityId}/metadata.json
 *
 * @param  {String}  communityId  id of community
 * @return {Object}               meta data
 */
export function getCommunitiesMetadata(communityId) {
  // we use constant process.env.FRONT_END directly instead of isClientSide from utils/isomporphy
  // because webpack can exclude code this way from bundle on frontend
  // otherwise it will try to resolve 'fs' and 'path' modules
  if (!process.env.FRONT_END) {
    /* eslint-disable global-require */
    const fs = require('fs');
    const path = require('path');
    /* eslint-enable global-require */

    return new Promise((resolve, reject) => {
      fs.readFile(path.resolve(__dirname, `../../server/tc-communities/${communityId}/metadata.json`), 'utf8', (err, data) => {
        if (err) {
          reject({ error: '404', communityId });
        } else {
          const metadata = JSON.parse(data);
          resolve(metadata);
        }
      });
    });
  }

  return null;
}

export default undefined;
