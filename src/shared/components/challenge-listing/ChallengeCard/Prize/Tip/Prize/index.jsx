import PT from 'prop-types';
import React from 'react';
import './style.scss';

/**
 * A single prise component.
 * It renders a round-shaped medal with the specified place number inside it,
 * and the prize, formatted as currency, next to it.
 */

const getOrdinal = (num) => {
  const ordinals = ['th', 'st', 'nd', 'rd'];
  const v = num % 100;
  return ordinals[(v - 20) % 10] || ordinals[v] || ordinals[0];
};

export default function Prize({
  place,
  prize,
  prizeUnitSymbol,
}) {
  let medalStyleName = 'medal';
  if (place <= 3) medalStyleName += ` place-${place}`;
  return (
    <div styleName="prize" aria-label={`${place}${getOrdinal(place)} prize is ${prizeUnitSymbol}${prize.toLocaleString()}`}>
      <span styleName={medalStyleName}>
        {place}
      </span>
      {prizeUnitSymbol}
      {prize.toLocaleString()}
    </div>
  );
}

Prize.propTypes = {
  place: PT.number.isRequired,
  prize: PT.number.isRequired,
  prizeUnitSymbol: PT.string.isRequired,
};
