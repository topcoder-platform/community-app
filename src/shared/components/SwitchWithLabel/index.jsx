/* eslint jsx-a11y/no-static-element-interactions:0 */

/**
 * The SwitchWithLabel component extends Switch with labels before and/or after
 * it. This is a new component, valid to use in the new pages.
 */

import React from 'react';
import PT from 'prop-types';
import { themr } from 'react-css-themr';
import Switch from '../Switch';
import defaultStyle from './style.scss';

function SimpleSwitch(props) {
  return (
    <div
      className={props.theme.SwitchWithLabel}
      onClick={() => props.onSwitch(!props.enabled)}
    >
      {props.labelBefore}
      <Switch
        enabled={props.enabled}
        onSwitch={props.onSwitch}
        theme={{
          Switch: props.theme.Switch,
        }}
      />
      {props.labelAfter}
    </div>
  );
}

SimpleSwitch.defaultProps = {
  enabled: false,
  theme: {
    SwitchWithLabel: '',
  },
  labelAfter: '',
  labelBefore: '',
};

SimpleSwitch.propTypes = {
  enabled: PT.bool,
  labelAfter: PT.string,
  labelBefore: PT.string,
  theme: PT.shape({
    SwitchWithLabel: PT.string.isRequired,
  }),
  onSwitch: PT.func.isRequired,
};

export default themr('SimpleSwitch', defaultStyle)(SimpleSwitch);
