import moment from 'moment';
import config from 'utils/config';

export default [
  {
    name: 'All Challenges',
    allIncluded: true,
    sortingOptions: ['Most recent'],
  },
  {
    name: 'My challenges',
    check(item) {
      return item.myChallenge;
    },
    sortingOptions: [
      'Most recent',
      'Time to submit',
      '# of registrants',
      '# of submissions',
      'Prize high to low',
      'Title A-Z',
    ],
    getApiUrl: (pageIndex, pageSize = 50) => (
      `${config.API.V2}/user/challenges?&pageIndex=${pageIndex}&pageSize=${pageSize}`
    ),
  },
  {
    name: 'Open for registration',
    check(item) {
      return item.registrationOpen.startsWith('Yes') && item.currentPhaseName
        && item.currentPhaseName.startsWith('Registration');
    },
    sortingOptions: [
      'Most recent',
      'Time to register',
      'Phase end time',
      '# of registrants',
      '# of submissions',
      'Prize high to low',
      'Title A-Z',
    ],
    info: {
      phaseName: 'registration',
    },
    getApiUrl: (pageIndex, pageSize = 50) => (
      `${config.API.V2}/challenges/open?pageIndex=${pageIndex}&pageSize=${pageSize}`
    ),
  },
  {
    name: 'Ongoing challenges',
    check(item) {
      return !item.registrationOpen.startsWith('Yes') && item.status === 'Active';
    },
    sortingOptions: [
      'Most recent',
      'Current phase',
      'Title A-Z',
      'Prize high to low',
    ],
    // this api endpoint probably doesn't match the filter criteria exactly
    // kept for reference
    // getApiUrl: (pageIndex, pageSize = 50) => (
    //   `http://api.topcoder.com/v2/challenges/active?pageIndex=${pageIndex}&pageSize=${pageSize}`
    // ),
  },
  {
    name: 'Past challenges',
    check(item) {
      return item.status === 'Completed';
    },
    sortingOptions: [
      'Most recent',
      'Title A-Z',
      'Prize high to low',
    ],
    getApiUrl: (pageIndex, pageSize = 50) => (
      `${config.API.V2}/challenges/past?pageIndex=${pageIndex}&pageSize=${pageSize}`
    ),
  },
  /**
  // Removed: sidebar link points to another page
  {
    name: 'Open for review',
    check(item) {
      return item.currentPhaseName === 'Review';
    },
    sortingOptions: [
      'Most recent',
      '# of registrants',
      '# of submissions',
      'Prize high to low',
      'Title A-Z',
    ],
    // No api endpoint available currently
    // the commented out api endpoint is most likely wrong
    // kept for reference
    // getApiUrl: (pageIndex, pageSize = 50) => {
    //   const yesterday = new Date();
    //   yesterday.setDate(yesterday.getDate() - 1);
    //   const yesterdayFormatted = yesterday.toJSON().slice(0, 10);
    //
    //   return `http://api.topcoder.com/v2/challenges/open?pageIndex=${pageIndex}&pageSize=${pageSize}&submissionEndTo=${yesterdayFormatted}`;
    // },
  },
  */
  {
    name: 'Upcoming challenges',
    check(item) {
      return moment(item.registrationStartDate) > moment();
    },
    sortingOptions: [
      'Most recent',
      'Title A-Z',
      'Prize high to low',
    ],
    getApiUrl: (pageIndex, pageSize = 50) => (
      `${config.API.V2}/challenges/upcoming?pageIndex=${pageIndex}&pageSize=${pageSize}`
    ),
  },
];
