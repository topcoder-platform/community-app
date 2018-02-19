import PT from 'prop-types';
import React from 'react';

import Option from './Option';

import './style.scss';

export default function Header({ numChallenges }) {
  let myChallengesTitle = 'My Active Challenges';
  if (numChallenges) myChallengesTitle += ` (${numChallenges})`;

  return (
    <div styleName="container">
      <Option selected title={myChallengesTitle} />
      <Option title="Communities" />
      <Option title="SRMs" />
    </div>
  );
}

Header.propTypes = {
  numChallenges: PT.number.isRequired,
};
