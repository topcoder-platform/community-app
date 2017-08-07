import React from 'react';
import PT from 'prop-types';
import Bonus from './Bonus';
import Prize from './Prize';
import './style.scss';

export default function Tip({
  bonuses,
  prizes,
  prizeUnitSymbol,
}) {
  const prizesRender = prizes.map((prize, index) => {
    const place = 1 + index;
    return (
      <Prize
        key={`${place}-${prize}`}
        place={place}
        prize={prize}
        prizeUnitSymbol={prizeUnitSymbol}
      />
    );
  });

  const bonusesRender = bonuses.map(item => (
    <Bonus
      key={item.name}
      name={item.name}
      prize={item.prize}
      prizeUnitSymbol={prizeUnitSymbol}
    />
  ));

  return (
    <div styleName="prizes-tooltip">
      <div style={{ overflow: 'auto' }}>
        <h1>Prizes</h1>
        {prizesRender}
      </div>
      <div styleName="bonuses">
        <h1>Bonuses</h1>
        {bonusesRender}
      </div>
    </div>
  );
}

Tip.defaultProps = {
  isLoaded: false,
};

Tip.propTypes = {
  bonuses: PT.arrayOf(PT.object).isRequired,
  prizes: PT.arrayOf(PT.number).isRequired,
  prizeUnitSymbol: PT.string.isRequired,
};
