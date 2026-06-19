const VISIBLE_CHALLENGE_TYPES = [
  {
    name: 'Challenge',
    abbreviation: 'CH',
  },
  {
    name: 'First2Finish',
    abbreviation: 'F2F',
  },
  {
    name: 'Marathon Match',
    abbreviation: 'MM',
  },
  {
    name: 'Task',
    abbreviation: 'TSK',
  },
];

const VISIBLE_CHALLENGE_TYPE_ABBREVIATIONS = VISIBLE_CHALLENGE_TYPES
  .map(type => type.abbreviation);

/**
 * Returns the challenge types that should be displayed in listing filters.
 *
 * @param {Array<Object>} challengeTypes Challenge type records loaded from the
 * challenge API.
 * @return {Array<Object>} One API challenge type record per visible type, in
 * the order used by the filter panel.
 */
function getVisibleChallengeTypes(challengeTypes = []) {
  if (!Array.isArray(challengeTypes)) {
    return [];
  }

  return VISIBLE_CHALLENGE_TYPES
    .map(visibleType => (
      challengeTypes.find(type => (
        type.name === visibleType.name
        && type.abbreviation === visibleType.abbreviation
      ))
      || challengeTypes.find(type => type.name === visibleType.name)
    ))
    .filter(Boolean);
}

/**
 * Removes hidden and duplicated challenge type filter values.
 *
 * @param {Array<String>} types Selected challenge type abbreviations.
 * @return {Array<String>} Selected abbreviations limited to the visible filter
 * types.
 */
function sanitizeChallengeTypeFilter(types = []) {
  if (!Array.isArray(types)) {
    return types;
  }

  return types.filter((type, index) => (
    VISIBLE_CHALLENGE_TYPE_ABBREVIATIONS.includes(type)
    && types.indexOf(type) === index
  ));
}

export {
  VISIBLE_CHALLENGE_TYPES,
  VISIBLE_CHALLENGE_TYPE_ABBREVIATIONS,
  getVisibleChallengeTypes,
  sanitizeChallengeTypeFilter,
};
export default VISIBLE_CHALLENGE_TYPES;
