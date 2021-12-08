/**
 * Toggleable Item component
 *
 * Re-usable component across the settings pages. Displays a primary
 * text, a gray secondary text and a toggle that triggers a function
 * passed via props.
 */
import React, { useRef } from 'react';
import PT from 'prop-types';
import ReactHtmlParser from 'react-html-parser';

import './styles.scss';

export default function ToggleableItem({
  checked,
  id,
  onToggle,
  primaryText,
  secondaryText,
  value,
  disabled,
}) {
  const inputRef = useRef();
  const inputMobileRef = useRef();

  const onChange = () => {
    if (inputRef.current) {
      inputRef.current.checked = !inputRef.current.checked;
      onToggle(inputRef.current.checked);
    }
    if (inputMobileRef.current) {
      inputMobileRef.current.checked = !inputMobileRef.current.checked;
      onToggle(inputMobileRef.current.checked);
    }
  };

  return (
    <div styleName="ToggleableItem">
      <div styleName="body">
        <p styleName="primary">
          {primaryText}
        </p>
        <p styleName="secondary">
          {ReactHtmlParser(secondaryText)}
        </p>
      </div>
      <div className="onoffswitch" styleName="onoffswitch-no-padding-right">
        <input
          ref={inputRef}
          type="checkbox"
          name="eprf-onoffswitch"
          id={`pre-onoffswitch-${id}`}
          value={value}
          checked={checked}
          onChange={onChange}
          className="onoffswitch-checkbox"
          disabled={disabled}
        />
        <label htmlFor={`pre-onoffswitch-${id}`} className="onoffswitch-label">
          <span className="onoffswitch-inner" />
          <span className="onoffswitch-switch" />
          <input type="hidden" />
        </label>
      </div>
      <div className="onoffswitch-mobile" styleName="onoffswitch-no-padding-right">
        <input
          ref={inputMobileRef}
          type="checkbox"
          name="eprf-onoffswitch"
          id={`pre-onoffswitch-${id}`}
          value={value}
          checked={checked}
          onChange={onChange}
          className="onoffswitch-checkbox"
          disabled={disabled}
        />
        <label htmlFor={`pre-onoffswitch-${id}`} className="onoffswitch-label">
          <span className="onoffswitch-inner" />
          <span className="onoffswitch-switch" />
          <input type="hidden" />
        </label>
      </div>
    </div>
  );
}

ToggleableItem.defaultProps = {
  disabled: false,
};

ToggleableItem.propTypes = {
  id: PT.string.isRequired,
  value: PT.string.isRequired,
  checked: PT.bool.isRequired,
  primaryText: PT.string.isRequired,
  secondaryText: PT.string.isRequired,
  onToggle: PT.func.isRequired,
  disabled: PT.bool,
};
