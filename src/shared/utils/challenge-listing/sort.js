/**
 * Collection of compare function to sort challenges in different ways.
 */

import moment from 'moment';
import { sumBy } from 'lodash';

export const SORTS = {
  CURRENT_PHASE: 'current-phase',
  MOST_RECENT: 'most-recent',
  NUM_REGISTRANTS: 'num-registrants',
  NUM_SUBMISSIONS: 'num-submissions',
  PRIZE_HIGH_TO_LOW: 'prize-high-to-low',
  TIME_TO_REGISTER: 'time-to-register',
  TIME_TO_SUBMIT: 'time-to-submit',
  TITLE_A_TO_Z: 'title-a-to-z',
  REVIEW_OPPORTUNITIES_TITLE_A_TO_Z: 'review-opportunities-title-a-to-z',
  REVIEW_OPPORTUNITIES_PAYMENT: 'review-opportunities-payment',
  REVIEW_OPPORTUNITIES_START_DATE: 'review-opportunities-start-date',
};

export default {
  [SORTS.CURRENT_PHASE]: {
    func: (a, b) => a.status.localeCompare(b.status),
    name: 'Current phase',
  },
  [SORTS.MOST_RECENT]: {
    func: (a, b) => moment(b.registrationStartDate).diff(a.registrationStartDate),
    name: 'Most recent',
  },
  [SORTS.NUM_REGISTRANTS]: {
    func: (a, b) => b.numRegistrants - a.numRegistrants,
    name: '# of registrants',
  },
  [SORTS.NUM_SUBMISSIONS]: {
    func: (a, b) => b.numSubmissions - a.numSubmissions,
    name: '# of submissions',
  },
  [SORTS.PRIZE_HIGH_TO_LOW]: {
    func: (a, b) => b.totalPrize - a.totalPrize,
    name: 'Prize high to low',
  },
  [SORTS.TIME_TO_REGISTER]: {
    func: (a, b) => moment(a.registrationEndDate || a.submissionEndDate)
      .diff(b.registrationEndDate || b.submissionEndDate),
    name: 'Time to register',
  },
  [SORTS.TIME_TO_SUBMIT]: {
    func: (a, b) => {
      function nextSubEndDate(o) {
        if (o.checkpointSubmissionEndDate && moment(o.checkpointSubmissionEndDate).isAfter()) {
          return o.checkpointSubmissionEndDate;
        }
        return o.submissionEndDate;
      }

      const aDate = nextSubEndDate(a);
      const bDate = nextSubEndDate(b);

      if (moment(aDate).isBefore()) return 1;
      if (moment(bDate).isBefore()) return -1;

      return moment(aDate).diff(bDate);
    },
    name: 'Time to submit',
  },
  [SORTS.TITLE_A_TO_Z]: {
    func: (a, b) => a.name.localeCompare(b.name),
    name: 'Title A-Z',
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
};
