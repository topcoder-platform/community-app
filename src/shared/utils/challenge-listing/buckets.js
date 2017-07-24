/**
 * Standard challenge buckets, selectable by the sidebar.
 */

import { SORTS } from './sort';

export const BUCKETS = {
  ALL: 'all',
  MY: 'my',
  OPEN_FOR_REGISTRATION: 'openForRegistration',
  ONGOING: 'ongoing',
  PAST: 'past',
  SAVED_FILTER: 'saved-filter',
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
      filter: {
        started: true,
        status: ['ACTIVE'],
      },
      hideCount: false,
      name: 'All Challenges',
      sorts: [],
    },
    [BUCKETS.MY]: {
      filter: {
        started: true,
        status: ['ACTIVE'],
        users: [userHandle],
      },
      hideCount: false,
      name: 'My Challenges',
      sorts: [
        SORTS.MOST_RECENT,
        SORTS.TIME_TO_SUBMIT,
        SORTS.NUM_REGISTRANTS,
        SORTS.NUM_SUBMISSIONS,
        SORTS.PRIZE_HIGH_TO_LOW,
        SORTS.TITLE_A_TO_Z,
      ],
    },
    [BUCKETS.OPEN_FOR_REGISTRATION]: {
      filter: {
        registrationOpen: true,
        started: true,
        status: ['ACTIVE'],
      },
      hideCount: false,
      name: 'Open for registration',
      sorts: [
        SORTS.MOST_RECENT,
        SORTS.TIME_TO_REGISTER,
        SORTS.PHASE_END_TIME,
        SORTS.NUM_REGISTRANTS,
        SORTS.NUM_SUBMISSIONS,
        SORTS.PRIZE_HIGH_TO_LOW,
        SORTS.TITLE_A_TO_Z,
      ],
    },
    [BUCKETS.ONGOING]: {
      filter: {
        registrationOpen: false,
        started: true,
        status: ['ACTIVE'],
      },
      hideCount: false,
      name: 'Ongoing challenges',
      sorts: [
        SORTS.MOST_RECENT,
        SORTS.CURRENT_PHASE,
        SORTS.TITLE_A_TO_Z,
        SORTS.PRIZE_HIGH_TO_LOW,
      ],
    },
    [BUCKETS.UPCOMING]: {
      filter: {
        upcoming: true,
      },
      hideCount: true,
      name: 'Upcoming challenges',
      sorts: [
        SORTS.MOST_RECENT,
        SORTS.PRIZE_HIGH_TO_LOW,
        SORTS.TITLE_A_TO_Z,
      ],
    },
    [BUCKETS.PAST]: {
      filter: { status: ['COMPLETED', 'PAST'] },
      hideCount: true,
      name: 'Past challenges',
      sorts: [
        SORTS.MOST_RECENT,
        SORTS.PRIZE_HIGH_TO_LOW,
        SORTS.TITLE_A_TO_Z,
      ],
    },
  };
}

export default undefined;
