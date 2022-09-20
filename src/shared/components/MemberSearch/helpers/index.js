import _ from 'lodash';

// Member Levels
export function memberLevelByRating(userRating) {
  const levelRatings = [0, 900, 1200, 1500, 2200];

  const userLevel = _.findLastIndex(levelRatings, (rating) => {
    if (userRating >= rating) {
      return true;
    }
    return false;
  });

  if (userLevel === -1) return 1;

  return userLevel + 1;
}

export function memberColorByLevel(userLevel) {
  const colorsByLevel = {
    1: '#A3A3AD',
    2: '#25C089',
    3: '#666EFF',
    4: '#FCB816',
    5: '#E6175C',
  };

  const color = colorsByLevel[userLevel] || colorsByLevel[1];

  return color;
}

// Process member skills
export function sortSkillsByScoreAndTag(skills, tag, numSkillsToReturn = Infinity) {
  if (_.isEmpty(skills)) return [];

  const sortedSkills = _.orderBy(skills, 'score', 'desc');

  // If the user has the tag, move it to the front
  if (tag) {
    const tagIndex = _.findIndex(sortedSkills, skill => skill.name === tag.name);

    if (tagIndex !== -1) {
      const tagSkill = sortedSkills.splice(tagIndex, 1)[0];
      tagSkill.searchedTag = true;

      sortedSkills.unshift(tagSkill);
    }
  }

  return sortedSkills.slice(0, numSkillsToReturn);
}

// Subtrack Abbreviations
export function getSubtrackAbbreviation(subtrack) {
  const subtrackAbbreviations = {
    APPLICATION_FRONT_END_DESIGN: 'FE',
    ARCHITECTURE: 'Ar',
    ASSEMBLY_COMPETITION: 'As',
    BANNERS_OR_ICONS: 'BI',
    BUG_HUNT: 'BH',
    CODE: 'Cd',
    COMPONENT_PRODUCTION: 'Cp',
    CONCEPTUALIZATION: 'Cn',
    CONTENT_CREATION: 'CC',
    COPILOT: 'FS',
    COPILOT_POSTING: 'CP',
    DEPLOYMENT: 'Dp',
    DESIGN: 'Ds',
    DESIGN_FIRST_2_FINISH: 'F2F',
    DEVELOP_MARATHON_MATCH: 'MM',
    DEVELOPMENT: 'Dv',
    FIRST_2_FINISH: 'F2F',
    FRONT_END_FLASH: 'Fl',
    GENERIC_SCORECARDS: 'G',
    IDEA_GENERATION: 'IG',
    LOGO_DESIGN: 'Lg',
    MARATHON_MATCH: 'MM',
    PRINT_OR_PRESENTATION: 'PP',
    PROCESS: 'Ps',
    REPORTING: 'Rp',
    RIA_BUILD_COMPETITION: 'RB',
    RIA_COMPONENT_COMPETITION: 'RC',
    SECURITY: 'Sc',
    SPEC_REVIEW: 'SR',
    SPECIFICATION: 'SPC',
    SRM: 'SRM',
    STUDIO_OTHER: 'O',
    TEST_SCENARIOS: 'Ts',
    TEST_SUITES: 'TS',
    TESTING_COMPETITION: 'Tg',
    UI_PROTOTYPE_COMPETITION: 'Pr',
    WEB_DESIGNS: 'Wb',
    WIDGET_OR_MOBILE_SCREEN_DESIGN: 'Wg',
    WIREFRAMES: 'Wf',
  };

  const abbreviation = subtrackAbbreviations[subtrack] || 'O';

  return abbreviation;
}

export function getSubtrackStat(subtrackStats) {
  if (subtrackStats.fulfillment) {
    return {
      value: subtrackStats.fulfillment,
      type: 'fulfillment',
    };
  }

  const subtrackRating = _.get(subtrackStats, 'rank.rating');

  if (subtrackRating) {
    return {
      value: subtrackRating,
      type: 'rating',
    };
  }

  return {
    value: subtrackStats.wins || 0,
    type: 'wins',
  };
}

