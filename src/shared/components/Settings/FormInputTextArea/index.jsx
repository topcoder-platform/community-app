/**
 * FormInputTextArea
 *
 * Form Input Type=text
 */
import React from 'react';
import PT from 'prop-types';
import cn from 'classnames';
import './styles.scss';

const FormInputTextArea = ({ styleName, ...props }) => {
  const { value, maxLength } = props;

  return (
    <div>
      <span styleName="char-count">
        {(value && value.length) || 0}
        <span styleName="grey">
    &nbsp;/ {maxLength}
        </span>
      </span>
      <textarea
        type="text"
        styleName={cn('form-input-text-area', styleName || '')}
        {...props}
      />
    </div>
  );
};

FormInputTextArea.defaultProps = {
  styleName: {},
  value: null,
  maxLength: null,
};

FormInputTextArea.propTypes = {
  styleName: PT.shape(),
  value: PT.string,
  maxLength: PT.string,
};

export default FormInputTextArea;
