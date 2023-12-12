/**
 * Helper function for challenge detail
 */
import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import { convertNow as convertMoney } from 'services/money';
import { challenge as challengeUtils } from 'topcoder-react-lib';
import { config } from 'topcoder-react-utils';
import Prize from 'components/challenge-listing/ChallengeCard/Prize';
import { BUCKETS, getBuckets } from 'utils/challenge-listing/buckets';
import { phaseEndDate } from 'utils/challenge-listing/helper';

const Filter = challengeUtils.filter;

// Constants
export const PRIZE_MODE = {
  HIDDEN: 'hidden',
  MONEY_EUR: 'money-eur',
  MONEY_INR: 'money-inr',
  MONEY_USD: 'money-usd',
};

/**
 * Get challenge type abbreviation
 * @param {Object} challenge challenge info
 */
export function getChallengeTypeAbbr(track, challengeTypes) {
  const type = _.find(challengeTypes, { name: track });
  if (type) {
    return type.abbreviation;
  }
  return null;
}

/**
 * Get end date
 * @param {Object} challenge challenge info
 */
export function getEndDate(challenge) {
  const { type } = challenge;
  let phases = challenge.phases || [];
  if (type === 'First2Finish' && challenge.status === 'Completed') {
    phases = challenge.phases.filter(p => p.phaseType === 'Iterative Review' && p.phaseStatus === 'Closed');
  }
  const endPhaseDate = Math.max(...phases.map(d => phaseEndDate(d)));
  return moment(endPhaseDate).format('MMM DD');
}

export function isRegistrationPhase(phase) {
  return phase.name === 'Registration';
}

/**
 * Generates human-readable string containing time till the phase end.
 * @param {Object} phase phase need to check
 * @param {String} toGoText togo text
 */
export function getTimeLeft(
  phase,
  toGoText = 'to go',
  fullText = false,
) {
  const STALLED_TIME_LEFT_MSG = 'Challenge is currently on hold';
  const REGISTRATION_PHASE_MESSAGE = 'Register';
  const FF_TIME_LEFT_MSG = 'Winner is working on fixes';
  const HOUR_MS = 60 * 60 * 1000;
  const DAY_MS = 24 * HOUR_MS;

  if (!phase) return { late: false, text: STALLED_TIME_LEFT_MSG, canTrimText: false };
  if (isRegistrationPhase(phase)) {
    return { late: false, text: REGISTRATION_PHASE_MESSAGE, canTrimText: false };
  }
  if (phase.phaseType === 'Final Fix') {
    return { late: false, text: FF_TIME_LEFT_MSG, canTrimText: false };
  }

  let time = moment(phaseEndDate(phase)).diff();
  const late = time < 0;
  if (late) time = -time;

  let format;
  if (time > DAY_MS) format = fullText ? 'D [day] H [hour]' : 'D[d] H[h]';
  else if (time > HOUR_MS) format = fullText ? 'H [hour] m [minute]' : 'H[h] m[min]';
  else format = fullText ? 'm [minute] s [second]' : 'm[min] s[s]';

  time = moment.duration(time).format(format);
  time = late ? `${time} Past Due` : `${time} ${toGoText}`;
  return { late, text: time, canTrimText: true };
}

/**
 * Get prize purse ui
 * @param {Object} challenge challenge info
 * @param {String} prizeMode prize mode
 * @param {String} onlyShowTooltipForPrize only show tooltip for prize
 * @param {String} label label for prize
 */
