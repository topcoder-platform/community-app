/**
 * Standard challenge buckets, selectable by the sidebar.
 */

import _ from 'lodash';
import { REVIEW_OPPORTUNITY_TYPES } from 'utils/tc';
import { SORTS } from './sort';

export const BUCKETS = {
  ALL: 'all',
  MY: 'my',
  OPEN_FOR_REGISTRATION: 'openForRegistration',
  ONGOING: 'ongoing',
  PAST: 'past',
  // SAVED_FILTER: 'saved-filter',
  // UPCOMING: 'upcoming',
  REVIEW_OPPORTUNITIES: 'reviewOpportunities',
  // SAVED_REVIEW_OPPORTUNITIES_FILTER: 'savedReviewOpportunitiesFilter',
  ALL_PAST: 'allPast',
  MY_PAST: 'myPast',
};

export const BUCKET_DATA = {
  [BUCKETS.ALL]: {
    // filter: {
    //   started: true,
    //   status: ['Active'],
    // },
    // hideCount: false,
    name: 'All Challenges',
    sorts: [
      SORTS.MOST_RECENT_START_DATE,
      SORTS.PRIZE_HIGH_TO_LOW,
      SORTS.PRIZE_LOW_TO_HIGH,
      SORTS.TITLE_A_TO_Z,
    ],
  },
  [BUCKETS.MY]: {
    // filter: {
    //   status: ['Active'],
    //   // users: [userHandle],
    // },
    // hideCount: false,
    name: 'My Challenges',
    sorts: [
      SORTS.MOST_RECENT_START_DATE,
      // SORTS.TIME_TO_SUBMIT,
      // SORTS.NUM_REGISTRANTS,
      // SORTS.NUM_SUBMISSIONS,
      SORTS.PRIZE_HIGH_TO_LOW,
      SORTS.PRIZE_LOW_TO_HIGH,
      SORTS.TITLE_A_TO_Z,
    ],
  },
  [BUCKETS.OPEN_FOR_REGISTRATION]: {
    // filter: {
    //   registrationOpen: true,
    //   started: true,
    //   status: ['Active'],
    // },
    // hideCount: false,
    name: 'Open for Registration',
    sorts: [
      // SORTS.BEST_MATCH,
      SORTS.MOST_RECENT_START_DATE,
      // SORTS.TIME_TO_REGISTER,
      // SORTS.TIME_TO_SUBMIT,
      // SORTS.NUM_REGISTRANTS,
      // SORTS.NUM_SUBMISSIONS,
      SORTS.PRIZE_HIGH_TO_LOW,
      SORTS.PRIZE_LOW_TO_HIGH,
      SORTS.TITLE_A_TO_Z,
    ],
  },
  [BUCKETS.ONGOING]: {
    // filter: {
    //   registrationOpen: false,
    //   started: true,
    //   ongoing: true,
    //   status: ['Active'],
    // },
    // hideCount: false,
    name: 'Ongoing challenges',
    sorts: [
      SORTS.MOST_RECENT_START_DATE,
      SORTS.CURRENT_PHASE,
      SORTS.TITLE_A_TO_Z,
      SORTS.PRIZE_HIGH_TO_LOW,
      SORTS.PRIZE_LOW_TO_HIGH,
    ],
  },
  [BUCKETS.UPCOMING]: {
    // filter: {
    //   upcoming: true,
    // },
    // hideCount: true,
    name: 'Upcoming challenges',
    sorts: [
      SORTS.MOST_RECENT,
      // SORTS.PRIZE_HIGH_TO_LOW,
      SORTS.TITLE_A_TO_Z,
    ],
  },
  // [BUCKETS.PAST]: {
  //   // filter: { status: ['Completed', 'PAST'] },
  //   // hideCount: true,
  //   name: 'Past challenges',
  //   sorts: [
  //     SORTS.MOST_RECENT,
  //     // SORTS.PRIZE_HIGH_TO_LOW,
  //     SORTS.TITLE_A_TO_Z,
  //   ],
  // },
  [BUCKETS.REVIEW_OPPORTUNITIES]: {
    filter: {},
    // hideCount: true,
    name: 'Review Opportunities',
    sorts: [
      SORTS.REVIEW_OPPORTUNITIES_START_DATE,
      SORTS.REVIEW_OPPORTUNITIES_PAYMENT,
      SORTS.REVIEW_OPPORTUNITIES_TITLE_A_TO_Z,
    ],
  },
  // [BUCKETS.SAVED_REVIEW_OPPORTUNITIES_FILTER]: {
  //   // filter: {},
  //   sorts: [
  //     // SORTS.REVIEW_OPPORTUNITIES_START_DATE,
  //     // SORTS.REVIEW_OPPORTUNITIES_PAYMENT,
  //     // SORTS.REVIEW_OPPORTUNITIES_TITLE_A_TO_Z,
  //   ],
  // },
  [BUCKETS.ALL_PAST]: {
    name: 'All Past Challenges',
    sorts: [
      SORTS.MOST_RECENT_START_DATE,
      SORTS.TITLE_A_TO_Z,
    ],
  },
  [BUCKETS.MY_PAST]: {
    name: 'My Past Challenges',
    sorts: [
      SORTS.MOST_RECENT_START_DATE,
      SORTS.TITLE_A_TO_Z,
    ],
  },
};

