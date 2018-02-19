/**
 * Child component of Dashboard/Header renders summary of user achievements,
 * money earned and number of active challenges. Also renders special badges
 * based of acheivement data.
*/
import React from 'react';
import PT from 'prop-types';

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
  'SRM Winner Div 1': 'srmWinnerDiv1',
  'SRM Winner Div 2': 'srmWinnerDiv2',
  'Studio Cup Top Five': 'studioCupTopFive',
  'Studio Cup Winner': 'studioCupWinner',
  'Studio Mentor': 'studioMentor',
  'Studio Reviewer': 'studioReviewer',
  'Studio Screener': 'studioScreener',
  'Studio Spec Reviewer': 'studioSpecReviewer',
  'Studio Spirit': 'studioSpirit',
  'TopCoder Reviewer': 'topcoderReviewer',
};

export default function Header(props) {
  const { achievements } = props;

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
              title={description}
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
};
