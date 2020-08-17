import React from 'react';
import PT from 'prop-types';

import { stripUnderscore } from 'utils/tc';
import { config } from 'topcoder-react-utils';

import './IosCard.scss';

const IosCard = (props) => {
  const { challenge } = props;
  const { legacy } = challenge;
  const { track, forumId } = legacy;
  return (
    <div styleName={`challenge tile-view ${track}`}>
      <div styleName="challenge-track" />
      <header>
        <div>
          <a href={`${config.URL.BASE}/challenge-details/${challenge.id}/?type=${track}`} styleName="name">
            <span>
              {challenge.name}
            </span>
          </a>
          <p styleName="subtrack-color">
            {stripUnderscore(challenge.subTrack)}
          </p>
        </div>
        <div styleName="challenge-links">
          <div styleName="stats">
            <a href={`${config.URL.BASE}/challenge-details/${challenge.id}/?type=${track}#viewRegistrant`} styleName="registrants">
              <div styleName="registrants-icon" />
              <p>
                {challenge.numOfRegistrants}
              </p>
            </a>
            <a href={`${config.URL.BASE}/challenge-details/${challenge.id}/?type=${track}#submissions`} styleName="submissions">
              <div styleName="submissions-icon" />
              <p>
                {challenge.numOfSubmissions}
              </p>
            </a>
          </div>
          <a href={`${config.URL.FORUMS}/?module=Category&categoryID=${forumId}`} styleName="forum">
            <div styleName="forum-icon" />
            <p>
              Posts
            </p>
          </a>
        </div>
      </header>
      <div styleName="challenge-details">
        <p styleName="currentPhase">
          {challenge.userCurrentPhase}
        </p>
        {
          challenge.userCurrentPhaseEndTime
          && (
          <div styleName="challenge-calendar">
            <p>
              Ends In
            </p>
            <p styleName="time-remaining">
              {challenge.userCurrentPhaseEndTime[0]}
            </p>
            <p styleName="unit-of-time">
              {challenge.userCurrentPhaseEndTime[1]}
            </p>
          </div>
          )
        }
        {
          !challenge.userCurrentPhaseEndTime
          && (
          <div styleName="stalled-challenge">
            This challenge is currently paused.
          </div>
          )
        }
        {
          challenge.reviewType === 'PEER'
          && (
          <p styleName="prize-money">
            Peer Review Challenge
          </p>
          )
        }
        {
          challenge.reviewType !== 'PEER'
          && (
          <p styleName="prize-money">
            {`$${(challenge.totalPrize || 0).toLocaleString()}`}
          </p>
          )
        }
        <p styleName="technologies">
          {challenge.tags}
        </p>
      </div>
    </div>
  );
};

IosCard.propTypes = {
  challenge: PT.shape().isRequired,
};

export default IosCard;
