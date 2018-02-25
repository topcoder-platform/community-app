/**
 * Exports object of all events with eventId keys.
 * NOTE: This file does not need to be edited to update event data unless a new event year is added.
*/

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

// const events = {
//   // 18: tco18,
//   17: tco17,
//   16: tco16,
//   15: tco15,
//   14: tco14,
//   13: tco13,
//   12: tco12,
//   11: tco11,
//   10: tco10,
//   '09': tco09,
//   '08': tco08,
//   '07': tco07,
//   '06': tco06,
//   '05': tco05,
//   '04': tco04,
//   '03': tco03,
//   '02': tco02,
// };

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

export default undefined;
