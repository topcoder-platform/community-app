/**
 * Toggleable Item component
 *
 * Re-usable component across the settings pages. Displays a primary
 * text, a gray secondary text and a toggle that triggers a function
 * passed via props.
 */
import React from 'react';
import PT from 'prop-types';

import './styles.scss';

export default function ToggleableItem(props) {
  return (
    <div styleName="ToggleableItem">
      <div styleName="body">
        <p styleName="primary">{props.primaryText}</p>
        <p styleName="secondary">{props.secondaryText}</p>
      </div>
      <div className="onoffswitch" styleName="onoffswitch-no-padding-right">
        <input
          type="checkbox"
          name="eprf-onoffswitch"
          id={`pre-onoffswitch-${props.id}`}
          value={props.value}
          checked={props.checked}
          onChange={props.onToggle}
          className="onoffswitch-checkbox"
        />
        <label htmlFor={`pre-onoffswitch-${props.id}`} className="onoffswitch-label">
          <span className="onoffswitch-inner" />
          <span className="onoffswitch-switch" />
        </label>
      </div>
    </div>
  );
}

ToggleableItem.propTypes = {
  id: PT.string.isRequired,
  value: PT.string.isRequired,
  checked: PT.bool.isRequired,
  primaryText: PT.string.isRequired,
  secondaryText: PT.string.isRequired,
  onToggle: PT.func.isRequired,
};
