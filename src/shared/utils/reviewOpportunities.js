/**
* Utility functions for Review Opportunities
*/
import _ from 'lodash';
import moment from 'moment';
import { REVIEW_OPPORTUNITY_TYPES } from './tc';

export const DEFAULT_ESTIMATED_SUBMISSIONS = 2;

export const calculateEstimatedReviewerPayment = (
  basePayment,
  incrementalPayment,
  estimatedSubmissions = DEFAULT_ESTIMATED_SUBMISSIONS,
) => {
  const base = _.toNumber(basePayment);
  const incremental = _.toNumber(incrementalPayment);
  const submissions = _.toNumber(estimatedSubmissions);

  if (_.isNaN(base) || _.isNaN(submissions)) {
    return null;
  }

  const incrementalValue = _.isNaN(incremental) ? 0 : incremental;
  return base + (submissions * incrementalValue);
};

export const withEstimatedReviewerPayments = (
  opportunity,
  estimatedSubmissions = DEFAULT_ESTIMATED_SUBMISSIONS,
) => {
  if (!opportunity) return opportunity;

  const estimatedPayment = calculateEstimatedReviewerPayment(
    _.get(opportunity, 'basePayment', _.get(opportunity, 'payments[0].payment')),
    _.get(opportunity, 'incrementalPayment', 0),
    estimatedSubmissions,
  );

  if (!_.isNumber(estimatedPayment)) {
    return opportunity;
  }

  const payments = Array.isArray(opportunity.payments)
    ? opportunity.payments.map(payment => ({
      ...payment,
      payment: estimatedPayment,
    }))
    : opportunity.payments;

  return {
    ...opportunity,
    payments,
  };
};

/**
 * Infers open positions using review opportunity details and organizes them by role
 *
 * @param {Object} details Review Opportuny details from API
 * @return {Array} List of roles with corresponding data
 */
export const openPositionsByRole = (details) => {
  if (!details.payments) return [];

  const detailsWithPayments = withEstimatedReviewerPayments(details);
  const payments = detailsWithPayments.payments || [];

  const roleCount = payments.length;

  let approved;
  if (details.applications && details.openPositions === 1 && roleCount === 2) {
    approved = details.applications.find(app => app.status === 'Approved').role;
  }

  const calcOpenPositions = (role) => {
    if (approved) {
      return role === approved ? 0 : 1;
    }
    return details.openPositions / roleCount;
  };

  return payments.map(({ role, roleId, payment }) => ({
    role,
    roleId,
    payment,
    termsOfUseId: '20704',
    openPositions: calcOpenPositions(role),
  }));
};

/**
 * Builds a list of roleIds of existing applications for user
 *
 * @param {Object} details Review Opportunity details from API
 * @param {String} handle Handle of the user
 * @return {Array} List of rolesIds
 */
export const activeRoleIds = (details, handle) => {
  const positions = openPositionsByRole(details);
  const apps = details.applications
    ? details.applications.filter(app => _.toString(app.handle) === _.toString(handle) && app.status !== 'CANCELLED') : [];
  return apps.map(app => positions.find(p => p.role === app.role).roleId);
};

export default null;

/**
 * Filter function for Review Opportunity Type, will be used internally in filter.js
 * @param {Object} opp Review Opportunity object
 * @param {Object} state Filter state
 * @return {Boolean} True if opp satifies the filter
 */
function filterByReviewOpportunityType(opp, state) {
  if (state.reviewOpportunityTypes.length === 0) return false;
  return state.reviewOpportunityTypes.includes(opp.type);
}

function filterByStartDate(challenge, state) {
  if (!state.startDate) return true;
  const submissionPhase = (challenge.phases || []).filter(d => d.name === 'Submission')[0];
  const submissionEndDate = submissionPhase ? submissionPhase.scheduledEndDate
    : challenge.submissionEndDate;
  return moment(state.startDate).isBefore(submissionEndDate);
}

function filterByEndDate(challenge, state) {
  if (!state.endDate) return true;
  const registrationPhase = (challenge.phases || []).filter(d => d.name === 'Registration')[0];
  const registrationStartDate = registrationPhase ? registrationPhase.scheduledStartDate
    : challenge.registrationStartDate;
  return moment(state.endDate).isAfter(registrationStartDate);
}

function filterByTags(challenge, state) {
  if (_.isEmpty(state.tags)) return true;
  const { platforms, tags } = challenge;
  const str = `${platforms.join(' ')} ${tags.join(' ')}`.toLowerCase();
  return state.tags.some(tag => str.includes(tag.toLowerCase()));
}

function filterByText(challenge, state) {
  if (!state.search) return true;
  const str = `${challenge.name} ${challenge.tags} ${challenge.platforms} ${challenge.tags}`
    .toLowerCase();
  return str.includes(state.search.toLowerCase());
}

function filterByTrack(challenge, state) {
  // if (!state.tracks) return true;
  // eslint-disable-next-line max-len
  return state.tracks[challenge.track] === true;
}

function filterByTypes(challenge, state) {
  if (state.types.length === 0) return true;
  return state.types.includes(challenge.typeId);
}

/**
 * Generates a Review Opportunities filter function for the provided filter state.
 * @param {Object} state
 * @return {Function}
 */
export const getReviewOpportunitiesFilterFunction = (state, validTypes) => (opp) => {
  const trackAbbr = {
    'Data Science': 'DS',
    Development: 'Dev',
    Design: 'Des',
    'Quality Assurance': 'QA',
  };

  const normalizedTrackMap = {
    DEVELOPMENT: 'Dev',
    DEVELOP: 'Dev',
    DEV: 'Dev',
    DESIGN: 'Des',
    DES: 'Des',
    'DATA SCIENCE': 'DS',
    DATA_SCIENCE: 'DS',
    DATASCIENCE: 'DS',
    QA: 'QA',
    'QUALITY ASSURANCE': 'QA',
    QUALITY_ASSURANCE: 'QA',
  };

  const { challengeData } = opp;

  // const newType = _.find(validTypes, { name: opp.challenge.type }) || {};
  const newType = _.find(validTypes, { name: challengeData.subTrack === 'FIRST_2_FINISH' ? 'First2Finish' : 'Challenge' }) || {};

  // Review Opportunity objects have a challenge field which
  // is largely compatible with many of the existing filter functions
  // especially after a few normalization tweaks
  const challenge = {
    ...challengeData,
    // This allows filterByText to search for Review Types and Challenge Titles
    name: `${challengeData.title} ${REVIEW_OPPORTUNITY_TYPES[opp.type]}`,
    // registrationStartDate: opp.startDate, // startDate of Review, not Challenge
    // submissionEndDate: opp.startDate, // Currently uses startDate for both date comparisons
    // communities: new Set([ // Used to filter by Track, and communities at a future date
    // opp.challenge.track === 'QA' ? 'Dev' : trackAbbr[opp.challenge.track],
    // ]),
    track: normalizedTrackMap[(challengeData.track || '').toString().trim().toUpperCase()]
      || trackAbbr[challengeData.track]
      || challengeData.track,
    typeId: newType.abbreviation,
    tags: challengeData.technologies || [],
    platforms: challengeData.platforms || [],
  };
  return (
    filterByTrack(challenge, state)
      && filterByText(challenge, state)
      && filterByTags(challenge, state)
      && filterByTypes(challenge, state)
      && filterByEndDate(challenge, state)
      && filterByStartDate(challenge, state)
      && filterByReviewOpportunityType(opp, state)
  );
};
