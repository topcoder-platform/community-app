/**
 * Standard challenge buckets, selectable by the sidebar.
 */

import _ from 'lodash';
import { SORTS } from './sort';

export const BUCKETS = {
  ALL: 'all',
  MY: 'my',
  OPEN_FOR_REGISTRATION: 'openForRegistration',
  ONGOING: 'ongoing',
  PAST: 'past',
  SAVED_FILTER: 'saved-filter',
  UPCOMING: 'upcoming',
  REVIEW_OPPORTUNITIES: 'reviewOpportunities',
  SAVED_REVIEW_OPPORTUNITIES_FILTER: 'savedReviewOpportunitiesFilter',
};

const BUCKET_DATA = {
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
      // users: [userHandle],
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
      SORTS.TIME_TO_SUBMIT,
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
  [BUCKETS.REVIEW_OPPORTUNITIES]: {
    filter: {},
    hideCount: true,
    name: 'Open for review',
    sorts: [
      SORTS.REVIEW_OPPORTUNITIES_START_DATE,
      SORTS.REVIEW_OPPORTUNITIES_PAYMENT,
      SORTS.REVIEW_OPPORTUNITIES_TITLE_A_TO_Z,
    ],
  },
  [BUCKETS.SAVED_REVIEW_OPPORTUNITIES_FILTER]: {
    filter: {},
    sorts: [
      SORTS.REVIEW_OPPORTUNITIES_START_DATE,
      SORTS.REVIEW_OPPORTUNITIES_PAYMENT,
      SORTS.REVIEW_OPPORTUNITIES_TITLE_A_TO_Z,
    ],
  },
};

/**
 * Returns configuration of all possible challenge buckets.
 * @param {String} userHandle Handle of the authenticated
 * user to filter out My Challenges.
 */
export function getBuckets(userHandle) {
  const res = _.cloneDeep(BUCKET_DATA);
  res[BUCKETS.MY].filter.users = [userHandle];
  return res;
}

/**
 * Tests if a given bucket is of any of the Review Opportunities types
 * @param {String} bucket The bucket in question
 * @return {Boolean} True if the bucket contains Review Opportunities
 */
export const isReviewOpportunitiesBucket = bucket =>
  (bucket === BUCKETS.REVIEW_OPPORTUNITIES || bucket === BUCKETS.SAVED_REVIEW_OPPORTUNITIES_FILTER);

/**
 * Registers a new bucket.
 * @param {String} id
 * @param {Object} bucket
 */
export function registerBucket(id, bucket) {
  if (BUCKET_DATA[id]) {
    throw new Error('Bucket ID clush with an existing bucket');
  }
  BUCKETS[id] = id;
  BUCKET_DATA[id] = bucket;
}

export default undefined;
