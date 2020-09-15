/* eslint-disable jsx-a11y/label-has-for */
/**
 * Textarea component.
 */
import React, { useState, useRef } from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import './style.scss';

import { config } from 'topcoder-react-utils';

function Textarea({
  placeholder,
  label,
  errorMsg,
  value,
  onChange,
  required,
}) {
  const [val, setVal] = useState(value);
  const delayedOnChange = useRef(
    _.debounce((q, cb) => cb(q), config.GUIKIT.DEBOUNCE_ON_CHANGE_TIME),
  ).current;

  return (
    <div className="textareaContainer" styleName="container">
      <textarea
        defaultValue={value}
        placeholder={`${placeholder}${placeholder && required ? ' *' : ''}`}
        id="textAreaInput"
        styleName={`${val ? 'haveValue' : ''} ${errorMsg ? 'haveError' : ''}`}
        onChange={(e) => {
          delayedOnChange(e.target.value, onChange);
          setVal(e.target.value);
        }}
      />
      {label ? (
        <div styleName="labelMask" />
      ) : null}
      {label ? (
        <label htmlFor="textAreaInput">
          {label}{required ? (<span>&nbsp;*</span>) : null}
        </label>
      ) : null}
      {errorMsg ? (<span styleName="errorMessage">{errorMsg}</span>) : null}
    </div>
  );
}

Textarea.defaultProps = {
  placeholder: '',
  label: '',
  errorMsg: '',
  value: '',
  onChange: () => {},
  required: false,
};

Textarea.propTypes = {
  placeholder: PT.string,
  label: PT.string,
  errorMsg: PT.string,
  value: PT.string,
  onChange: PT.func,
  required: PT.bool,
};

export default Textarea;
