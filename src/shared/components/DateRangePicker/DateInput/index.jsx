import React from 'react';
import PropTypes from 'prop-types';
import InputMask from 'react-input-mask';
import cn from 'classnames';
import CalendarIcon from 'assets/images/tc-edu/icon-calendar.svg';
import styles from './style.scss';

function DateInput(props) {
  const {
    onIconClick,
    disabled,
  } = props;

  return (
    <div className={cn([
      styles.dateInput,
      disabled && styles.disabled,
    ])}
    >
      <InputMask {...props}>
        {() => (
          <input id="input-date-range" disabled={disabled} />
        )}
      </InputMask>
      <CalendarIcon styleName="calendarIcon" onClick={onIconClick} />
    </div>
  );
}

DateInput.propTypes = {
  readOnly: PropTypes.bool,
  onChange: PropTypes.func,
  onMouseDown: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onIconClick: PropTypes.func,
  value: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  isFocused: PropTypes.bool,
  mask: PropTypes.string,
};

DateInput.defaultProps = {
  readOnly: false,
  disabled: false,
  mask: '99/99/9999',
  isFocused: false,
  onChange: () => {},
  onMouseDown: () => {},
  onFocus: () => {},
  onBlur: () => {},
  onIconClick: () => {},
};

export default DateInput;
