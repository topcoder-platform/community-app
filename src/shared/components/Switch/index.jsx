/* eslint jsx-a11y/no-static-element-interactions:0 */

/**
 * The Switch component provides a simple, but stylish on/off switch.
 * This is a new component, valid for use in new pages.
 */

import React from 'react';
import PT from 'prop-types';
import { themr } from 'react-css-super-themr';
import defaultStyle from './style.scss';

function Switch({
  enabled,
  onSwitch,
  theme,
}) {
  return (
    <div
      tabIndex="0"
      role="switch"
      aria-checked={enabled}
      className={`${theme.switch} ${enabled ? theme.enabled : theme.disabled}`}
      onClick={() => onSwitch(!enabled)}
      onKeyPress={() => onSwitch(!enabled)}
    >
      <div styleName="handle" />
    </div>
  );
}

Switch.defaultProps = {
  enabled: false,
};

Switch.propTypes = {
  enabled: PT.bool,
  theme: PT.shape({
    disabled: PT.string.isRequired,
    enabled: PT.string.isRequired,
    switch: PT.string.isRequired,
  }).isRequired,
  onSwitch: PT.func.isRequired,
};

export default themr('Switch', defaultStyle)(Switch);
