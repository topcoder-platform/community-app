/* eslint-disable jsx-a11y/label-has-for */
/**
 * Dropdown component.
 */
import React from 'react';
import PT from 'prop-types';
import ReactSelect from 'react-select';
import './style.scss';

function Dropdown({
  options,
  selectedId,
  placeholder,
  label,
  onChange,
}) {
  return (
    <div styleName="container">
      <label htmlFor="dropdown-select" styleName="label">{label}</label>
      <ReactSelect
        placeholder={placeholder}
        autoBlur
        autosize
        clearable={false}
        id="dropdown-select"
        onChange={onChange}
        options={options}
        value={selectedId}
        valueRenderer={option => (
          <span styleName="active-option">
            {option.name}
          </span>
        )}
      />
    </div>
  );
}

Dropdown.defaultProps = {
  options: [],
  selectedId: null,
  placeholder: '',
  label: '',
};

Dropdown.propTypes = {
  options: PT.arrayOf(PT.shape),
  selectedId: PT.string,
  placeholder: PT.string,
  label: PT.string,
  onChange: PT.func.isRequired,
};

export default Dropdown;
