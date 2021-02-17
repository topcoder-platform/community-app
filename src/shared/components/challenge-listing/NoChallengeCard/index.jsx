/**
 * Component for rendering a Review Opportunity and associated Challenge
 * information.  Will be contained within a Bucket.
 */
import React from 'react';

import './style.scss';
import ComputerIcon from 'assets/images/icon-computer.svg';

function NoChallengeCard() {
  return (
    <div styleName="container">
      <div styleName="icon">
        <ComputerIcon />
      </div>
      <span styleName="text">
        There are no challenges open for registration at the moment that match your skills. <br />
        Try exploring other challenges or checking back later.
      </span>
    </div>
  );
}

NoChallengeCard.defaultProps = {
};

NoChallengeCard.propTypes = {
};

export default NoChallengeCard;
