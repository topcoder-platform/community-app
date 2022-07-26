/**
 * FormInputText
 *
 * Form Input Type=text
 */
import React from 'react';
import PT from 'prop-types';
import cn from 'classnames';
import './styles.scss';

const FormInputText = ({ styleName, value, ...props }) => (
  <input
    type="text"
    styleName={cn('form-input-text', styleName || '')}
    {...props}
    value={value || ''}
  />
);

FormInputText.defaultProps = {
  styleName: '',
  value: '',
};

FormInputText.propTypes = {
  styleName: PT.string,
  value: PT.string,
};

export default FormInputText;
