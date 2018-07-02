/*
  Component to show the prize details for given challenge.
*/
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { range } from 'lodash';

import './style.scss';

function getOrdinal(num) {
  const ordinals = ['th', 'st', 'nd', 'rd'];
  const v = num % 100;
  return ordinals[(v - 20) % 10] || ordinals[v] || ordinals[0];
}

export default function Prizes({ pointPrizes, prizes }) {
  const prizeLength = Math.max(pointPrizes.length, prizes.length);
  return (
    <div styleName="prizes-container">
      {
        _.range(prizeLength).map((index) => {
          const rank = index + 1;
          const pair = [];
          if (!_.isUndefined(prizes[index])) pair.push(prizes[index].toLocaleString());
          if (!_.isUndefined(pointPrizes[index])) pair.push(`${pointPrizes[index]}pts`);
          return (
            <div key={rank} styleName="prize-fill">
              <div id={`rank${rank}`} styleName="prize-card">
                <p styleName="prize-rank">
                  {rank}
                  <span styleName="rank-ordinal">
                    {getOrdinal(rank)}
                  </span>
                </p>
                <p styleName="prize-money">
                  {
                    !_.isUndefined(prizes[index]) && (
                    <span styleName="prize-currency">
                      $
                    </span>
                    )
                  }
                  {pair.join(' + ')}
                </p>
              </div>
            </div>
          );
        })
      }
    </div>
  );
}

Prizes.defaultProps = {
  pointPrizes: [],
  prizes: [],
};

Prizes.propTypes = {
  pointPrizes: PT.arrayOf(PT.number),
  prizes: PT.arrayOf(PT.number),
};
