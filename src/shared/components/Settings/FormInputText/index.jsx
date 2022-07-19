/**
 * FormInputText
 *
 * Form Input Type=text
 */
import React from 'react';
import PT from 'prop-types';
import cn from 'classnames';
import './styles.scss';

const FormInputText = ({ styleName, ...props }) => (
  <input
    type="text"
    styleName={cn('form-input-text', styleName || '')}
    {...props}
  />
);

FormInputText.defaultProps = {
  styleName: {},
};

FormInputText.propTypes = {
  styleName: PT.shape(),
};

export default FormInputText;
