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
  styleName, type, showChartCount, ...props
}) => {
  const { value, maxLength } = props;

  return (
    <React.Fragment>
      {showChartCount ? (
        <span styleName="char-count">
          {(value && value.length) || 0}
          <span styleName="grey">/{maxLength}</span>
        </span>
      ) : null}
      <input
        type={type}
        styleName={cn('form-input-text', styleName || '')}
        {...props}
      />
    </React.Fragment>
  );
};

FormInputText.defaultProps = {
  styleName: '',
  type: 'text',
  value: null,
  maxLength: null,
  showChartCount: false,
};

FormInputText.propTypes = {
  styleName: PT.string,
  type: PT.string,
  value: PT.string,
  maxLength: PT.string,
  showChartCount: PT.bool,
};

export default FormInputText;
