import React from 'react';
import PT from 'prop-types';

import './styles.scss';

const FormInputRadio = ({
  text, value, selectedValue, onSelectionChange,
}) => {
  const handleChange = () => {
    onSelectionChange(value);
  };

  const inputId = `roundedInputFieldRadioGroup-${value}`;
  return (
    <div styleName="rounded-input-field">
      <div styleName="input-text-wrapper">
        <span styleName="input-text">{text}</span>
      </div>
      <label styleName="input-radio-wrapper" htmlFor={inputId}>
        <input
          type="radio"
          id={inputId}
          name="roundedInputFieldRadioGroup"
          value={value}
          checked={selectedValue === value}
          onChange={handleChange}
          styleName="input-radio"
        />
        <span styleName="custom-radio" />
      </label>
    </div>
  );
};


FormInputRadio.propTypes = {
  text: PT.string.isRequired,
  value: PT.string.isRequired,
  selectedValue: PT.string.isRequired,
  onSelectionChange: PT.func.isRequired,
};

export default FormInputRadio;
