/* eslint-disable jsx-a11y/label-has-for */
/**
 * Text input component.
 */
import React, { useState, useRef } from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import './style.scss';

import { config } from 'topcoder-react-utils';

function TextInput({
  placeholder,
  label,
  errorMsg,
  value,
  onChange,
  required,
  size,
}) {
  const [val, setVal] = useState(value);
  const delayedOnChange = useRef(
    _.debounce((q, cb) => cb(q), config.GUIKIT.DEBOUNCE_ON_CHANGE_TIME),
  ).current;
  const sizeStyle = size === 'lg' ? 'lgSize' : 'xsSize';

  return (
    <div className="textInputContainer" styleName={`container ${sizeStyle}`}>
      <input
        defaultValue={value}
        type="text"
        placeholder={`${placeholder}${placeholder && required ? ' *' : ''}`}
        styleName={`${value || val ? 'haveValue' : ''} ${errorMsg ? 'haveError' : ''}`}
        onChange={(e) => {
          delayedOnChange(e.target.value, onChange);
          setVal(e.target.value);
        }}
        onBlur={(e) => {
          delayedOnChange(e.target.value, onChange);
          setVal(e.target.value);
        }}
      />
      {label ? (
        <label htmlFor="textBoxInput">
          {label}{required ? (<span>&nbsp;*</span>) : null}
        </label>
      ) : null}
      {errorMsg ? (<span styleName="errorMessage">{errorMsg}</span>) : null}
    </div>
  );
}

TextInput.defaultProps = {
  placeholder: '',
  label: '',
  errorMsg: '',
  value: '',
  onChange: () => {},
  required: false,
  size: 'lg',
};

TextInput.propTypes = {
  placeholder: PT.string,
  label: PT.string,
  errorMsg: PT.string,
  value: PT.string,
  onChange: PT.func,
  required: PT.bool,
  size: PT.oneOf(['xs', 'lg']),
};

export default TextInput;
