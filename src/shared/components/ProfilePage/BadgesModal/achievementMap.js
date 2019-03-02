/**
 * Functions that map the simple achievement descriptions provided by API
 * to data that allows the achievement badges to be rendered.
 *
 * Copied and adapted from topcoder-app
 */
import moment from 'moment';

const groupAchievements = [
  {
    id: 1,
    groupClass: 'Forum-Posts',
    specificAchievements: [
      {
        name: 'First Forum Post',
        active: false,
        specificClass: 'Forum-Posts-1',
      },
      {
        name: 'One Hundred Forum Posts',
        active: false,
        specificClass: 'Forum-Posts-100',
      },
      {
        name: 'Five Hundred Forum Posts',
        active: false,
        specificClass: 'Forum-Posts-500',
      },
      {
        name: 'One Thousand Forum Posts',
        active: false,
        specificClass: 'Forum-Posts-1000',
      },
      {
        name: 'Five Thousand Forum Posts',
        active: false,
        specificClass: 'Forum-Posts-5000',
      },
    ],
  },
  {
    id: 89,
    groupClass: 'Rated-SRMs',
    specificAchievements: [
      {
        name: 'First Rated Algorithm Competition',
        active: false,
        specificClass: 'Rated-SRMs-1',
      },
      {
        name: 'Five Rated Algorithm Competitions',
        active: false,
        specificClass: 'Rated-SRMs-5',
      },
      {
        name: 'Twenty Five Rated Algorithm Competitions',
        active: false,
        specificClass: 'Rated-SRMs-25',
      },
      {
        name: 'One Hundred Rated Algorithm Competitions',
        active: false,
        specificClass: 'Rated-SRMs-100',
      },
      {
        name: 'Three Hundred Rated Algorithm Competitions',
        active: false,
        specificClass: 'Rated-SRMs-300',
      },
    ],
  },
  {
    id: 94,
    groupClass: 'SRM-Room-Wins',
    specificAchievements: [
      {
        name: 'First SRM Room Win (Any Division)',
        active: false,
        specificClass: 'SRM-Room-Wins-1',
      },
      {
        name: 'Five SRM Room Wins (Any Division)',
        active: false,
        specificClass: 'SRM-Room-Wins-5',
      },
      {
        name: 'Twenty SRM Room Wins (Any Division)',
        active: false,
        specificClass: 'SRM-Room-Wins-20',
      },
      {
        name: 'Fifty SRM Room Wins (Any Division)',
        active: false,
        specificClass: 'SRM-Room-Wins-50',
      },
      {
        name: 'One Hundred SRM Room Wins (Any Division)',
        active: false,
        specificClass: 'SRM-Room-Wins-100',
      },
    ],
  },
  {
    id: 99,
    groupClass: 'Solved-SRM-Problems',
    specificAchievements: [
      {
        name: 'First Solved Algorithm Problem',
        active: false,
        specificClass: 'Solved-SRM-Problems-1',
      },
      {
        name: 'Ten Solved Algorithm Problems',
        active: false,
        specificClass: 'Solved-SRM-Problems-10',
      },
      {
        name: 'Fifty Solved Algorithm Problems',
        active: false,
        specificClass: 'Solved-SRM-Problems-50',
      },
      {
        name: 'Two Hundred Solved Algorithm Problems',
        active: false,
        specificClass: 'Solved-SRM-Problems-200',
      },
      {
        name: 'Five Hundred Solved Algorithm Problems',
        active: false,
        specificClass: 'Solved-SRM-Problems-500',
      },
    ],
  },
  {
    id: 104,
    groupClass: 'Successful-Challenges',
    specificAchievements: [
      {
        name: 'First Successful Challenge',
        active: false,
        specificClass: 'Successful-Challenges-1',
      },
      {
        name: 'Five Successful Challenges',
        active: false,
        specificClass: 'Successful-Challenges-5',
      },
      {
        name: 'Twenty Five Successful Challenges',
        active: false,
        specificClass: 'Successful-Challenges-25',
      },
      {
        name: 'One Hundred Successful Challenges',
        active: false,
        specificClass: 'Successful-Challenges-100',
      },
      {
        name: 'Two Hundred Successful Challenges',
        active: false,
        specificClass: 'Successful-Challenges-250',
      },
    ],
  },
  {
    id: 113,
    groupClass: 'Marathon-Matches',
    specificAchievements: [
      {
        name: 'First Marathon Competition',
        active: false,
        specificClass: 'Marathon-Matches-1',
      },
      {
        name: 'Three Marathon Competitions',
        active: false,
        specificClass: 'Marathon-Matches-3',
      },
      {
        name: 'Ten Marathon Competitions',
        active: false,
        specificClass: 'Marathon-Matches-10',
      },
      {
        name: 'Twenty Marathon Competitions',
        active: false,
        specificClass: 'Marathon-Matches-20',
      },
      {
        name: 'Fifty Marathon Competitions',
        active: false,
        specificClass: 'Marathon-Matches-50',
      },
    ],
  },
  {
    id: 117,
    groupClass: 'Marathon-Top-5-Placements',
    specificAchievements: [
      {
        name: 'First Marathon Top-5 Placement',
        active: false,
        specificClass: 'Marathon-Top-5-Placements-1',
      },
      {
        name: 'Two Marathon Top-5 Placements',
        active: false,
        specificClass: 'Marathon-Top-5-Placements-2',
      },
      {
        name: 'Four Marathon Top-5 Placements',
        active: false,
        specificClass: 'Marathon-Top-5-Placements-4',
      },
      {
        name: 'Eight Marathon Top-5 Placements',
        active: false,
        specificClass: 'Marathon-Top-5-Placements-8',
      },
      {
        name: 'Sixteen Marathon Top-5 Placements',
        active: false,
        specificClass: 'Marathon-Top-5-Placements-16',
      },
    ],
  },
  {
    id: 6,
    groupClass: 'Passing-Submissions',
    specificAchievements: [
      {
        name: 'First Passing Submission',
        active: false,
        specificClass: 'Passing-Submissions-1',
      },
      {
        name: 'Fifty Passing Submissions',
        active: false,
        specificClass: 'Passing-Submissions-50',
      },
      {
        name: 'One Hundred Passing Submissions',
        active: false,
        specificClass: 'Passing-Submissions-100',
      },
      {
        name: 'Two Hundred And Fifty Passing Submissions',
        active: false,
        specificClass: 'Passing-Submissions-250',
      },
      {
        name: 'Five Hundred Passing Submissions',
        active: false,
        specificClass: 'Passing-Submissions-500',
      },
    ],
  },
  {
    id: 11,
    groupClass: 'Checkpoint-Prizes',
    specificAchievements: [
      {
        name: 'First Milestone Prize',
        active: false,
        specificClass: 'Checkpoint-Prizes-1',
      },
      {
        name: 'Fifty Milestone Prizes',
        active: false,
        specificClass: 'Checkpoint-Prizes-50',
      },
      {
        name: 'One Hundred Milestone Prizes',
        active: false,
        specificClass: 'Checkpoint-Prizes-100',
      },
      {
        name: 'Two Hundred And Fifty Milestone Prizes',
        active: false,
        specificClass: 'Checkpoint-Prizes-250',
      },
      {
        name: 'Five Hundred Milestone Prizes',
        active: false,
        specificClass: 'Checkpoint-Prizes-500',
      },
    ],
  },
  {
    id: 16,
    groupClass: 'Winning-Placements',
    specificAchievements: [
      {
        name: 'First Placement',
        active: false,
        specificClass: 'Winning-Placements-1',
      },
      {
        name: 'Twenty Five Placements',
        active: false,
        specificClass: 'Winning-Placements-25',
      },
      {
        name: 'Fifty Placements',
        active: false,
        specificClass: 'Winning-Placements-50',
      },
      {
        name: 'One hundred Placements',
        active: false,
        specificClass: 'Winning-Placements-100',
      },
      {
        name: 'Two Hundred And Fifty Placements',
        active: false,
        specificClass: 'Winning-Placements-250',
      },
    ],
  },
  {
    id: 21,
    groupClass: 'First-Place-Wins',
    specificAchievements: [
      {
        name: 'First Win',
        active: false,
        specificClass: 'First-Place-Wins-1',
      },
      {
        name: 'Twenty Five First Placement Win',
        active: false,
        specificClass: 'First-Place-Wins-25',
      },
      {
        name: 'Fifty First Placement Win',
        active: false,
        specificClass: 'First-Place-Wins-50',
      },
      {
        name: 'One Hundred First Placement Win',
        active: false,
        specificClass: 'First-Place-Wins-100',
      },
      {
        name: 'Two Hundred And Fifty First Placement Win',
        active: false,
        specificClass: 'First-Place-Wins-250',
      },
    ],
  },
  {
    id: 0,
    groupClass: 'HP-Badges-Level-1',
    specificAchievements: [
      {
        name: 'Getting Started',
        active: false,
        specificClass: 'Getting-Started',
      },
      {
        name: 'Novice',
        active: false,
        specificClass: 'Novice',
      },
      {
        name: 'Journeyman',
        active: false,
        specificClass: 'Journeyman',
      },
      {
        name: 'Expert',
        active: false,
        specificClass: 'Expert',
      },
    ],
  },
  {
    id: 0,
    groupClass: 'HP-Badges-Level-2',
    specificAchievements: [
      {
        name: 'Master',
        active: false,
        specificClass: 'Master',
      },
      {
        name: 'Grand Master',
        active: false,
        specificClass: 'Grand-Master',
      },
      {
        name: 'Paragon',
        active: false,
        specificClass: 'Paragon',
      },
      {
        name: 'Grand Paragon',
        active: false,
        specificClass: 'Grand-Paragon',
      },
      {
        name: 'Social Evangelist',
        active: false,
        specificClass: 'Social-Evangelist',
      },
    ],
  },
];

