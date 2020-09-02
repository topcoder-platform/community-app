import moment from 'moment';

/**
 * Returns phase's end date.
 * @param {Object} phase
 * @return {Date}
 */
export function phaseEndDate(phase) {
  // Case 1: phase is still open. take the `scheduledEndDate`
  // Case 2: phase is not open but `scheduledStartDate` is a future date.
  // This means phase is not yet started. So take the `scheduledEndDate`
  // Case 3: phase is not open & `scheduledStartDate` is a past date,
  // but the phase is `Iterative Review`. It will take the `scheduledEndDate`
  // as it's a valid scenario for iterative review,
  // there might not be any submission yet to open the phase
  if (phase.isOpen || moment(phase.scheduledStartDate).isAfter() || phase.name === 'Iterative Review') {
    return new Date(phase.scheduledEndDate);
  }
  // for other cases, take the `actualEndDate` as phase is already closed
  return new Date(phase.actualEndDate);
}

/**
 * Returns phase's start date.
 * @param {Object} phase
 * @return {Date}
 */
export function phaseStartDate(phase) {
  // Case 1: Phase is not yet started. take the `scheduledStartDate`
  if (phase.isOpen !== true && moment(phase.scheduledStartDate).isAfter()) {
    return new Date(phase.scheduledStartDate);
  }
  // For all other cases, take the `actualStartDate` as phase is already started
  return new Date(phase.actualStartDate);
}
