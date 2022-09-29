import React from 'react';

import { Link, config } from 'topcoder-react-utils';
import './style.scss';
import NotFoundIcon from 'assets/images/icon-not-found.svg';

const base = config.URL.BASE;

function NoRecommenderChallengeCard() {
  return (
    <div styleName="container">
      <div styleName="icon">
        <NotFoundIcon />
      </div>
      <span styleName="text-header">
        NO VERIFIED SKILLS ON YOUR PROFILE
      </span>
      <span styleName="text">
        Your recommended competitions are based on your Verified Skills.
        Competing in <Link styleName="challenge-link" to={`${base}/challenges`}>competitions</Link> is a great way to earn them.
      </span>
    </div>
  );
}

export default NoRecommenderChallengeCard;
