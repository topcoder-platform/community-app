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

function SwitchWithLabel(props) {
  return (
    <div
      className={props.theme.wrapper}
      onClick={() => props.onSwitch(!props.enabled)}
      onKeyPress={() => props.onSwitch(!props.enabled)}
    >
      {props.labelBefore}
      <Switch
        enabled={props.enabled}
        onSwitch={props.onSwitch}
        theme={{
          switch: props.theme.switch,
        }}
      />
      {props.labelAfter}
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
