/**
 * Provides misc settings page helper functions.
 */
import _ from 'lodash';

/**
 * check if is marathon match challenge
 * @param {Object} challenge challenge object
 */
export function isMM(challenge) {
  return challenge.challengeType && challenge.challengeType.name === 'Marathon Match';
}

/**
 * check if is develop marathon match challenge
 * @param {Object} challenge challenge object
 */
export function isDevelopMM(challenge) {
  return challenge.challengeType && challenge.challengeType.name === 'Develop Marathon Match';
}

/**
 * Set challenge type to challenge
 * @param {Object} challenges challenge object
 * @param {Object} challengeSubtracksMap all challenge type object
 */
export function updateChallengeType(challenges, challengeSubtracksMap) {
  if (challengeSubtracksMap) {
    _.each(challenges, (challenge) => {
      // eslint-disable-next-line no-param-reassign
      challenge.challengeType = challengeSubtracksMap[challenge.typeId] || {};
    });
  }
}

export default {
  isMM,
  isDevelopMM,
  updateChallengeType,
};
