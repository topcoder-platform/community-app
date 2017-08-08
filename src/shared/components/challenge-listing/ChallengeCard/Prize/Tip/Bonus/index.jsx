/**
 * A single bonus componenent.
 * It renders the bonus name inside a colored rectangle,
 * and the bonus number, formatted as currency, next to it.
 */

import PT from 'prop-types';
import React from 'react';
import './style.scss';

export default function Bonus({
  name,
  prize,
  prizeUnitSymbol,
}) {
  return (
    <div styleName="bonus">
      <span styleName="name">{name}</span>
      {prizeUnitSymbol}{prize.toLocaleString()}
    </div>
  );
}

Bonus.propTypes = {
  name: PT.string.isRequired,
  prize: PT.number.isRequired,
  prizeUnitSymbol: PT.string.isRequired,
};
