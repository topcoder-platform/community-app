/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
/**
 * Radio button component.
 */
import React, { useRef, useState } from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import './style.scss';

import { config } from 'topcoder-react-utils';

function RadioButton({ options, onChange, size }) {
  const [internalOptions, setInternalOptions] = useState(options);
  const optionsWithKey = internalOptions.map((o, oIndex) => ({ ...o, key: oIndex }));
  let sizeStyle = size === 'lg' ? 'lgSize' : null;
  if (!sizeStyle) {
    sizeStyle = size === 'xs' ? 'xsSize' : 'smSize';
  }
  const delayedOnChange = useRef(
    _.debounce((q, cb) => cb(q), config.GUIKIT.DEBOUNCE_ON_CHANGE_TIME),
  ).current;

  return (
    <div className="radioButtonContainer" styleName={`radioButtonContainer ${sizeStyle}`}>
      {optionsWithKey.map(o => (
        <div key={o.key} styleName="radioButton" className="radioButton">
          <label styleName="container">
            <input
              type="radio"
              checked={o.value}
              onChange={() => {
                const newOptions = optionsWithKey.map(oWithKeyTmp => ({
                  label: oWithKeyTmp.label,
                  value: o.key === oWithKeyTmp.key,
                }));
                setInternalOptions(newOptions);
                delayedOnChange(_.cloneDeep(newOptions), onChange);
              }}
            />
            <span styleName="checkmark" />
          </label>
          {o.label ? (<span styleName="label">{o.label}</span>) : null}
        </div>
      ))}
    </div>
  );
}

RadioButton.defaultProps = {
  onChange: () => {},
  size: 'sm',
};

RadioButton.propTypes = {
  options: PT.arrayOf(
    PT.shape({
      label: PT.string,
      value: PT.bool.isRequired,
    }),
  ).isRequired,
  onChange: PT.func,
  size: PT.oneOf(['xs', 'sm', 'lg']),
};

export default RadioButton;