const singleAchievements = [
  {
    id: 121,
    name: 'Marathon Match Winner',
    groupClass: 'Marathon-Match-Winner',
    active: false,
  },
  {
    id: 122,
    name: 'Algorithm Target',
    groupClass: 'Algorithm-Target',
    active: false,
  },
  {
    id: 119,
    name: 'SRM Winner Div 1',
    groupClass: 'SRM-Winner-Div-1',
    active: false,
  },
  {
    id: 120,
    name: 'SRM Winner Div 2',
    groupClass: 'SRM-Winner-Div-2',
    active: false,
  },
  {
    id: 127,
    name: 'Solved Hard Div2 Problem in SRM',
    groupClass: 'Solved-Hard-Div2-Problem-in-SRM',
    active: false,
  },
  {
    id: 126,
    name: 'Solved Hard Div1 Problem in SRM',
    groupClass: 'Solved-Hard-Div1-Problem-in-SRM',
    active: false,
  },
  {
    id: 51,
    name: 'Digital Run Winner',
    groupClass: 'Digital-Run-Winner',
    active: false,
  },
  {
    id: 52,
    name: 'Digital Run Top Five',
    groupClass: 'Digital-Run-Top-5',
    active: false,
  },
  {
    id: 1,
    name: 'Two Hundred Successful Challenges',
    groupClass: 'Successful-Challenges-200',
    active: false,
  },
  {
    id: 129,
    name: 'CoECI Client Badge',
    groupClass: 'CoECI-Client-Badge',
    active: false,
  },
  {
    id: 0,
    name: 'TopCoder Reviewer',
    groupClass: 'TopCoder-Reviewer',
    active: false,
  },
  {
    id: 1000,
    name: 'Studio Reviewer',
    groupClass: 'Studio-Reviewer',
    active: false,
  },
  {
    id: 1000,
    name: 'Studio Cup Top Five',
    groupClass: 'Studio-Cup-Top-5',
    active: false,
  },
  {
    id: 1001,
    name: 'Studio Cup Winner',
    groupClass: 'Studio-Cup-Winner',
    active: false,
  },
  {
    id: 1002,
    name: 'Studio Spec Reviewer',
    groupClass: 'Studio-Spec-Reviewer',
    active: false,
  },
  {
    id: 1003,
    name: 'Studio Screener',
    groupClass: 'Studio-Screener',
    active: false,
  },
  {
    id: 1003,
    name: 'Studio Spirit',
    groupClass: 'Studio-Spirit',
    active: false,
  },
  {
    id: 1004,
    name: 'Studio Mentor',
    groupClass: 'Studio-Mentor',
    active: false,
  },
  {
    id: 1005,
    name: 'Member of the Month',
    groupClass: 'Member-of-the-Month',
    active: false,
  },
  {
    id: 1006,
    name: 'Designer of the Month',
    groupClass: 'Member-of-the-Month',
    active: false,
  },
  {
    id: 1007,
    name: 'Crowd for Good',
    groupClass: 'Crowd-for-Good',
    active: false,
  },
  {
    id: 1008,
    name: 'Predix Community',
    groupClass: 'Predix-Community',
    active: false,
  },
  {
    id: 1009,
    name: 'iOS Community',
    groupClass: 'iOS-Community',
    active: false,
  },
  {
    id: 1010,
    name: 'TCO17 Finalist',
    groupClass: 'TCO17-Finalist',
    active: false,
  },
  {
    id: 1011,
    name: 'TCO17 Champion',
    groupClass: 'TCO17-Champion',
    active: false,
  },
  {
    id: 1012,
    name: 'TCO18 Finalist',
    groupClass: 'TCO18-Finalist',
    active: false,
  },
];

