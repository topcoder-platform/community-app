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
  if (phase.isOpen || moment(phase.scheduledStartDate).isAfter()) {
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

/**
 * Map user details with challenges
 *
 * @param {String} userId user id
 * @param {Array} challenges all challenges
 * @param {Array} userChallenges challenges user is participating in
 */
export function mapUserWithChallenges(userId, challenges, userChallenges) {
  if (userChallenges) {
    const map = {};
    userChallenges.forEach((item) => { map[item.id] = item; });
    challenges.forEach((item) => {
      if (map[item.id]) {
        /* eslint-disable no-param-reassign */
        item.users[userId] = true;
        item.userDetails = map[item.id].userDetails;
        /* eslint-enable no-param-reassign */
      }
    });
  }
  return challenges;
}
