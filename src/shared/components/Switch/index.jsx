/* eslint jsx-a11y/no-static-element-interactions:0 */

/**
 * The Switch component provides a simple, but stylish on/off switch.
 * This is a new component, valid for use in new pages.
 */

import React from 'react';
import PT from 'prop-types';
import { themr } from 'react-css-themr';
import defaultStyle from './style.scss';

function Switch(props) {
  return (
    <div
      className={`${props.theme.switch} ${props.enabled ? props.theme.enabled : props.theme.disabled}`}
      onClick={() => props.onSwitch(!props.enabled)}
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
