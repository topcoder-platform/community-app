/*
  Component to show the prize details for given challenge.
*/

import React from 'react';
import PT from 'prop-types';

import './style.scss';

function getOrdinal(num) {
  const ordinals = ['th', 'st', 'nd', 'rd'];
  const v = num % 100;
  return ordinals[(v - 20) % 10] || ordinals[v] || ordinals[0];
}

export default function Prizes({ prizes }) {
  return (
    <div styleName="prizes-container">
      {
        (prizes && prizes.length) ?
          prizes.map((prize, index) => {
            if (!prize) return null;
            const rank = index + 1;
            return (
              <div key={rank} styleName="prize-fill">
                <div id={`rank${rank}`} styleName="prize-card">
                  <p styleName="prize-rank">
                    {rank}
                    <span styleName="rank-ordinal">{getOrdinal(rank)}</span>
                  </p>
                  <p styleName="prize-money">
                    <span styleName="prize-currency">$</span>
                    {prize}
                  </p>
                </div>
              </div>
            );
          })
          : <div />
      }
    </div>
  );
}

Prizes.propTypes = {
  prizes: PT.arrayOf(PT.number).isRequired,
};
