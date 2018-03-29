/**
 * Child component of Dashboard/Header renders summary of user achievements,
 * money earned and number of active challenges. Also renders special badges
 * based of acheivement data.
*/
import React from 'react';
import PT from 'prop-types';

import BadgePredixCommunity from
  'assets/images/dashboard/badge-predix-community.png';
import BadgeSrmEngagementHonor from
  'assets/images/dashboard/badge-srm-engagement-honor.png';
import BadgeTco17Champion from
  'assets/images/dashboard/badge-tco17-gold.svg';
import BadgeTco17Finalist from
  'assets/images/dashboard/badge-tco17-finalist.svg';

import Badge from './Badge';

import './styles.scss';

const MAP = {
  'Algorithm Target': 'algorithmTarget',
  'CoECI Client Badge': 'coEciClientBadge',
  'Crowd for Good': 'crowdForGood',
  'Designer of the Month': 'designerOfTheMonth',
  'Digital Run Top Five': 'digitalRunTopFive',
  'Digital Run Winner': 'digitalRunWinner',
  'iOS Community': 'iosCommunity',
  'Marathon Match Winner': 'marathonMatchWinner',
  'Member of the Month': 'memberOfTheMonth',
  'Predix Community': 'predixCommunity',
  'Solved Hard Div1 Problem in SRM': 'solvedHardDiv1ProblemInSrm',
  'Solved Hard Div2 Problem in SRM': 'solvedHardDiv2ProblemInSrm',
  'SRM Engagement Honor': 'srmEngagementHonor',
  'SRM Winner Div 1': 'srmWinnerDiv1',
  'SRM Winner Div 2': 'srmWinnerDiv2',
  'Studio Cup Top Five': 'studioCupTopFive',
  'Studio Cup Winner': 'studioCupWinner',
  'Studio Mentor': 'studioMentor',
  'Studio Reviewer': 'studioReviewer',
  'Studio Screener': 'studioScreener',
  'Studio Spec Reviewer': 'studioSpecReviewer',
  'Studio Spirit': 'studioSpirit',
  'TCO17 Champion': 'tco17Champion',
  'TCO17 Finalist': 'tco17Finalist',
  'TopCoder Reviewer': 'topcoderReviewer',
};

/* Holds the mapping between achievement names and optional XL size badges. */
const XL_MAP = {
  'Predix Community': BadgePredixCommunity,
  'SRM Engagement Honor': BadgeSrmEngagementHonor,
  'TCO17 Champion': <BadgeTco17Champion styleName="xlBadge" />,
  'TCO17 Finalist': <BadgeTco17Finalist styleName="xlBadge" />,
};

export default function Header(props) {
  const {
    achievements,
    showXlBadge,
    xlBadge,
  } = props;
  const badges = achievements.filter(x => MAP[x.description]);
  return (
    <div styleName="container">
      <h1 styleName="title">Dashboard</h1>
      <div styleName="badges">
        {
          badges.map(({ description }) => (
            <Badge
              badge={MAP[description]}
              key={description}
              showXl={show => showXlBadge(show && description)}
              title={description}
              xlBadge={xlBadge === description && XL_MAP[xlBadge]}
            />
          ))
        }
      </div>
    </div>
  );
}

Header.defaultProps = {
  achievements: [],
};

Header.propTypes = {
  achievements: PT.arrayOf(PT.object),
  showXlBadge: PT.func.isRequired,
  xlBadge: PT.string.isRequired,
};