/**
 * Returns a copy of the base groupAchievements map updated with data
 * from api
 *
 * @param {Array} achievements List of a member's achievements from API
 * @return {Array} Achievements map with provided achievements set to active
 */
export const getGroupAchievements = achievements => groupAchievements.map(group => ({
  ...group,
  specificAchievements: group.specificAchievements.map((specific) => {
    const found = achievements.filter(a => a.description === specific.name);
    if (found.length > 0) {
      const date = found.map(a => a.date)
        .reduce((earliest, current) => (moment(current).isBefore(earliest) ? current : earliest));
      const specificClass = found.isStudio ? `Studio-${specific.specificClass}` : specific.specificClass;
      return {
        ...specific, active: true, date, specificClass,
      };
    }
    return specific;
  }),
})).filter(group => group.specificAchievements[0] && group.specificAchievements[0].active);

  /**
   * Returns a copy of the base singleAchievements map updated with data
   * from api
   *
   * @param {Array} achievements List of a member's achievements from API (may be normalized first)
   * @return {Array} Achievements map with provided achievements set to active
   */
export const getSingleAchievements = achievements => singleAchievements.map((single) => {
  const found = achievements.find(a => a.description === single.name);
  if (found) {
    const groupClass = found.isStudio ? `Studio-${single.groupClass}` : single.groupClass;
    return {
      ...single, active: true, date: found.date, groupClass,
    };
  }
  return single;
}).filter(single => single.active);

/**
 * Returns a copy of the achievements data with some normalization tweaks
 *
 * @param {Array} achievements List of a member's achievements from API
 * @return {Array} Achievements with corrected description and isStudio flag
 */
export const normalizeAchievements = achievements => achievements.map((achievement) => {
  let desc = achievement.description;
  let isStudio = false;

  const studioText = desc.indexOf('Studio');
  if (studioText !== -1) {
    isStudio = true;
    if (studioText === 0) {
      desc = desc.substring(7);
    }
  }

  if (desc === 'Fifty Milestone Prize' || desc === 'One Hundred Milestone Prize' || desc === 'Two Hundred And Fifty Milestone Prize') {
    desc += 's';
  }

  if (desc.indexOf('Designer of the Month') !== -1) {
    desc = 'Designer of the Month';
  }

  if (desc.indexOf('Member of the Month') !== -1) {
    desc = 'Member of the Month';
    isStudio = false;
  }

  return { ...achievement, description: desc, isStudio };
});
