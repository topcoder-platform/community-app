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
  const { value } = props;

  return (
    <div>
      <span styleName="char-count">
        {(value && value.length) || 0}
        <span styleName="grey">
    &nbsp;/ 240
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
};

FormInputTextArea.propTypes = {
  styleName: PT.shape(),
  value: PT.string,
};

export default FormInputTextArea;
