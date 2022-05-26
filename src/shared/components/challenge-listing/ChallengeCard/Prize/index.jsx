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
  prizes,
  prizeUnitSymbol,
  totalPrize,
  withoutTooltip,
  onlyShowTooltipForPrize,
}) {
  const tip = (
    <Tip
      bonuses={bonuses}
      prizes={prizes}
      prizeUnitSymbol={prizeUnitSymbol}
    />
  );
  const prizeUI = (
    <div styleName="prize" aria-hidden="true">
      <span styleName="symbol">
        {prizeUnitSymbol}
      </span>
      {totalPrize.toLocaleString()}
    </div>
  );

  function placeArrow(TooltipNode) {
    const arrow = TooltipNode.querySelector('.rc-tooltip-arrow');
    arrow.style.left = '33%';
  }

  const component = (
    <div
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      aria-label={`${label} ${prizeUnitSymbol} ${totalPrize.toLocaleString()}`}
    >
      {((onlyShowTooltipForPrize && !withoutTooltip)
        ? (
          <Tooltip content={tip} placeArrow={placeArrow}>
            {prizeUI}
          </Tooltip>
        )
        : (prizeUI)
      )}
      <div styleName="label" aria-hidden="true">
        {label}
      </div>
    </div>
  );
  if (withoutTooltip || onlyShowTooltipForPrize) return component;
  return (
    <Tooltip content={tip}>
      {component}
    </Tooltip>
  );
}

Prize.defaultProps = {
  bonuses: [],
  prizes: [],
  withoutTooltip: false,
  onlyShowTooltipForPrize: false,
};

Prize.propTypes = {
  bonuses: PT.arrayOf(PT.object),
  label: PT.string.isRequired,
  prizes: PT.arrayOf(PT.shape()),
  prizeUnitSymbol: PT.string.isRequired,
  totalPrize: PT.number.isRequired,
  withoutTooltip: PT.bool,
  onlyShowTooltipForPrize: PT.bool,
};
