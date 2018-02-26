/**
 * Exports object of all events with eventId keys.
 * NOTE: This file does not need to be edited to update event data unless a new event year is added.
*/
import _ from 'lodash';

// import tco18 from './18';
import tco17 from './events/17';
import tco16 from './events/16';
import tco15 from './events/15';
import tco14 from './events/14';
import tco13 from './events/13';
import tco12 from './events/12';
import tco11 from './events/11';
import tco10 from './events/10';
import tco09 from './events/09';
import tco08 from './events/08';
import tco07 from './events/07';
import tco06 from './events/06';
import tco05 from './events/05';
import tco04 from './events/04';
import tco03 from './events/03';
import tco02 from './events/02';

/* Array of the TCO Event data.  This can be imported and used directly for iterating
 * through all the events.
*/
export const events = [
  // { id: '18', data: tco18 },
  { id: '17', data: tco17 },
  { id: '16', data: tco16 },
  { id: '15', data: tco15 },
  { id: '14', data: tco14 },
  { id: '13', data: tco13 },
  { id: '12', data: tco12 },
  { id: '11', data: tco11 },
  { id: '10', data: tco10 },
  { id: '09', data: tco09 },
  { id: '08', data: tco08 },
  { id: '07', data: tco07 },
  { id: '06', data: tco06 },
  { id: '05', data: tco05 },
  { id: '04', data: tco04 },
  { id: '03', data: tco03 },
  { id: '02', data: tco02 },
];


/**
 * Returns the event data for the specified ID
 * @param {string} id Id/year of the event
 * @return {object} Contains all the data imported from the correponding event directory
 */
export function getEvent(id) {
  return events.find(event => event.id === id);
}

/**
 * Calculates the number of total finalists in a given event
 * @param {Object} data Event data object
 * @return {Number} The total count
 */
export function getFinalistsCount(data) {
  let count = 0;
  count += data.algorithm ? data.algorithm.finalists.length : 0;
  count += data.marathon ? data.marathon.finalists.length : 0;
  count += data.development ? data.development.finalists.length : 0;
  count += data.first2finish ? data.first2finish.finalists.length : 0;
  count += data.uiDesign ? data.uiDesign.finalists.length : 0;
  count += data.uiPrototype ? data.uiPrototype.finalists.length : 0;
  return count;
}

/**
 * Calculates the maximum finalist count of any track
 * @param {Object} data Event data object
 * @return {Number} The max count
 */
export function getFinalistsMax(data) {
  const tracks = _.pick(data, ['algorithm', 'marathon', 'development', 'first2finish', 'uiDesign', 'uiPrototype']);
  return _.max(_.map(tracks, track => (track ? track.finalists.length : 0)));
}

/**
 * Calculates the number of total champions in a given event
 * @param {Object} data Event data object
 * @return {Number} The total count
 */
export function getChampionsCount(data) {
  let count = 0;
  count += data.algorithm ? 1 : 0;
  count += data.marathon ? 1 : 0;
  count += data.development ? 1 : 0;
  count += data.first2finish ? 1 : 0;
  count += data.uiDesign ? 1 : 0;
  count += data.uiPrototype ? 1 : 0;
  return count;
}

export default undefined;
