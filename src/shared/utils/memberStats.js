import _ from 'lodash';
import moment from 'moment/moment';
import { config } from 'topcoder-react-utils';

/**
 * check whether graph is needed.
 * @param track
 * @param subTrack
 * @returns {boolean}
 */
export const shouldShowGraph = ({ track, subTrack }) => {
  switch (track) {
    case 'DATA_SCIENCE':
      return true;
    case 'DEVELOP':
      switch (subTrack) {
        case 'UI_PROTOTYPE_COMPETITION':
        case 'ASSEMBLY_COMPETITION':
        case 'DESIGN':
        case 'DEVELOPMENT':
        case 'ARCHITECTURE':
        case 'TEST_SCENARIOS':
        case 'CONTENT_CREATION':
        case 'SPECIFICATION':
        case 'RIA_BUILD_COMPETITION':
        case 'CODE':
          return true;
        default:
          return false;
      }
    default:
      return false;
  }
};

/**
 * calculate division data based on stats.
 * @param stats
 * @returns {{division1, division2, challenges}}
 */
export const getDivisions = (stats) => {
  function toObject(_array) {
    const array = _array || [];
    const ans = {};
    ans.total = {
      problemsSuccessful: 0,
      problemsFailed: 0,
      problemsSubmitted: 0,
      problemsSysByTest: 0,
    };
    array.forEach((_level) => {
      const level = _level;
      level.problemsFailed = level.problemsFailed || level.failedChallenges || 0;
      level.problemsSubmitted = level.problemsSubmitted || level.challenges || 0;
      level.problemsSuccessful = (level.problemsSubmitted - level.problemsFailed
        - (level.problemsSysByTest || 0)) || 0;
      level.percentSuccessful = (level.problemsSuccessful / (level.problemsSubmitted || 1)) || 0;
      ans.total.problemsSuccessful
        += level.problemsSuccessful || (level.challenges - level.failedChallenges) || 0;
      ans.total.problemsFailed += level.problemsFailed || level.failedChallenges || 0;
      ans.total.problemsSubmitted += level.problemsSubmitted || level.challenges || 0;
      ans.total.problemsSysByTest += level.problemsSysByTest || 0;
      ans[level.levelName] = level;
    });
    ans.total.percentSuccessful = (ans.total.problemsSuccessful
      / (ans.total.problemsSubmitted || 1)) || 0;
    ans.levels = [];
    if (ans['Level One']) ans.levels.push(ans['Level One']);
    if (ans['Level Two']) ans.levels.push(ans['Level Two']);
    if (ans['Level Three']) ans.levels.push(ans['Level Three']);
    return ans;
  }

  return {
    division1: toObject(stats.division1),
    division2: toObject(stats.division2),
    challenges: toObject(stats.challengeDetails),
  };
};

/**
 * get history data from stats
 * @param stats
 * @param track
 * @param subTrack
 * @returns {*}
 */
export function getHistory(stats, track, subTrack) {
  switch (track) {
    case 'DEVELOP':
      return _.get(stats, [track, 'subTracks'], []).find(({ name }) => name === subTrack);
    case 'DATA_SCIENCE':
      return _.get(stats, [track, subTrack]);
    default:
      return {};
  }
}


// NOTE: perserve the legacy format func for future reference
const percentageFunc = n => `${(n * 100).toFixed(2)}%`;
// const percentageFunc = n => `${(n * 100).toFixed(0)}%`;
// const formatWithDecimalFunc = n => `${n.toFixed(2)}%`; // fixed issue #1011
const formatWithDecimalFunc = n => `${n.toFixed(1).replace(/\.0$/, '')}%`;
const percentileFunc = n => `${n.toFixed(1).replace(/\.0$/, '')}%`;
// const ratingFunc = n => n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const ratingFunc = n => n.toFixed(0);
const defaultRenderFunc = n => n.toFixed(0);
const formatPlacement = n => n.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');


const interestingData = {
  DESIGN: [
    { key: 'wins', label: 'wins', postFunc: null },
    { key: 'challenges', label: 'challenges', postFunc: null },
    { key: 'winPercent', label: 'percentile', postFunc: percentileFunc },
    { key: 'screeningSuccessRate', label: 'Screening Success Rate', postFunc: percentileFunc },
    { key: 'avgPlacement', label: 'Average Placement', postFunc: formatPlacement },
  ],
  DEVELOP: [
    { key: 'rank.rating', label: 'rating', postFunc: ratingFunc },
    { key: 'rank.overallRank', label: 'rank', postFunc: null },
    { key: 'rank.overallPercentile', label: 'percentile', postFunc: percentileFunc },
    { key: 'wins', label: 'wins', postFunc: null },
    { key: 'submissions.submissions', label: 'challenges', postFunc: null },
    // { key: 'rank.reliability', label: 'reliability', postFunc: percentageFunc },
  ],
  'DATA_SCIENCE.SRM': [
    { key: 'rank.rating', label: 'rating', postFunc: ratingFunc },
    { key: 'rank.rank', label: 'rank', postFunc: null },
    { key: 'rank.percentile', label: 'percentile', postFunc: percentileFunc },
    { key: 'challenges', label: 'competitions', postFunc: null },
    { key: 'rank.volatility', label: 'volatility', postFunc: null },
  ],
  'DATA_SCIENCE.MARATHON_MATCH': [
    { key: 'rank.rating', label: 'rating', postFunc: ratingFunc },
    { key: 'rank.rank', label: 'rank', postFunc: null },
    { key: 'rank.percentile', label: 'percentile', postFunc: percentileFunc },
    { key: 'wins', label: 'wins', postFunc: null },
  ],
  COPILOT: [
    { key: 'activeContests', label: 'active challenges', postFunc: null },
    { key: 'activeProjects', label: 'active projects', postFunc: null },
    { key: 'contests', label: 'total challenges', postFunc: null },
    { key: 'projects', label: 'total projects', postFunc: null },
    { key: 'fulfillment', label: 'fulfillment', postFunc: formatWithDecimalFunc },
  ],
};

