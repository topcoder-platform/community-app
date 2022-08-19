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
  children, label = '', disabled, style, isTextarea,
}) => (
  <div styleName="form-field-wrapper" style={style}>
    <div styleName="form-field">
      <div styleName={cn('label', { disabled, isTextarea })} role="presentation">
        {label}
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
  isTextarea: false,
};

FormField.propTypes = {
  label: PT.string,
  children: PT.node,
  disabled: PT.bool,
  style: PT.object,
  isTextarea: PT.bool,
};

export default FormField;
