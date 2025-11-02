/**
 * Provides misc settings page helper functions.
 */
import _ from 'lodash';

/**
 * Safely returns the string name for a provided track value which may be
 * either a string or an object like { name: 'Development' }.
 * @param {Object|String} trackOrChallenge Either a track object/string or a challenge object
 * @returns {String}
 */
export function getTrackName(trackOrChallenge) {
  const value = (trackOrChallenge && trackOrChallenge.track !== undefined)
    ? trackOrChallenge.track : trackOrChallenge;
  if (_.isObject(value)) return value.name || '';
  return value || '';
}

/**
 * Safely returns the string name for a provided type value which may be
 * either a string or an object like { name: 'Task' }.
 * @param {Object|String} typeOrChallenge Either a type object/string or a challenge object
 * @returns {String}
 */
export function getTypeName(typeOrChallenge) {
  const value = (typeOrChallenge && typeOrChallenge.type !== undefined)
    ? typeOrChallenge.type : typeOrChallenge;
  if (_.isObject(value)) return value.name || '';
  return value || '';
}

/**
 * check if is marathon match challenge
 * @param {Object} challenge challenge object
 */
export function isMM(challenge) {
  const tags = _.get(challenge, 'tags') || [];
  const typeName = getTypeName(challenge);
  const isMMType = challenge ? typeName === 'Marathon Match' : false;
  return tags.includes('Marathon Match') || isMMType;
}

/**
 * check if is rapid development match challenge
 * @param {Object} challenge challenge object
 */
export function isRDM(challenge) {
  const tags = _.get(challenge, 'tags') || [];
  const typeName = getTypeName(challenge);
  const isMMType = challenge ? typeName === 'Rapid Development Match' : false;
  return tags.includes('Rapid Development Match') || tags.includes('RDM') || isMMType;
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
  getTrackName,
  getTypeName,
};