export const NO_LIVE_CHALLENGES_CONFIG = {
  [BUCKETS.ALL]: 'No Live Challenges found',
  [BUCKETS.MY]: 'No challenges found',
  [BUCKETS.OPEN_FOR_REGISTRATION]: 'No challenges found',
  [BUCKETS.ONGOING]: 'No challenges found',
  // [BUCKETS.PAST]: 'No challenges found in Past Challenges',
  // [BUCKETS.SAVED_FILTER]: 'No challenges found in Saved filter Challenges',
  // [BUCKETS.UPCOMING]: 'No challenges found in Upcoming Challenges',
  [BUCKETS.ALL_PAST]: 'No challenges found',
  [BUCKETS.MY_PAST]: 'No challenges found',
};

/**
 * Returns configuration of all possible challenge buckets.
 * @param {String} userId id of the authenticated
 * user to filter out My Challenges.
 */
export function getBuckets(userChallenges) {
  const res = _.cloneDeep(BUCKET_DATA);
  res[BUCKETS.MY].filter.userChallenges = userChallenges;
  return res;
}

/**
 * Tests if a given bucket is of any of the Review Opportunities types
 * @param {String} bucket The bucket in question
 * @return {Boolean} True if the bucket contains Review Opportunities
 */
export const isReviewOpportunitiesBucket = bucket => (
// bucket === BUCKETS.REVIEW_OPPORTUNITIES || bucket === BUCKETS.SAVED_REVIEW_OPPORTUNITIES_FILTER);
  bucket === BUCKETS.REVIEW_OPPORTUNITIES);

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
export function filterChanged(filter, prevFilter) {
  if (!filter || !prevFilter) {
    return true;
  }
  return (!_.isEqual(filter.tracks, prevFilter.tracks))
  || (filter.search !== prevFilter.search)
  || (filter.tco !== prevFilter.tco)
  || (filter.startDateEnd !== prevFilter.startDateEnd)
  || (filter.endDateStart !== prevFilter.endDateStart)
  // eslint-disable-next-line max-len
  || (!_.isEqual(filter.groups, prevFilter.groups))
  || (!_.isEqual(filter.events, prevFilter.events))
  || _.filter(filter.tags, val => _.indexOf(prevFilter.tags, val) < 0).length > 0
  || _.filter(prevFilter.tags, val => _.indexOf(filter.tags, val) < 0).length > 0
  || _.filter(filter.types, val => _.indexOf(prevFilter.types, val) < 0).length > 0
  || _.filter(prevFilter.types, val => _.indexOf(filter.types, val) < 0).length > 0;
}

export function sortChangedBucket(sorts, prevSorts) {
  if (sorts.ongoing !== prevSorts.ongoing) return 'ongoing';
  if (sorts.my !== prevSorts.my) return 'my';
  if (sorts.all !== prevSorts.all) return 'all';
  if (sorts.openForRegistration !== prevSorts.openForRegistration) return 'openForRegistration';
  // if (sorts.past !== prevSorts.past) return 'past';
  if (sorts.allPast !== prevSorts.allPast) return 'allPast';
  if (sorts.myPast !== prevSorts.myPast) return 'myPast';
  return '';
}

export function isFilterEmpty(filter, tab, bucket) {
  let f;
  let empty;

  if (!filter.tco) {
    // eslint-disable-next-line no-param-reassign
    delete filter.tco;
  }

  if (tab === 'past') {
    f = _.pick(filter, 'tracks', 'search', 'types', 'startDateEnd', 'endDateStart', 'tco');
    if (f.types) f.types = [...f.types].sort();
    empty = {
      tracks: {
        Dev: true,
        Des: true,
        DS: true,
        QA: true,
      },
      search: '',
      types: ['CH', 'F2F', 'TSK'],
      startDateEnd: null,
      endDateStart: null,
    };
  } else if (bucket === BUCKETS.REVIEW_OPPORTUNITIES) {
    f = _.pick(filter, 'tracks', 'search', 'reviewOpportunityTypes');
    empty = {
      tracks: {
        Dev: true,
        Des: true,
        DS: true,
        QA: true,
      },
      search: '',
      reviewOpportunityTypes: _.keys(REVIEW_OPPORTUNITY_TYPES),
    };
  } else {
    f = _.pick(filter, 'tracks', 'search', 'types', 'tco');
    if (f.types) f.types = [...f.types].sort();
    empty = {
      tracks: {
        Dev: true,
        Des: true,
        DS: true,
        QA: true,
      },
      search: '',
      types: ['CH', 'F2F', 'TSK'],
      recommended: false,
    };
  }

  return _.isEqual(f, empty);
}

export function isPastBucket(bucket) {
  return [BUCKETS.ALL_PAST, BUCKETS.MY_PAST].indexOf(bucket) !== -1;
}

/**
 * Checks if current challenge type is recommended challenge type
 * @param {String} bucket bucket name
 * @param {Object} filterState current filter state
*/
export function isRecommendedChallengeType(bucket, filterState) {
  return bucket === 'openForRegistration' && filterState.recommended;
}

export default undefined;
