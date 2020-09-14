/**
 * Collection of compare function to sort challenges in different ways.
 */

import moment from 'moment';
import { find, sumBy, isEmpty } from 'lodash';
import { phaseStartDate, phaseEndDate } from './helper';

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
    func: (a, b) => {
      const aPhases = a.phases || [];
      const bPhases = b.phases || [];
      const aPhase = aPhases
        .filter(p => p.name !== 'Registration' && p.isOpen)
        .sort((p1, p2) => moment(p1.scheduledEndDate).diff(p2.scheduledEndDate))[0];
      const bPhase = bPhases
        .filter(p => p.name !== 'Registration' && p.isOpen)
        .sort((p1, p2) => moment(p1.scheduledEndDate).diff(p2.scheduledEndDate))[0];

      let aPhaseName = 'Stalled';
      let bPhaseName = 'Stalled';
      if (!aPhase && a.type === 'First2Finish' && aPhases.length) {
        aPhaseName = 'Submission';
      }
      if (!bPhase && b.type === 'First2Finish' && bPhases.length) {
        bPhaseName = 'Submission';
      }

      if (aPhase) aPhaseName = aPhase.name;
      else if (a.status === 'Draft') aPhaseName = 'Draft';

      if (bPhase) bPhaseName = bPhase.name;
      else if (b.status === 'Draft') bPhaseName = 'Draft';

      return aPhaseName.localeCompare(bPhaseName);
    },
    name: 'Current phase',
  },
  [SORTS.MOST_RECENT]: {
    func: (a, b) => {
      const getChallengeStartDate = (challenge) => {
        // extract the phases from `challenge.phases`,
        // as `challenge.registrationStartDate` returned from API is not reliable
        const registrationPhase = find(challenge.phases, p => p.name === 'Registration') || {};
        const submissionPhase = find(challenge.phases, p => p.name === 'Submission') || {};
        // registration phase exists
        if (!isEmpty(registrationPhase)) {
          return moment(phaseStartDate(registrationPhase));
        }
        // registration phase doesnt exist, This is possibly a F2F or TSK. Take submission phase
        return moment(phaseStartDate(submissionPhase));
      };
      const aChallengeStartDate = getChallengeStartDate(a);
      const bChallengeStartDate = getChallengeStartDate(b);
      return bChallengeStartDate.diff(aChallengeStartDate);
    },
    name: 'Most recent',
  },
  [SORTS.NUM_REGISTRANTS]: {
    func: (a, b) => b.numOfRegistrants - a.numOfRegistrants,
    name: '# of registrants',
  },
  [SORTS.NUM_SUBMISSIONS]: {
    func: (a, b) => b.numOfSubmissions - a.numOfSubmissions,
    name: '# of submissions',
  },
  [SORTS.PRIZE_HIGH_TO_LOW]: {
    func: (a, b) => b.totalPrize - a.totalPrize,
    name: 'Prize high to low',
  },
  [SORTS.TIME_TO_REGISTER]: {
    func: (a, b) => {
      const getRegistrationEndDate = (challenge) => {
        // extract the registration phase from `challenge.phases`,
        // as `challenge.registrationEndDate` returned from API is not reliable
        const registrationPhase = find(challenge.phases, p => p.name === 'Registration');
        const submissionPhase = find(challenge.phases, p => p.name === 'Submission');
        // case 1: registration phase exists
        if (registrationPhase) {
          return moment(phaseEndDate(registrationPhase));
        }
        // case 2: registration phase doesn't exist. Take submission phase instead.
        return moment(phaseEndDate(submissionPhase));
      };

      const aDate = getRegistrationEndDate(a);
      const bDate = getRegistrationEndDate(b);

      if (aDate.isBefore() && bDate.isAfter()) return 1;
      if (aDate.isAfter() && bDate.isBefore()) return -1;
      if (aDate.isBefore() && bDate.isBefore()) return bDate.diff(aDate);

      return aDate.diff(bDate);
    },
    name: 'Time to register',
  },
  [SORTS.TIME_TO_SUBMIT]: {
    func: (a, b) => {
      function nextSubEndDate(challenge) {
        // extract the submission and checkpoint (if any) phases from `challenge.phases`,
        // as `challenge.submissionEndDate` returned from API is not reliable
        const checkpointPhase = find(challenge.phases, p => p.name === 'Checkpoint Submission');
        const submissionPhase = find(challenge.phases, p => p.name === 'Submission');
        // Case 1: challenge has checkpoint submission phase
        if (!!checkpointPhase === true) {
          // Case 1.1: checkpoint submission phase is still open.
          // then take the `scheduledEndDate` of this phase.
          // Case 1.2: checkpoint submission phase is closed
          // but its `scheduledStartDate` is a future date.
          // This means this phase is not yet started. Take the `scheduledEndDate` of this phase.
          if (checkpointPhase.isOpen || moment(checkpointPhase.scheduledStartDate).isAfter()) {
            return moment(checkpointPhase.scheduledEndDate);
          }
        }
        return moment(phaseEndDate(submissionPhase));
      }

      const aDate = nextSubEndDate(a);
      const bDate = nextSubEndDate(b);

      if (aDate.isBefore() && bDate.isAfter()) return 1;
      if (aDate.isAfter() && bDate.isBefore()) return -1;
      if (aDate.isBefore() && bDate.isBefore()) return bDate.diff(aDate);

      return aDate.diff(bDate);
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
