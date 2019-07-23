/* eslint jsx-a11y/no-static-element-interactions:0 */

/**
 * The switch for hiding/showing the filters panel.
 *
 * It is in the pressed state when the 'active' boolean property is true.
 * When the 'filtersCount' number property evaluates to true it shows this
 * number in a blue bubble, as the number of active filters.
 *
 * When the user clicks this component, it triggers the callback provided via
 * the 'onSwitch' property, passing in the demanded active state as a boolean
 * argument (it will be just a logical NOT of the 'active' property).
 */

import React from 'react';
import PT from 'prop-types';

import FiltersIcon from './filters-icon.svg';
import './style.scss';

export default function FiltersSwitch({
  active,
  className: propClassName,
  filtersCount: propFiltersCount,
  onSwitch,
}) {
  let className = 'FiltersSwitch';
  if (active) className += ' active';

  let filtersCount;
  if (propFiltersCount) {
    filtersCount = (
      <span styleName="filtersCount">
        {propFiltersCount}
      </span>
    );
  }

  return (
    <div
      styleName={className}
      tabIndex={0}
      role="button"
      className={`tc-outline-btn ${propClassName || ''}`}
      onClick={() => (onSwitch ? onSwitch(!active) : null)}
      onKeyPress={() => (onSwitch ? onSwitch(!active) : null)}
    >
      <FiltersIcon color="#5D5D66" styleName="FiltersIcon" />
      Filters
      {filtersCount}
    </div>
  );
}

FiltersSwitch.defaultProps = {
  active: false,
  filtersCount: 0,
  className: '',
};

FiltersSwitch.propTypes = {
  active: PT.bool,
  filtersCount: PT.number,
  onSwitch: PT.func.isRequired,
  className: PT.string,
};
