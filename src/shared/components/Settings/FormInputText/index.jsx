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
  styleName, type, ...props
}) => (
  <input
    type={type}
    styleName={cn('form-input-text', styleName || '')}
    {...props}
  />
);

FormInputText.defaultProps = {
  styleName: '',
  type: 'text',
};

FormInputText.propTypes = {
  styleName: PT.string,
  type: PT.string,
};

export default FormInputText;
