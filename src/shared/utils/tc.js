/**
 * Collection of small Topcoder-related functions.
 */

import _ from 'lodash';
import jstz from 'jstimezonedetect';
import moment from 'moment-timezone';
import config from './config';

/**
 * Codes of the Topcoder communities.
 */
export const COMPETITION_TRACKS = {
  DATA_SCIENCE: 'datasci',
  DESIGN: 'design',
  DEVELOP: 'develop',
};

/**
 * Given a rating value, returns corresponding color.
 * @param {Number} rating Rating.
 * @return {String} Color.
 */
/* TODO: The actual color values below are taken from topcoder-app. Probably,
 * they don't match colors in the current Topcoder style guide. */
const RATING_COLORS = [{
  color: '#9D9FA0' /* Grey */,
  limit: 900,
}, {
  color: '#69C329' /* Green */,
  limit: 1200,
}, {
  color: '#616BD5' /* Blue */,
  limit: 1500,
}, {
  color: '#FCD617' /* Yellow */,
  limit: 2200,
}, {
  color: '#EF3A3A' /* Red */,
  limit: Infinity,
}];
export function getRatingColor(rating) {
  let i = 0; const r = Number(rating);
  while (RATING_COLORS[i].limit <= r) i += 1;
  return RATING_COLORS[i].color || 'black';
}

/**
 * Returns community meta data on server side
 *
 * This is used to mock API.
 * Basically it returns json files form directory
 * /src/server/tc-communities/{communityId}/metadata.json
 *
 * @param  {String}  communityId  id of community
 * @return {Object}               meta data
 */
export function getCommunitiesMetadata(communityId) {
  // we use constant process.env.FRONT_END directly instead of isClientSide from utils/isomporphy
  // because webpack can exclude code this way from bundle on frontend
  // otherwise it will try to resolve 'fs' and 'path' modules
  if (!process.env.FRONT_END) {
    /* eslint-disable global-require */
    const fs = require('fs');
    const path = require('path');
    /* eslint-enable global-require */

    return new Promise((resolve, reject) => {
      fs.readFile(path.resolve(__dirname, `../../server/tc-communities/${communityId}/metadata.json`), 'utf8', (err, data) => {
        if (err) {
          reject({ error: '404', communityId });
        } else {
          const metadata = JSON.parse(data);
          resolve(metadata);
        }
      });
    });
  }

  return null;
}

/**
 * Calculate the difference from now to a specified date
 * adopt from topcoder-app repo
 * @param  {Date} input the date to diff
 * @param  {string} type  type to retrieve
 * @return {number|string|array} diff info depends on the type
 */
export function timeDiff(input, type) {
  const fromNow = moment(input).fromNow(true);

  // Split into components: ['an', 'hour'] || ['2', 'months']
  const timeAndUnit = fromNow.split(' ');

  if (timeAndUnit[0] === 'a' || timeAndUnit[0] === 'an') {
    timeAndUnit[0] = '1';
  }
  if (type === 'quantity') {
    return timeAndUnit[0];
  } else if (type === 'unit') {
    return timeAndUnit[1];
  }
  return timeAndUnit;
}

/**
 * convert a date to specified local format
 * adopt from topcoder-app repo
 * @param  {Date} input    date to format
 * @param  {string} format date format
 * @return {string}        formated date string
 */
export function localTime(input, format) {
  const timezone = jstz.determine().name();
  return moment(input).tz(timezone).format(format || 'MM/DD/YY hh:mm a z');
}

/**
 * remove the underscore character of a string
 * adopt from topcoder-app repo
 * @param  {string} string string to process
 * @return {string}        processed string
 */
export function stripUnderscore(string) {
  const map = {
    ASSEMBLY_COMPETITION: 'ASSEMBLY',
  };
  if (map[string]) {
    return map[string];
  }
  if (!string) {
    return '';
  }
  return string.replace(/_/g, ' ');
}

/**
 * process active challenges to populate additional infomation
 * adopt from topcoder-app repo
 * @param  {array} challenges  challenges array to process
 * @return {array}            processed challenges array
 */
