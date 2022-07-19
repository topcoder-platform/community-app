/**
 * FormInputTextArea
 *
 * Form Input Type=text
 */
import React from 'react';
import PT from 'prop-types';
import cn from 'classnames';
import './styles.scss';

const FormInputTextArea = ({ styleName, ...props }) => (
  <textarea
    type="text"
    styleName={cn('form-input-text-area', styleName || '')}
    {...props}
  />
);

FormInputTextArea.defaultProps = {
  styleName: {},
};

FormInputTextArea.propTypes = {
  styleName: PT.shape(),
};

export default FormInputTextArea;