/**
 * get subTrackStats from stats
 * @param stats
 * @param track
 * @param subTrack
 * @returns {*}
 */
export function getSubTrackStats(stats, track, subTrack) {
  if (track === 'COPILOT') {
    return _.get(stats, 'COPILOT', null);
  } if (track === 'DATA_SCIENCE') {
    // data science stats are nested in a funky way
    return _.get(stats, `DATA_SCIENCE.${subTrack}`, null);
  }

  const subTrackStats = _.get(stats, `${track}.subTracks`, []);
  return _.find(subTrackStats, n => n.name === subTrack);
}

/**
 * get stats summary from stats
 * @param stats
 * @param track
 * @param subTrack
 * @returns {Array}
 */
export function getSummary(stats, track, subTrack) {
  const obj = getSubTrackStats(stats, track, subTrack);

  // no stats to iterate over
  if (!obj) {
    return [];
  }
  // For each type of track retrieve the more interesting
  let data;
  switch (track) {
    case 'DATA_SCIENCE':
      data = interestingData[`${track}.${subTrack}`];
      break;
    default:
      data = interestingData[track];
      break;
  }
  const iterStats = [];
  data.forEach((k) => {
    let value = _.get(obj, k.key);
    if (_.isNumber(value)) {
      value = k.postFunc ? k.postFunc(value) : defaultRenderFunc(value);
    }
    iterStats.push({ label: k.label, value });
  });
  return iterStats;
}

/**
 * get stats detail from stats
 * @param stats
 * @param track
 * @param subTrack
 * @returns {*}
 */
export function getDetails(stats, track, subTrack) {
  const obj = getSubTrackStats(stats, track, subTrack);
  // no stats to iterate over
  if (!obj) {
    return [];
  }
  let detailConfig = [];
  switch (track) {
    case 'DEVELOP':
      switch (subTrack) {
        case 'FIRST_2_FINISH':
        case 'BUG_BUNT':
          detailConfig = [
            {
              key: 'submissions.winPercent',
              label: 'Win Percentage',
              render: percentageFunc,
            },
            {
              key: 'submissions.submissionRate',
              label: 'Submission Rate',
              render: percentageFunc,
            },
            {
              key: 'submissions.screeningSuccessRate',
              label: 'Screening Success Rate',
              render: percentageFunc,
            },
            {
              key: 'submissions.reviewSuccessRate',
              label: 'Review Success Rate',
              render: percentageFunc,
            },
            {
              key: 'submissions.appealSuccessRate',
              label: 'Appeals Success Rate',
              render: percentageFunc,
            },
            {
              key: 'submissions.avgPlacement',
              label: 'Average Placement',
              render: x => x.toFixed(2),
            },
          ];
          break;
        case 'UI_PROTOTYPE_COMPETITION':
        case 'ASSEMBLY_COMPETITION':
        case 'CODE':
        default:
          detailConfig = [
            {
              key: 'submissions.winPercent',
              label: 'Win Percentage',
              render: percentageFunc,
            },
            {
              key: 'rank.overallCountryRank',
              label: 'Country Rank',
              render: x => x,
            },
            {
              key: 'rank.volatility',
              label: 'Volatility',
              render: x => x,
            },
            {
              key: 'rank.maxRating',
              label: 'Maximum Rating',
              render: x => x,
            },
            {
              key: 'submissions.submissionRate',
              label: 'Submission Rate',
              render: percentageFunc,
            },
            {
              key: 'submissions.screeningSuccessRate',
              label: 'Screening Success Rate',
              render: percentageFunc,
            },
            {
              key: 'submissions.reviewSuccessRate',
              label: 'Review Success Rate',
              render: percentageFunc,
            },
            {
              key: 'submissions.appealSuccessRate',
              label: 'Appeals Success Rate',
              render: percentageFunc,
            },
            {
              key: 'submissions.avgPlacement',
              label: 'Average Placement',
              render: x => x.toFixed(2),
            },
          ];
          break;
      }
      break;
    case 'DATA_SCIENCE':
      if (subTrack === 'MARATHON_MATCH') {
        detailConfig = [
          {
            key: 'rank.countryRank',
            label: 'Country Rank',
            render: x => (x || '-'),
          },
          {
            key: 'rank.volatility',
            label: 'Volatility',
            render: defaultRenderFunc,
          },
          {
            key: 'rank.maximumRating',
            label: 'Maximum Rating',
            render: defaultRenderFunc,
          },
          {
            key: 'rank.bestRank',
            label: 'Best Rank',
            render: defaultRenderFunc,
          },
          {
            key: 'wins',
            label: 'Wins',
            render: defaultRenderFunc,
          },
          {
            key: 'rank.topFiveFinishes',
            label: 'Top Five Finishes',
            render: defaultRenderFunc,
          },
          {
            key: 'rank.topTenFinishes',
            label: 'Top Ten Finishes',
            render: defaultRenderFunc,
          },
          {
            key: 'rank.avgRank',
            label: 'Average Rank',
            render: defaultRenderFunc,
          },
          {
            key: 'rank.avgNumSubmissions',
            label: 'Average # Submissions',
            render: defaultRenderFunc,
          },
          {
            key: 'rank.competitions',
            label: 'Competitions',
            render: defaultRenderFunc,
          },
          {
            key: 'mostRecentEventDate',
            label: 'Most Recent Event',
            render: d => moment(d).format('MMMM D, YYYY'),
          },
        ];
      } else if (subTrack === 'SRM') {
        return getDivisions(obj);
      }
      break;
    case 'DESIGN':
      detailConfig = [
        {
          key: 'winPercent',
          label: 'Win Percentage',
          render: percentageFunc,
        },
        {
          key: 'submissionRate',
          label: 'Submission Rate',
          render: percentageFunc,
        },
        {
          key: 'screeningSuccessRate',
          label: 'Screening Success Rate',
          render: percentageFunc,
        },
        {
          key: 'avgPlacement',
          label: 'Average Placement',
          render: x => x.toFixed(2),
        },
      ];
      break;
    default:
      break;
  }

  return detailConfig.map(({ key, label, render }) => {
    let value = _.get(obj, key);
    if (_.isNumber(value) || render !== defaultRenderFunc) {
      value = render(value);
    }
    return { label, value };
  });
}

