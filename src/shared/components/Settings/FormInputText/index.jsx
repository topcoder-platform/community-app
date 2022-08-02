/**
 * FormInputText
 *
 * Form Input Type=text
 */
import React from 'react';
import PT from 'prop-types';
import cn from 'classnames';
import './styles.scss';

const FormInputText = ({
  styleName, value, type, ...props
}) => (
  <input
    type={type}
    styleName={cn('form-input-text', styleName || '')}
    {...props}
    value={value}
  />
);

FormInputText.defaultProps = {
  styleName: '',
  value: null,
  type: 'text',
};

FormInputText.propTypes = {
  styleName: PT.string,
  value: PT.string,
  type: PT.string,
};

export default FormInputText;
