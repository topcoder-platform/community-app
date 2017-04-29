/* eslint jsx-a11y/no-static-element-interactions:0 */

/**
 * The Switch component provides a simple, but stylish on/off switch.
 * This is a new component, valid for use in new pages.
 */

import React from 'react';
import PT from 'prop-types';
import './Switch.scss';

export default function Switch(props) {
  return (
    <div
      styleName={`Switch ${props.enabled ? 'enabled' : 'disabled'}`}
      className={props.className}
      onClick={() => props.onSwitch(!props.enabled)}
    ><div styleName="switch-handle" />
    </div>
  );
}

Switch.defaultProps = {
  enabled: false,
  className: '',
};

Switch.propTypes = {
  enabled: PT.bool,
  onSwitch: PT.func.isRequired,
  className: PT.string,
};
