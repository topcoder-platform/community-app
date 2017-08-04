import PT from 'prop-types';
import React from 'react';
import './style.scss';

/**
 * A single prise component.
 * It renders a round-shaped medal with the specified place number inside it,
 * and the prize, formatted as currency, next to it.
 */
export default function Prize({
  place,
  prize,
  prizeUnitSymbol,
}) {
  let medalStyleName = 'medal';
  if (place <= 3) medalStyleName += ` place-${place}`;
  return (
    <div styleName="prize">
      <span styleName={medalStyleName}>{place}</span>
      {prizeUnitSymbol}{prize.toLocaleString()}
    </div>
  );
}

Prize.propTypes = {
  place: PT.number.isRequired,
  prize: PT.number.isRequired,
  prizeUnitSymbol: PT.string.isRequired,
};
