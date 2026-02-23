/*
  Component to show the prize details for given challenge.
*/
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import './style.scss';

const FUN_CHALLENGE_PRIZE_LABEL = 'No individual prize - leaderboard scoring';

function getOrdinal(num) {
  const ordinals = ['th', 'st', 'nd', 'rd'];
  const v = num % 100;
  return ordinals[(v - 20) % 10] || ordinals[v] || ordinals[0];
}

export default function Prizes({ isFunChallenge, pointPrizes, prizes }) {
  if (isFunChallenge) {
    return (
      <div styleName="prizes-container">
        <p styleName="fun-challenge-prize">
          {FUN_CHALLENGE_PRIZE_LABEL}
        </p>
      </div>
    );
  }

  const prizeLength = Math.max(pointPrizes.length, prizes.length);
  return (
    <div styleName="prizes-container">
      {
        _.range(prizeLength).map((index) => {
          const rank = index + 1;
          const pair = [];
          const isPrizeIndexNotUndefined = !_.isUndefined(prizes[index])
            && !_.isUndefined(prizes[index].value);

          // Deal with point based prize displays, in addition to monetary prizes
          if (isPrizeIndexNotUndefined && prizes[index].type === 'USD') {
            pair.push(`$${prizes[index].value.toLocaleString()}`);
          } else if (isPrizeIndexNotUndefined && prizes[index].type === 'POINT') {
            // Handle a single prize point, so the display isn't plural
            if (prizes[index].value === 1) {
              pair.push(`${prizes[index].value}pt`);
            } else {
              pair.push(`${prizes[index].value}pts`);
            }
          }

          return (
            <div
              styleName="prize-fill"
              key={rank}
            >
              {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
              <div id={`rank${rank}`} tabIndex={0} styleName="prize-card" aria-label={`${rank}${getOrdinal(rank)} prize is ${!_.isUndefined(prizes[index]) ? '$' : ''}${pair.join(' + ')}`}>
                <p styleName="prize-rank" aria-hidden="true">
                  {rank}
                  <span styleName="rank-ordinal">
                    {getOrdinal(rank)}
                  </span>
                </p>
              </div>
              <p styleName="prize-money" aria-hidden="true">
                {pair.join(' + ')}
              </p>
            </div>
          );
        })
      }
    </div>
  );
}

Prizes.defaultProps = {
  isFunChallenge: false,
  pointPrizes: [],
  prizes: [],
};

Prizes.propTypes = {
  isFunChallenge: PT.bool,
  pointPrizes: PT.arrayOf(PT.number),
  prizes: PT.arrayOf(PT.shape()),
};
