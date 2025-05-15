/**
 * Collection of compare function to sort challenges in different ways.
 */

import moment from 'moment';
import { sumBy } from 'lodash';
import { calculateScore } from './helper';
// import { phaseStartDate, phaseEndDate } from './helper';

const PRIZE = 'overview.totalPrizes';

export const SORTS = {
  CURRENT_PHASE: 'current-phase',
  MOST_RECENT: 'updated',
  MOST_RECENT_START_DATE: 'startDate',
  // NUM_REGISTRANTS: 'num-registrants',
  // NUM_SUBMISSIONS: 'num-submissions',
  PRIZE_HIGH_TO_LOW: 'overview.totalPrizes-high-to-low',
  PRIZE_LOW_TO_HIGH: 'overview.totalPrizes-low-to-high',
  // TIME_TO_REGISTER: 'registrationEndDate',
  // TIME_TO_SUBMIT: 'submissionEndDate',
  TITLE_A_TO_Z: 'name',
  REVIEW_OPPORTUNITIES_TITLE_A_TO_Z: 'review-opportunities-title-a-to-z',
  REVIEW_OPPORTUNITIES_PAYMENT: 'review-opportunities-payment',
  REVIEW_OPPORTUNITIES_START_DATE: 'review-opportunities-start-date',
  BEST_MATCH: 'bestMatch',
  COPILOT_OPPORTUNITIES_START_DATE: 'copilot-opportunities-start-date',
  COPILOT_OPPORTUNITIES_TITLE_A_TO_Z: 'copilot-opportunities-title-a-to-z',
  COPILOT_OPPORTUNITIES_STATUS: 'copilot-opportunities-status',
  COPILOT_OPPORTUNITIES_TYPE: 'copilot-opportunities-type',
};

export default {
  [SORTS.CURRENT_PHASE]: {
    func: (a, b) => a.status.localeCompare(b.status),
    name: 'Current phase',
  },
  [SORTS.MOST_RECENT]: {
    name: 'Most recent',
    order: 'desc',
  },
  [SORTS.MOST_RECENT_START_DATE]: {
    name: 'Most recent',
    order: 'desc',
  },
  [SORTS.PRIZE_HIGH_TO_LOW]: {
    func: (a, b) => b.totalPrize - a.totalPrize,
    name: 'Prize high to low',
    order: 'desc',
    field: PRIZE,
  },
  [SORTS.PRIZE_LOW_TO_HIGH]: {
    func: (a, b) => b.totalPrize - a.totalPrize,
    name: 'Prize low to high',
    order: 'asc',
    field: PRIZE,
  },
  // [SORTS.TIME_TO_REGISTER]: {
  //   func: (a, b) => {
  //     const aDate = moment(a.registrationEndDate || a.submissionEndTimestamp);
  //     const bDate = moment(b.registrationEndDate || b.submissionEndTimestamp);

  //     if (aDate.isBefore() && bDate.isAfter()) return 1;
  //     if (aDate.isAfter() && bDate.isBefore()) return -1;
  //     if (aDate.isBefore() && bDate.isBefore()) return bDate.diff(aDate);

  //     return aDate.diff(bDate);
  //   },
  //   name: 'Time to register',
  //   order: 'desc',
  // },
  // [SORTS.TIME_TO_SUBMIT]: {
  //   func: (a, b) => {
  //     function nextSubEndDate(o) {
  //       if (o.checkpointSubmissionEndDate && moment(o.checkpointSubmissionEndDate).isAfter()) {
  //         return moment(o.checkpointSubmissionEndDate);
  //       }
  //       return moment(o.submissionEndTimestamp);
  //     }

  //     const aDate = nextSubEndDate(a);
  //     const bDate = nextSubEndDate(b);

  //     if (aDate.isBefore() && bDate.isAfter()) return 1;
  //     if (aDate.isAfter() && bDate.isBefore()) return -1;
  //     if (aDate.isBefore() && bDate.isBefore()) return bDate.diff(aDate);

  //     return aDate.diff(bDate);
  //   },
  //   name: 'Time to submit',
  //   order: 'desc',
  // },
  [SORTS.TITLE_A_TO_Z]: {
    // func: (a, b) => a.name.localeCompare(b.name),
    name: 'Title A-Z',
    order: 'asc',
  },
  [SORTS.REVIEW_OPPORTUNITIES_TITLE_A_TO_Z]: {
    func: (a, b) => a.challenge.title.localeCompare(b.challenge.title),
    name: 'Title A-Z',
  },
  [SORTS.REVIEW_OPPORTUNITIES_PAYMENT]: {
    func: (a, b) => sumBy(b.payments, 'payment') - sumBy(a.payments, 'payment'),
    name: 'Payment',
  },
  [SORTS.REVIEW_OPPORTUNITIES_START_DATE]: {
    // This will implicitly use moment#valueOf
    func: (a, b) => moment(a.startDate) - moment(b.startDate),
    name: 'Review start date',
  },
  [SORTS.COPILOT_OPPORTUNITIES_STATUS]: {
    func: (a, b) => a.status.localeCompare(b.status),
    name: 'Status',
  },
  [SORTS.COPILOT_OPPORTUNITIES_TITLE_A_TO_Z]: {
    func: (a, b) => a.project.name.localeCompare(b.project.name),
    name: 'Title A-Z',
  },
  [SORTS.COPILOT_OPPORTUNITIES_TYPE]: {
    func: (a, b) => a.type.localeCompare(b.type),
    name: 'Type',
  },
  [SORTS.COPILOT_OPPORTUNITIES_START_DATE]: {
    func: (a, b) => {
      const statusPriority = status => (status === 'active' ? 1 : 0);
      // First: prioritize active over non-active
      const statusDiff = statusPriority(b.status) - statusPriority(a.status);
      if (statusDiff !== 0) return statusDiff;
      // Then: sort by createdAt descending
      return moment(b.createdAt) - moment(a.createdAt);
    },
    name: 'Most recent opportunities',
  },
  [SORTS.BEST_MATCH]: {
    func: (a, b) => calculateScore(b.jaccard_index) - calculateScore(a.jaccard_index),
    name: 'Best Match',
  },
};
