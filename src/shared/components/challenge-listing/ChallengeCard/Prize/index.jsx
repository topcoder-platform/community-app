/**
 * Renders prize component of the challenge scorecard.
 * It has no logic related to currency conversion etc., it just takes three
 * props (number,)
 */

import PT from 'prop-types';
import React from 'react';
import Tooltip from 'components/Tooltip';
import Tip from './Tip';
import './style.scss';

export default function Prize({
  bonuses,
  label,
  points,
  prizes,
  prizeUnitSymbol,
  totalPrize,
  withoutTooltip,
  isMM,
}) {
  const component = (
    !isMM &&
    <div>
      <div styleName="prize">
        <span styleName="symbol">{prizeUnitSymbol}</span>
        {totalPrize.toLocaleString()}
      </div>
      <div styleName="label">{label}</div>
    </div>
  );
  if (withoutTooltip) return component;
  const tip = (
    <Tip
      bonuses={bonuses}
      points={points}
      prizes={prizes}
      prizeUnitSymbol={prizeUnitSymbol}
    />
  );
  return <Tooltip content={tip}>{component}</Tooltip>;
}

Prize.defaultProps = {
  prizes: [],
  points: null,
  withoutTooltip: false,
  isMM: false,
};

Prize.propTypes = {
  bonuses: PT.arrayOf(PT.object).isRequired,
  label: PT.string.isRequired,
  points: PT.number,
  prizes: PT.arrayOf(PT.number),
  prizeUnitSymbol: PT.string.isRequired,
  totalPrize: PT.number.isRequired,
  withoutTooltip: PT.bool,
  isMM: PT.bool,
};
