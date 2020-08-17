/**
 * Provides misc settings page helper functions.
 */
import _ from 'lodash';

/**
 * check if is marathon match challenge
 * @param {Object} challenge challenge object
 */
export function isMM(challenge) {
  const tags = _.get(challenge, 'tags') || [];
  return tags.includes('Marathon Match');
}

/**
 * Set challenge type to challenge
 * @param {Object} challenges challenge object
 * @param {Object} challengeTypeMap all challenge type object
 */
export function updateChallengeType(challenges, challengeTypeMap) {
  if (challengeTypeMap) {
    _.each(challenges, (challenge) => {
      // eslint-disable-next-line no-param-reassign
      challenge.challengeType = challengeTypeMap[challenge.typeId] || {};
    });
  }
}

export default {
  isMM,
  updateChallengeType,
};