/**
 * check the track and subTract combination
 * @param track
 * @param subTrack
 * @returns {boolean}
 */
export function isValidTrack(track, subTrack) {
  switch (track) {
    case 'DATA_SCIENCE':
      switch (subTrack) {
        case 'SRM':
        case 'MARATHON_MATCH':
          return true;
        default:
          return false;
      }
    case 'COPILOT':
      return subTrack === 'COPILOT';
    case 'DEVELOP':
      switch (subTrack) {
        case 'UI_PROTOTYPE_COMPETITION':
        case 'ASSEMBLY_COMPETITION':
        case 'FIRST_2_FINISH':
        case 'BUG_HUNT':
        case 'CODE':
        case 'DESIGN_FIRST_2_FINISH':
        case 'DESIGN':
        case 'DEVELOPMENT':
        case 'ARCHITECTURE':
        case 'CONCEPTUALIZATION':
        case 'TEST_SCENARIOS':
        case 'CONTENT_CREATION':
        case 'TEST_SUITES':
        case 'SPECIFICATION':
        case 'RIA_BUILD_COMPETITION':
        case 'WEB_DESIGNS': // Some data in the db is wrong and returns the following under DEVELOP
        case 'WIDGET_OR_MOBILE_SCREEN_DESIGN':
        case 'APPLICATION_FRONT_END_DESIGN':
        case 'PRINT_OR_PRESENTATION':
        case 'IDEA_GENERATION':
        case 'WIREFRAMES':
        case 'LOGO_DESIGN':
        case 'BANNERS_OR_ICONS':
        case 'STUDIO_OTHER':
        case 'FRONT_END_FLASH':
          return true;
        default:
          return false;
      }
    case 'DESIGN':
      switch (subTrack) {
        case 'WEB_DESIGNS':
        case 'WIDGET_OR_MOBILE_SCREEN_DESIGN':
        case 'DESIGN_FIRST_2_FINISH':
        case 'APPLICATION_FRONT_END_DESIGN':
        case 'PRINT_OR_PRESENTATION':
        case 'IDEA_GENERATION':
        case 'WIREFRAMES':
        case 'LOGO_DESIGN':
        case 'BANNERS_OR_ICONS':
        case 'STUDIO_OTHER':
        case 'FRONT_END_FLASH':
          return true;
        default:
          return false;
      }
    default:
      return false;
  }
}

/**
 * Checks if only public stats should be loaded for the provided community.
 */
export function loadPublicStatsOnly(meta) {
  const communityId = _.get(meta, 'communityId');
  return communityId != null
  && _.find(config.URL.SUBDOMAIN_PROFILE_CONFIG, { communityId }) != null;
}

export default {
  shouldShowGraph,
  getDivisions,
  getHistory,
  getSubTrackStats,
  getSummary,
  getDetails,
  isValidTrack,
  loadPublicStatsOnly,
};
