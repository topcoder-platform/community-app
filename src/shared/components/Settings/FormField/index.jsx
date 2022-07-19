/**
 * FormField
 *
 * A Form Field Is a wrapper for input to add the label to it
*/
import React from 'react';
import PT from 'prop-types';
import './styles.scss';

const FormField = ({ children, label = '' }) => {
  const handleClick = (e) => {
    // focus on input label click
    const inputElement = e.target.closest('.form-field').querySelector('input');
    if (inputElement) {
      inputElement.focus();
    }
  };

  return (
    <div styleName="form-field-wrapper">
      <div styleName="form-field">
        <div styleName="label" role="presentation" onClick={handleClick}>
          {label}
        </div>
        {children}
      </div>
    </div>
  );
};

FormField.defaultProps = {
  label: '',
  children: null,
};

FormField.propTypes = {
  label: PT.string,
  children: PT.node,
};

export default FormField;