export function getPrizePurseUI(
  challenge,
  prizeMode,
  onlyShowTooltipForPrize = false,
  label = 'Purse',
) {
  /* Preparation of data to show in the prize component,
   * depending on options. */
  const bonuses = [];
  if (challenge.reliabilityBonus) {
    bonuses.push({
      name: 'Reliability',
      prize: challenge.reliabilityBonus,
    });
  }

  let prizeUnitSymbol = '';
  let { prizes } = challenge;
  let totalPrize;
  switch (prizeMode) {
    case PRIZE_MODE.MONEY_EUR:
      prizeUnitSymbol = '€';
      bonuses.forEach((bonus) => {
        bonus.prize = Math.round(convertMoney(bonus.prize, 'EUR')); // eslint-disable-line no-param-reassign
      });
      totalPrize = Math.round(convertMoney(challenge.totalPrize, 'EUR'));
      prizes = (prizes || []).map(prize => Math.round(convertMoney(prize, 'EUR')));
      break;
    case PRIZE_MODE.MONEY_INR:
      prizeUnitSymbol = '₹';
      bonuses.forEach((bonus) => {
        bonus.prize = Math.round(convertMoney(bonus.prize, 'INR')); // eslint-disable-line no-param-reassign
      });
      totalPrize = Math.round(convertMoney(challenge.totalPrize, 'INR'));
      prizes = (prizes || []).map(prize => Math.round(convertMoney(prize, 'INR')));
      break;
    case PRIZE_MODE.MONEY_USD:
      prizeUnitSymbol = '$';
      ({ totalPrize } = challenge);
      break;
    default: throw new Error('Unknown prize mode!');
  }

  if (totalPrize > 1) {
    return (
      <Prize
        bonuses={bonuses}
        label={label}
        prizes={prizes}
        prizeUnitSymbol={prizeUnitSymbol}
        totalPrize={totalPrize}
        onlyShowTooltipForPrize={onlyShowTooltipForPrize}
      />
    );
  }
  return null;
}

/**
 * Get prize points ui
 * @param {Object} challenge challenge info
 */
export function getPrizePointsUI(challenge) {
  const placementPrizes = _.find(challenge.prizeSets, { type: 'placement' });
  

  if (placementPrizes) {
    const { prizes } = placementPrizes || [];
    let prizeUnitSymbol = "$"
    let purseLabel = "Purse"
    // Handle a points based prize (CORE-107)
    if(prizes[0].type === "POINT"){
      prizeUnitSymbol = ""
      purseLabel = "Points"
    }
    return (
      <Prize
        label={purseLabel}
        prizes={prizes}
        prizeUnitSymbol= {prizeUnitSymbol}
        totalPrize={prizes.reduce((acc, prize) => acc + prize.value, 0)}
      />
    );
  }
  return null;
}

/**
 * Get recommended tags for challenge
 * @param {Object} challenge challenge info
 */
export function getRecommendedTags(challenge) {
  let recommendedTag = '';
  _.forEach(challenge.tags, (tag) => {
    if (!recommendedTag && tag.toLowerCase() !== 'other') {
      recommendedTag = tag;
    }
  });
  return recommendedTag;
}

/**
 * Get display recommended challenge
 * @param {Object} challenge challenge info
 * @param {Object} recommendedChallenges all recommended challenges
 * @param {Object} auth authentication object
 */
export function getDisplayRecommendedChallenges(
  challenge,
  recommendedChallenges,
  auth,
) {
  const first = (array, n) => {
    if (array == null || n == null) {
      return array[0];
    }
    if (n < 0) {
      return [];
    }
    return array.slice(0, n);
  };

  const recommendedTag = getRecommendedTags(challenge);
  const displayRecommendedChallenges = recommendedChallenges[recommendedTag]
    ? recommendedChallenges[recommendedTag].challenges : [];
  const filterParams = getBuckets(null)[BUCKETS.OPEN_FOR_REGISTRATION].filter;
  const userId = _.get(auth.user, 'userId');
  const filter = Filter.getFilterFunction(filterParams);

  let results = _.filter(displayRecommendedChallenges, (c) => {
    let isValid = filter(c);
    if (isValid && userId) {
      isValid = c.id !== challenge.id && !c.users[userId];
    }
    return isValid;
  });
  results = first(
    results,
    config.CHALLENGE_DETAILS_MAX_NUMBER_RECOMMENDED_CHALLENGES,
  );
  return results;
}

export default getEndDate;

/**
 * Format number to ordinals.
 * @param {Number} n
 */
export const formatOrdinals = (n) => {
  let ord = '';
  switch (n) {
    case '1': ord = '1st';
      break;
    case '2': ord = '2nd';
      break;
    case '3': ord = '3rd';
      break;
    default:
      ord = `${n}th`;
  }

  return ord;
};

/**
 * Format number to currency format.
 * @param {Number} n
 */
export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