/* TODO: This function should be mixed into normalization function
 * of the challenges service. */
export function processActiveDevDesignChallenges(challenges) {
  return _.map(challenges, (c) => {
    const challenge = _.cloneDeep(c);
    const phases = challenge.currentPhases;
    let hasCurrentPhase = false;
    // If currentPhase is null, the challenge is stalled and there is no end time
    challenge.userCurrentPhase = 'Stalled';
    challenge.userCurrentPhaseEndTime = null;
    challenge.userAction = null;
    challenge.isSubmitter = false;

    if (phases && phases.length) {
      hasCurrentPhase = true;
      challenge.userCurrentPhase = phases[0].phaseType;
      challenge.userCurrentPhaseEndTime = phases[0].scheduledEndTime;
    }

    if (hasCurrentPhase && phases.length > 1) {
      _.forEach(challenge.currentPhases, (phase, index, currentPhases) => {
        if (phase.phaseType === 'Submission') {
          challenge.userAction = 'Submit';

          if (_.get(challenge, 'userDetails.hasUserSubmittedForReview', false)) {
            challenge.userCurrentPhase = phase.phaseType;
            challenge.userCurrentPhaseEndTime = phase.scheduledEndTime;
            challenge.userAction = 'Submitted';

            if (currentPhases[index + 1]) {
              challenge.userCurrentPhase = currentPhases[index + 1].phaseType;
              challenge.userCurrentPhaseEndTime = currentPhases[index + 1].scheduledEndTime;
              challenge.userAction = null;
            }
          }

          // if user has role of observer
          const roles = _.get(challenge, 'userDetails.roles', []);
          if (roles && roles.length > 0) {
            const submitterRole = _.findIndex(roles, (role) => {
              const lRole = role.toLowerCase();
              if (lRole === 'submitter') {
                challenge.isSubmitter = true;
              }
              return lRole === 'submitter';
            });
            if (submitterRole === -1) {
              challenge.userAction = null;
            }
          }
        }
      });
    }
    if (challenge.userCurrentPhase === 'Appeals') {
      challenge.userAction = 'Appeal';
    }

    if (challenge.userCurrentPhaseEndTime) {
      const fullTime = challenge.userCurrentPhaseEndTime;
      let timeAndUnit = moment(fullTime).fromNow(true);
      // Split into components: ['an', 'hour'] || ['2', 'months']
      timeAndUnit = timeAndUnit.split(' ');

      if (timeAndUnit[0] === 'a' || timeAndUnit[0] === 'an') {
        timeAndUnit[0] = '1';
      }

      // Add actual time ['2', 'months', actual date]
      timeAndUnit.push(fullTime);
      challenge.userCurrentPhaseEndTime = timeAndUnit;
      // If > 0 then the challenge has 'Late Deliverables' or
      challenge.isLate = moment().diff(fullTime) > 0;
    }
    return challenge;
  });
}

/**
 * process srm to populate additional infomation
 * adopt from topcoder-app repo
 * @param  {Object} s  srm to process
 * @return {Object}    processed srm
 */
export function processSRM(s) {
  const srm = _.cloneDeep(s);
  srm.userStatus = 'registered';
  if (Array.isArray(srm.rounds) && srm.rounds.length) {
    if (srm.rounds[0].userSRMDetails && srm.rounds[0].userSRMDetails.rated) {
      srm.result = srm.rounds[0].userSRMDetails;
    }
    if (srm.rounds[0].codingStartAt) {
      srm.codingStartAt = srm.rounds[0].codingStartAt;
    }
    if (srm.rounds[0].codingEndAt) {
      srm.codingEndAt = srm.rounds[0].codingEndAt;
    }
    if (srm.rounds[0].registrationStartAt) {
      srm.registrationStartAt = srm.rounds[0].registrationStartAt;
    }
    if (srm.rounds[0].registrationEndAt) {
      srm.registrationEndAt = srm.rounds[0].registrationEndAt;
    }
  }

  // determines if the current phase is registration
  let start = moment(srm.registrationStartAt).unix();
  let end = moment(srm.registrationEndAt).unix();
  let now = moment().unix();
  if (start <= now && end >= now) {
    srm.currentPhase = 'REGISTRATION';
  }
  // determines if the current phase is coding
  start = moment(srm.codingStartAt).unix();
  end = moment(srm.codingEndAt).unix();
  now = moment().unix();
  if (start <= now && end >= now) {
    srm.currentPhase = 'CODING';
  }
  return srm;
}

