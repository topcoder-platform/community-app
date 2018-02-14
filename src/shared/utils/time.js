/**
* Utility functions for time/date related stuff
*/
import moment from 'moment';
import 'moment-duration-format';

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

/**
 * Returns a Promise that resolves after the specified delay.
 * @param {Number} time Delay [ms].
 * @return {Promise}
 */
export async function delay(time) {
  return new Promise(resolve =>
    setTimeout(() => resolve(), time));
}

/**
 * Standard duration formatting for listings and details
 *
 * @param {Number} time Time in milliseconds
 * @return {String} Formatted duration
 */
export const formatDuration = (time) => {
  let format;
  if (time > DAY_MS) format = 'D[d] H[h]';
  else if (time > HOUR_MS) format = 'H[h] m[min]';
  else format = 'm[min] s[s]';

  return moment.duration(time).format(format);
};

export default null;
