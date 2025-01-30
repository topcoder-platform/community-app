/**
 * FormInputTextArea
 *
 * Form Input Type=text
 */
import React from 'react';
import PT from 'prop-types';
import cn from 'classnames';
import './styles.scss';

const FormInputTextArea = ({
  styleName, showChartCount, showBottomChartCount, ...props
}) => {
  const {
    value,
    maxLength,
  } = props;

  return (
    <div>
      {showBottomChartCount ? (
        <span styleName="char-count-bottom">
          {(value && value.length) || 0}
          <span styleName="grey">/{maxLength}</span>
        </span>
      ) : null}
      {showChartCount ? (
        <span styleName="char-count">
          {(value && value.length) || 0}
          <span styleName="grey">
            &nbsp;/ {maxLength}
          </span>
        </span>
      ) : null}
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
  showBottomChartCount: false,
  showChartCount: true,
};

FormInputTextArea.propTypes = {
  styleName: PT.shape(),
  value: PT.string,
  maxLength: PT.string,
  showBottomChartCount: PT.bool,
  showChartCount: PT.bool,
};

export default FormInputTextArea;
