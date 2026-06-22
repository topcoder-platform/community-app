import {
  getVisibleChallengeTypes,
  sanitizeChallengeTypeFilter,
} from 'utils/challenge-listing/constants';

describe('challenge listing constants', () => {
  test('returns only the supported challenge types once and in filter order', () => {
    const challengeTypes = [
      { name: 'AI', abbreviation: 'AI' },
      { name: 'AI Engineering', abbreviation: 'AIENG' },
      { name: 'Marathon Match', abbreviation: 'MM' },
      { name: 'Challenge', abbreviation: 'CH' },
      { name: 'Marathon Match', abbreviation: 'MM' },
      { name: 'Task', abbreviation: 'TSK' },
      { name: 'First2Finish', abbreviation: 'F2F' },
      { name: 'type-1778748614529', abbreviation: 'type-1778748614529' },
    ];

    expect(getVisibleChallengeTypes(challengeTypes)).toEqual([
      { name: 'Challenge', abbreviation: 'CH' },
      { name: 'First2Finish', abbreviation: 'F2F' },
      { name: 'Marathon Match', abbreviation: 'MM' },
      { name: 'Task', abbreviation: 'TSK' },
    ]);
  });

  test('removes hidden and duplicated selected challenge type filters', () => {
    expect(sanitizeChallengeTypeFilter([
      'AI',
      'CH',
      'F2F',
      'MM',
      'MM',
      'TSK',
      'type-1778748614529',
    ])).toEqual(['CH', 'F2F', 'MM', 'TSK']);
  });
});