// Subtrack filtering
export function getMostRecentSubtracks(userStatsByTrack, numResults = Infinity) {
  let subtrackStats = [];

  // If a user is a copilot with > 10 challenges and > 80% fulfillment,
  // add it to the list of subtracks
  const hasQualifyingFulfillment = _.get(userStatsByTrack, 'COPILOT.fulfillment', 0) >= 80;
  const hasQualifyingNumChallenges = _.get(userStatsByTrack, 'COPILOT.contests', 0) >= 10;

  if (hasQualifyingFulfillment && hasQualifyingNumChallenges) {
    subtrackStats.push({
      track: 'COPILOT',
      name: 'COPILOT',
      stat: getSubtrackStat(userStatsByTrack.COPILOT),
    });
  }

  // Process subtracks in Data Science
  const marathonMatchStats = _.get(userStatsByTrack, 'DATA_SCIENCE.MARATHON_MATCH', {});
  const SRMStats = _.get(userStatsByTrack, 'DATA_SCIENCE.SRM', {});

  if (marathonMatchStats.mostRecentEventDate) {
    subtrackStats.push({
      track: 'DATA_SCIENCE',
      name: 'MARATHON_MATCH',
      mostRecentEventDate: marathonMatchStats.mostRecentEventDate,
      stat: getSubtrackStat(marathonMatchStats),
    });
  }

  if (SRMStats.mostRecentEventDate) {
    subtrackStats.push({
      track: 'DATA_SCIENCE',
      name: 'SRM',
      mostRecentEventDate: SRMStats.mostRecentEventDate,
      stat: getSubtrackStat(SRMStats),
    });
  }

  // Process subtracks in Develop and Design
  const designSubtracks = _.get(userStatsByTrack, 'DESIGN.subTracks', []);
  const developSubtracks = _.get(userStatsByTrack, 'DEVELOP.subTracks', []);

  designSubtracks.forEach((subtrack) => {
    if (subtrack.mostRecentEventDate) {
      subtrackStats.push({
        track: 'DESIGN',
        name: subtrack.name,
        mostRecentEventDate: subtrack.mostRecentEventDate,
        stat: getSubtrackStat(subtrack),
      });
    }
  });

  developSubtracks.forEach((subtrack) => {
    if (subtrack.mostRecentEventDate) {
      subtrackStats.push({
        track: 'DEVELOP',
        name: subtrack.name,
        mostRecentEventDate: subtrack.mostRecentEventDate,
        stat: getSubtrackStat(subtrack),
      });
    }
  });

  // Filter out all subtracks with a value of 0 (wins, rating, etc.)
  subtrackStats = subtrackStats.filter(stat => stat.stat.value !== 0);

  const sortedSubtracks = subtrackStats
    .sort((a, b) => b.mostRecentEventDate - a.mostRecentEventDate);

  return sortedSubtracks.slice(0, numResults);
}

// Detect end of the page on scroll
export function isEndOfScreen(callback, ...callbackArguments) {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 400) {
    callback(...callbackArguments);
  }
}

// Miscellaneous helpers
export function getRoundedPercentage(number) {
  if (_.isFinite(number)) {
    const roundedNumber = Math.round(number);

    return `${roundedNumber}%`;
  }

  return '';
}

export function numberWithCommas(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function singlePluralFormatter(num, noun) {
  switch (num) {
    case 0:
    case undefined:
    case null:
      return '';
    case 1:
      return `1 ${noun}`;
    default:
      return `${num} ${noun}s`;
  }
}

export function getSearchTagPreposition(tagType) {
  switch (tagType.toUpperCase()) {
    case 'SKILL':
      return 'in';
    case 'COUNTRY':
      return 'from';
    case 'EVENT':
      return 'at the';
    default:
      return 'in';
  }
}

/**
 * Get Initials from handle
 * @param {String} handle
 * @returns {String} user initials
 */
export const getInitials = (handle) => {
  const names = handle.split(' ');
  let initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};
