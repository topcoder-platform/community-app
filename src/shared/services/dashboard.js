/**
 * This module provides a service for convenient manipulation with Topcoder
 * dashboard resources via TC API.
 */

import _ from 'lodash';

import { getApiV3 } from './api';

// following functions are adopted from topcoder-app repo to process subtrack ranks
function sortByDate(arr) {
  arr.sort((a, b) => {
    if (!(a.mostRecentSubmission || a.mostRecentEventDate)) return -1;
    if (!(b.mostRecentSubmission || b.mostRecentEventDate)) return 1;
    const aDate = new Date(a.mostRecentSubmission || a.mostRecentEventDate);
    const bDate = new Date(b.mostRecentSubmission || b.mostRecentEventDate);
    if (aDate > bDate) {
      return -1;
    } else if (aDate < bDate) {
      return 1;
    }
    return 0;
  });
}

function getRanks(s) {
  if (!s) {
    return [];
  }
  const stats = _.cloneDeep(s);
  let dev = [];
  let design = [];
  const dataScience = [];
  let copilot = [];

  if (stats.DEVELOP && stats.DEVELOP.subTracks) {
    dev = stats.DEVELOP.subTracks.map(subTrack => ({
      track: 'DEVELOP',
      subTrack: subTrack.name,
      rank: subTrack.rank ? subTrack.rank.overallRank : 0,
      rating: subTrack.rank ? subTrack.rank.rating || 0 : 0,
      wins: subTrack.wins,
      submissions: (subTrack.submissions && subTrack.submissions.submissions) || 0,
      mostRecentEventDate: new Date(subTrack.mostRecentEventDate),
      mostRecentSubmissionDate: new Date(subTrack.mostRecentSubmission),
    })).filter(
      subTrack => !(subTrack.subTrack === 'COPILOT_POSTING' && subTrack.track === 'DEVELOP'),
    );
  }
  // show # of wins for design
  if (stats.DESIGN && stats.DESIGN.subTracks) {
    design = stats.DESIGN.subTracks.map(subTrack => ({
      track: 'DESIGN',
      subTrack: subTrack.name,
      rank: false,
      challenges: subTrack.challenges,
      wins: subTrack.wins,
      submissions: (subTrack.submissions) || 0,
      mostRecentEventDate: new Date(subTrack.mostRecentEventDate),
      mostRecentSubmissionDate: new Date(subTrack.mostRecentSubmission),
    }));
  }
  if (stats.DATA_SCIENCE && stats.DATA_SCIENCE.SRM && stats.DATA_SCIENCE.SRM.rank) {
    const srmStats = stats.DATA_SCIENCE.SRM;
    dataScience.push({
      track: 'DATA_SCIENCE',
      subTrack: 'SRM',
      rank: srmStats.rank.rank,
      rating: srmStats.rank.rating,
      mostRecentEventDate: new Date(srmStats.rank.mostRecentEventDate),
      mostRecentSubmissionDate: new Date(srmStats.mostRecentSubmission),
    });
  }
  if (stats.DATA_SCIENCE && stats.DATA_SCIENCE.MARATHON_MATCH &&
    stats.DATA_SCIENCE.MARATHON_MATCH.rank) {
    const marathonStats = stats.DATA_SCIENCE.MARATHON_MATCH;
    dataScience.push({
      track: 'DATA_SCIENCE',
      subTrack: 'MARATHON_MATCH',
      rank: marathonStats.rank.rank,
      rating: marathonStats.rank.rating,
      mostRecentEventDate: new Date(marathonStats.rank.mostRecentEventDate),
      mostRecentSubmission: new Date(marathonStats.mostRecentSubmission),
    });
  }
  if (stats.COPILOT) {
    copilot = [
      stats.COPILOT,
    ];
    stats.COPILOT.track = 'COPILOT';
    stats.COPILOT.subTrack = 'COPILOT';
  }

  sortByDate(dev);
  sortByDate(design);
  sortByDate(dataScience);

  function removeRanklessNoSubmissions(arr) {
    return arr.filter(subTrack => subTrack &&
      ((subTrack.track === 'DESIGN' && subTrack.challenges) || subTrack.rank ||
        subTrack.rating || subTrack.wins || subTrack.fulfillment || subTrack.submissions));
  }

  const compiledStats = {
    DEVELOP: removeRanklessNoSubmissions(dev),
    DESIGN: removeRanklessNoSubmissions(design),
    DATA_SCIENCE: removeRanklessNoSubmissions(dataScience),
    COPILOT: copilot,
  };

  return compiledStats;
}


