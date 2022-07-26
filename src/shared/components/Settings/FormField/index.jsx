/**
 * FormField
 *
 * A Form Field Is a wrapper for input to add the label to it
*/
import React from 'react';
import PT from 'prop-types';
import './styles.scss';

const FormField = ({ children, label = '', style }) => (
  <div styleName="form-field-wrapper" style={style}>
    <div styleName="form-field">
      <div styleName="label" role="presentation">
        {label}
      </div>
      {children}
    </div>
  </div>
);

FormField.defaultProps = {
  label: '',
  children: null,
  style: {},
};

FormField.propTypes = {
  label: PT.string,
  children: PT.node,
  style: PT.object,
};

export default FormField;
