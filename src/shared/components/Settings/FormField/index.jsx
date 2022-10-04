/**
 * FormField
 *
 * A Form Field Is a wrapper for input to add the label to it
*/
import React from 'react';
import PT from 'prop-types';
import cn from 'classnames';
import './styles.scss';

const FormField = ({
  children, label = '', disabled, style, required, isTextarea,
}) => (
  <div styleName="form-field-wrapper" style={style}>
    <div styleName="form-field">
      <div styleName={cn('label', disabled ? 'disabled' : null, isTextarea)} role="presentation">
        {label}
        { required && <span styleName="required">*</span> }
      </div>
      {children}
    </div>
  </div>
);

FormField.defaultProps = {
  label: '',
  children: null,
  disabled: false,
  style: {},
  required: false,
  isTextarea: false,
};

FormField.propTypes = {
  label: PT.string,
  children: PT.node,
  disabled: PT.bool,
  style: PT.object,
  required: PT.bool,
  isTextarea: PT.bool,
};

export default FormField;
