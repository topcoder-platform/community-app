/* eslint jsx-a11y/no-static-element-interactions:0 */

/**
 * The SwitchWithLabel component extends Switch with labels before and/or after
 * it. This is a new component, valid to use in the new pages.
 */

import React from 'react';
import PT from 'prop-types';
import { themr } from 'react-css-super-themr';
import Switch from '../Switch';
import defaultStyle from './style.scss';

function SwitchWithLabel({
  enabled,
  labelAfter,
  labelBefore,
  onSwitch,
  theme,
}) {
  return (
    <div
      className={theme.wrapper}
      onClick={() => onSwitch(!enabled)}
      onKeyPress={() => onSwitch(!enabled)}
    >
      {labelBefore}
      <Switch
        enabled={enabled}
        onSwitch={onSwitch}
        theme={{
          switch: theme.switch,
        }}
      />
      {labelAfter}
    </div>
  );
}

SwitchWithLabel.defaultProps = {
  enabled: false,
  labelAfter: '',
  labelBefore: '',
};

SwitchWithLabel.propTypes = {
  enabled: PT.bool,
  labelAfter: PT.string,
  labelBefore: PT.string,
  theme: PT.shape({
    switch: PT.string.isRequired,
    wrapper: PT.string.isRequired,
  }).isRequired,
  onSwitch: PT.func.isRequired,
};

export default themr('SwitchWithLabel', defaultStyle)(SwitchWithLabel);
