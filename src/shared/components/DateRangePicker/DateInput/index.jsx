import React from 'react';
import PropTypes from 'prop-types';
import InputMask from 'react-input-mask';
import cn from 'classnames';
import CalendarIcon from 'assets/images/tc-edu/icon-calendar.svg';
import styles from './style.scss';

function DateInput(props) {
  const {
    onIconClick,
    isActive,
    error,
    id,
    ...restProps
  } = props;

  /**
   * Event handler for user keydown
   * @param {Event} e Keyboard event
   */
  const onKeyDown = (e) => {
    // Enter key pressed
    if (e.keyCode === 13) {
      onIconClick();
    }
  };

  return (
    <div className={cn([
      styles.dateInput,
      isActive && styles.isActive,
      error && styles.isError,
    ])}
    >
      <section>
        <InputMask id={id} {...restProps} />
        <CalendarIcon id={`${id}-calendar-icon`} tabIndex={0} styleName="calendarIcon" onClick={onIconClick} onKeyDown={onKeyDown} />
      </section>
      <div styleName="errorHint">
        { error }
      </div>
    </div>
  );
}

// It use https://www.npmjs.com/package/react-input-mask internally
// Check the docs for further options

DateInput.propTypes = {
  readOnly: PropTypes.bool,
  onChange: PropTypes.func,
  onMouseDown: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onIconClick: PropTypes.func,
  value: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  isActive: PropTypes.bool,
  mask: PropTypes.string,
  placeholder: PropTypes.string,
  id: PropTypes.string,
  maskPlaceholder: PropTypes.string,
  error: PropTypes.string,
};

DateInput.defaultProps = {
  readOnly: false,
  disabled: false,
  mask: '99/99/9999',
  placeholder: '',
  id: 'input-date-range',
  isActive: false,
  onChange: () => {},
  onMouseDown: () => {},
  onFocus: () => {},
  onBlur: () => {},
  onIconClick: () => {},
  maskPlaceholder: 'mm/dd/yyyy',
  error: '',
};

export default DateInput;