function compileSubtracks(trackRanks) {
  return _.reduce(trackRanks, (result, subtracks, track) => {
    if (_.isArray(subtracks) && subtracks.length) {
      if (track === 'DEVELOP') {
        const filtered = _.filter(
          subtracks, subtrackObj => subtrackObj.subTrack !== 'COPILOT_POSTING');
        return result.concat(filtered);
      }

      return result.concat(subtracks);
    }
    return result;
  }, []);
}

function processStatRank(r) {
  const rank = _.cloneDeep(r);
  rank.showStats = true;
  if (rank.track === 'DESIGN') {
    rank.stat = rank.wins;
    rank.statType = 'Wins';
    // for non rated tracks, use submissions to filter out empty values
    if (!rank.submissions) {
      rank.showStats = false;
    }
  } else if (rank.track === 'COPILOT') {
    rank.stat = rank.activeContests;
    rank.statType = 'Challenges';
  } else if (rank.track === 'DEVELOP') {
    if (['CODE', 'FIRST_2_FINISH', 'BUG_HUNT'].indexOf(rank.subTrack) !== -1) {
      rank.stat = rank.wins;
      rank.statType = 'Wins';
      // for non rated tracks, use submissions to filter out empty values
      if (!rank.submissions) {
        rank.showStats = false;
      }
    } else {
      rank.stat = rank.rating;
      rank.statType = 'Rating';
    }
  } else {
    rank.stat = rank.rating;
    rank.statType = 'Rating';
  }
  return rank;
}

function filterStats(ranks) {
  const filtered = [];
  _.forEach(ranks, (rank) => {
    if (rank.showStats) {
      filtered.push(rank);
    }
  });
  return filtered;
}

class DashboardService {

  /**
   * @param {String} tokenV3 Optional. Auth token for Topcoder API v3.
   */
  constructor(tokenV3) {
    this.private = {
      api: getApiV3(tokenV3),
      tokenV3,
    };
  }

  /**
   * retrieve user's subtrack stats and process them
   * @param  {string} handle user's handle
   * @return {Promise}       a promise that will resolve processed subtrank ranks
   */
  getSubtrackRanks(handle) {
    return this.private.api.get(`/members/${handle}/stats`)
      .then(res => (res.ok ? res.json() : new Error(res.statusText)))
      .then((res) => {
        if (res.result.status === 200) {
          const data = res.result.content;
          if (data && !data.DEVELOP) {
            data.DEVELOP = { challenges: 0, wins: 0, subTracks: [] };
          }
          if (data && !data.DESIGN) {
            data.DESIGN = { challenges: 0, wins: 0, subTracks: [] };
          }
          if (data && !data.DATA_SCIENCE) {
            data.DATA_SCIENCE = { challenges: 0, wins: 0, SRM: {}, MARATHON_MATCH: {} };
          }
          const trackRanks = getRanks(data);
          let subtrackRanks = compileSubtracks(trackRanks);

          subtrackRanks = _.map(subtrackRanks, rank => processStatRank(rank));
          // filter stats based on processing done above
          // filtering is a separate step to allow multiple
          // pre-processings and filter out in single call
          subtrackRanks = filterStats(subtrackRanks);
          return subtrackRanks;
        }
        return new Error(res.result.content);
      });
  }

  /**
   * retrieve user financial information
   * @param  {string} handle user's handle
   * @return {Promise}        a promise that will resolve user's financial infomation
   */
  getUserFinancials(handle) {
    return this.private.api.get(`/members/${handle}/financial/`)
    .then(res => (res.ok ? res.json() : new Error(res.statusText)))
    .then(res => (
      res.result.status === 200
        ? res.result.content
        : new Error(res.result.content)
    ));
  }
}

/**
 * Returns a new or existing challenges service.
 * @param {String} tokenV3 Optional. Auth token for Topcoder API v3.
 * @return {Challenges} Challenges service object
 */
let lastInstance = null;
export function getService(tokenV3) {
  if (!lastInstance || (tokenV3 && lastInstance.private.tokenV3 !== tokenV3)) {
    lastInstance = new DashboardService(tokenV3);
  }
  return lastInstance;
}

/* Using default export would be confusing in this case. */
export default undefined;