/**
 * calculate challenge related links depends on the type
 * adopt from topcoder-app repo
 * @param  {Object} challenge specified challenge
 * @param  {string} type      type of link
 * @return {string}           calculated link
 */
export function challengeLinks(challenge, type) {
  let data;
  if (challenge.subTrack === 'MARATHON_MATCH') {
    data = {
      roundId: challenge.rounds[0].id,
      forumId: challenge.rounds[0].forumId,
      componentId: _.get(challenge, 'componentId', ''),
      challengeId: challenge.id,
      problemId: _.get(challenge, 'problemId', ''),
    };
    switch (type) {
      case 'forums':
        return `${config.URL.FORUMS}/?module=ThreadList&forumID=${data.forumId}`;
      case 'registrants':
        return `${config.URL.COMMUNITY}/longcontest/?module=ViewRegistrants&rd=${data.roundId}`;
      case 'submit':
        return `${config.URL.COMMUNITY}/longcontest/?module=Submit&compid=${data.componentId}&rd=${data.roundId}&cd=${data.challengeId}`;
      case 'detail':
        if (challenge.status === 'PAST') {
          return `${config.URL.COMMUNITY}/longcontest/stats/?module=ViewOverview&rd=${data.roundId}`;
        }  // for all other statues (ACTIVE, UPCOMING), show the problem statement
        return `${config.URL.COMMUNITY}/longcontest/?module=ViewProblemStatement&pm=${data.problemId}&rd=${data.roundId}`;
      default:
        return '';
    }
  } else if (challenge.subTrack === 'SRM') {
    data = {
      roundId: challenge.rounds[0].id,
    };
    switch (type) {
      case 'detail':
        return `${config.URL.COMMUNITY}/stat?c=round_overview&rd=${data.roundId}`;
      default:
        return '';
    }
  } else {
    data = {
      track: challenge.track.toLowerCase(),
      forumId: challenge.forumId,
      id: challenge.id,
    };
    switch (type) {
      case 'forums':
        switch (challenge.track.toLowerCase()) {
          case 'develop':
            return `${config.URL.FORUMS}/?module=Category&categoryID=${data.forumId}`;
          case 'data':
            return `${config.URL.FORUMS}/?module=Category&categoryID=${data.forumId}`;
          case 'design':
            return `${config.URL.FORUMS}/?module=ThreadList&forumID=${data.forumId}`;
          default:
            return '';
        }
    /* eslint no-fallthrough:0 */
      case 'submissions':
        return `${config.URL.BASE}/challenge-details/${data.id}/?type=${data.track}#submissions`;
      case 'registrants':
        return `${config.URL.BASE}/challenge-details/${data.id}/?type=${data.track}#viewRegistrant`;
      case 'submit':// TODO use details link for submit, we can replace it with new submission page url
        return `${config.URL.BASE}/challenge-details/${data.id}/?type=${data.track}`;
      case 'detail':
        return `${config.URL.BASE}/challenge-details/${data.id}/?type=${data.track}`;
      case 'viewScorecards':
        return `${config.URL.ONLINE_REVIEW}/review/actions/ViewProjectDetails?pid=${data.id}`;
      case 'completeAppeals':
        return `${config.URL.ONLINE_REVIEW}/review/actions/EarlyAppeals?pid=${data.id}`;
      case 'unRegister':
        return `${config.URL.ONLINE_REVIEW}/review/actions/Unregister?pid=${data.id}`;
      default:
        return '';
    }
  }
}

export default undefined;
