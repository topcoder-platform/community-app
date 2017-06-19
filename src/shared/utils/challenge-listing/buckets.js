/**
 * Standard challenge buckets, selectable by the sidebar.
 */

export const BUCKETS = {
  ALL: 'all',
  MY: 'my',
  OPEN_FOR_REGISTRATION: 'openForRegistration',
  ONGOING: 'ongoing',
  // OPEN_FOR_REVIEW: 'Open for review',
  PAST: 'past',
  UPCOMING: 'upcoming',
};

/**
 * Returns configuration of all possible challenge buckets.
 * @param {String} userHandle Handle of the authenticated
 * user to filter out My Challenges.
 */
export function getBuckets(userHandle) {
  return {
    [BUCKETS.ALL]: {
      filter: { status: ['ACTIVE'] },
      hideCount: false,
      name: 'All Challenges',
    },
    [BUCKETS.MY]: {
      filter: {
        status: ['ACTIVE'],
        users: [userHandle],
      },
      hideCount: false,
      name: 'My Challenges',
    },
    [BUCKETS.OPEN_FOR_REGISTRATION]: {
      filter: {
        registrationOpen: true,
        status: ['ACTIVE'],
      },
      hideCount: false,
      name: 'Open for registration',
    },
    [BUCKETS.ONGOING]: {
      filter: {
        registrationOpen: false,
        status: ['ACTIVE'],
      },
      hideCount: false,
      name: 'Ongoing challenges',
    },
    [BUCKETS.UPCOMING]: {
      filter: {},
      hideCount: true,
      name: 'Upcoming challenges',
    },
    [BUCKETS.PAST]: {
      filter: { status: ['COMPLETED', 'PAST'] },
      hideCount: true,
      name: 'Past challenges',
    },
  };
}

export default undefined;
