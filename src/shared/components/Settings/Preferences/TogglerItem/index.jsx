import React from 'react';
import PT from 'prop-types';

import './styles.scss';

export default function TogglerItem({
  checked,
  id,
  onToggle,
  value,
}) {
  return (
    <React.Fragment>
      <div className="onoffswitch" styleName="onoffswitch-no-padding-right">
        <input
          type="checkbox"
          name="eprf-onoffswitch"
          id={`pre-onoffswitch-${id}`}
          value={value}
          checked={checked}
          onChange={onToggle}
          className="onoffswitch-checkbox"
        />
        <label htmlFor={`pre-onoffswitch-${id}`} className="onoffswitch-label">
          <span className="onoffswitch-inner" />
          <span className="onoffswitch-switch" />
          <input type="hidden" />
        </label>
      </div>
      <div className="onoffswitch-mobile" styleName="onoffswitch-no-padding-right">
        <input
          type="checkbox"
          name="eprf-onoffswitch"
          id={`pre-onoffswitch-${id}`}
          value={value}
          checked={checked}
          onChange={onToggle}
          className="onoffswitch-checkbox"
        />
        <label htmlFor={`pre-onoffswitch-${id}`} className="onoffswitch-label">
          <span className="onoffswitch-inner" />
          <span className="onoffswitch-switch" />
          <input type="hidden" />
        </label>
      </div>
    </React.Fragment>
  );
}

TogglerItem.propTypes = {
  id: PT.string.isRequired,
  checked: PT.bool.isRequired,
  onToggle: PT.func.isRequired,
  value: PT.string.isRequired,
};
