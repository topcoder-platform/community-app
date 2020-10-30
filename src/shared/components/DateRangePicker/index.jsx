import React, { useState, useEffect } from 'react';
import moment from 'moment';
import cn from 'classnames';
import { DateRangePicker as ReactDateRangePicker } from 'react-date-range';
import PropTypes from 'prop-types';

import ArrowNext from 'assets/images/long-arrow-next.svg';
import styles from './style.scss';

import DateInput from './DateInput';
import {
  useComponentVisible, createStaticRanges, isSameDay, isAfterDay, isBeforeDay,
} from './helpers';

function DateRangePicker(props) {
  const {
    readOnly,
    startDatePlaceholder,
    endDatePlaceholder,
    range,
    onChange,
  } = props;

  const [rangeString, setRangeString] = useState(
    {
      startDateString: '',
      endDateString: '',
    },
  );
  const [activeDate, setActiveDate] = useState(null);
  const [preview, setPreview] = useState(null);
  const [focusedRange, setFocusedRange] = useState([0, 0]);
  const [errors, setErrors] = useState({
    startDate: undefined,
    endDate: undefined,
  });

  const {
    ref: calendarRef,
    isComponentVisible,
    setIsComponentVisible,
  } = useComponentVisible(false);

  const isStartDateFocused = focusedRange[1] === 0;
  const isEndDateFocused = focusedRange[1] === 1;

  /**
   * Handle end date change on user input
   * After user input the end date via keyboard, validate it then update the range state
   * @param {Object} e Input Event.
   */
  const onEndDateChange = (e) => {
    const endDateString = e.target.value;
    const endDate = moment(endDateString, 'MM/DD/YYYY', true);
    if (endDate.isValid()) {
      onChange({
        endDate: endDate.toDate(),
        startDate: range.startDate,
      });

      setErrors({
        ...errors,
        endDate: '',
      });

      setRangeString({
        ...rangeString,
        endDateString: endDate.format('MM/DD/YYYY'),
      });
    } else {
      if (endDateString && endDateString !== 'mm/dd/yyyy') {
        setErrors({
          ...errors,
          endDate: 'Invalid Format',
        });
      }

      setRangeString({
        ...rangeString,
        endDateString,
      });
    }
  };

  /**
   * Handle start date change on user input
   * After user input the start date via keyboard, validate it then update the range state
   * @param {Object} e Input Event.
   */
  const onStartDateChange = (e) => {
    const startDateString = e.target.value;
    const startDate = moment(startDateString, 'MM/DD/YYYY', true);
    if (startDate.isValid()) {
      onChange({
        endDate: range.endDate,
        startDate: startDate.toDate(),
      });

      setErrors({
        ...errors,
        startDate: '',
      });

      setRangeString({
        ...rangeString,
        startDateString: startDate.format('MM/DD/YYYY'),
      });
    } else {
      if (startDateString && startDateString !== 'mm/dd/yyyy') {
        setErrors({
          ...errors,
          startDate: 'Invalid Format',
        });
      }

      setRangeString({
        ...rangeString,
        startDateString,
      });
    }
  };

  /**
   * Trigger to open calendar modal on calendar icon in start date input
   */
  const onIconClickStartDate = () => {
    const calendarIcon = document.querySelector('#input-start-date-range-calendar-icon');
    if (calendarIcon) {
      calendarIcon.blur();
    }
    setFocusedRange([0, 0]); // set current focused input to start date
    setActiveDate(null);
    setIsComponentVisible(true);
    setPreview(null);
  };

  /**
   * Trigger to open calendar modal on calendar icon in end date input
   */
  const onIconClickEndDate = () => {
    const calendarIcon = document.querySelector('#input-end-date-range-calendar-icon');
    if (calendarIcon) {
      calendarIcon.blur();
    }
    setFocusedRange([0, 1]); // set current focused input to end date
    setActiveDate(null);
    setIsComponentVisible(true);
    setPreview(null);
  };


  /**
   * Event handler on date selection changes
   * @param {Object} newRange nnew range that has endDate and startDate data
   */
  const onDateRangePickerChange = (newRange) => {
    let newEndDate = newRange.endDate;
    let newStartDate = newRange.startDate;
    const isUseKeyPress = focusedRange[0] !== 0;

    if (isUseKeyPress) {
      setFocusedRange([0, focusedRange[1]]);
    }

    let shouldCloseCalendar = true;
    let shouldOpenNextCalendar = false;

    // User is active on start date calendar modal
    if (isStartDateFocused && (isUseKeyPress || isSameDay(newStartDate, newEndDate))) {
      if (range.endDate && isAfterDay(newStartDate, range.endDate)) return;
      newEndDate = range.endDate;
      if (!range.endDate) {
        shouldCloseCalendar = false;
        shouldOpenNextCalendar = true;
      }
      setErrors({
        ...errors,
        startDate: '',
      });
    } else if (isEndDateFocused && (isUseKeyPress || isSameDay(newEndDate, newStartDate))) {
      if (range.startDate && isBeforeDay(newEndDate, range.startDate)) return;
      newStartDate = range.startDate;
      setErrors({
        ...errors,
        endDate: '',
      });
    } else {
      setErrors({
        startDate: '',
        endDate: '',
      });
    }

    // Emit the payload

    setRangeString({
      startDateString: newStartDate ? moment(newStartDate).format('MM/DD/YYYY') : '',
      endDateString: newEndDate ? moment(newEndDate).format('MM/DD/YYYY') : '',
    });

    onChange({
      startDate: newStartDate,
      endDate: newEndDate ? moment(newEndDate).endOf('day').toDate() : null,
    });

    if (shouldOpenNextCalendar) {
      setFocusedRange([0, 1]);
    }
    if (shouldCloseCalendar) {
      setIsComponentVisible(false);
    }
  };

  /**
   * Event handler on preview change
   * @param {Date} date current date which user hover
   */
  const onPreviewChange = (date) => {
    if (!(date instanceof Date)) {
      setPreview(null);
      setActiveDate(null);
      setFocusedRange([0, focusedRange[1]]);
      return;
    }

    if (isStartDateFocused && date) {
      setPreview({
        startDate: date,
        endDate: range.endDate || date,
      });
    } else if (isEndDateFocused && date) {
      setPreview({
        startDate: range.startDate || date,
        endDate: date,
      });
    }

    setActiveDate(date);
    setFocusedRange([1, focusedRange[1]]);
  };

  /**
   * Event handler for user keypress
   * @param {Event} e Keyboard event
   */
  const handleKeyDown = (e) => {
    let currentActiveDate = activeDate;
    if (!currentActiveDate) {
      currentActiveDate = moment().startOf('month').toDate();

      if (isStartDateFocused && range.startDate) {
        currentActiveDate = range.startDate;
      } else if (isEndDateFocused && (range.startDate || range.endDate)) {
        currentActiveDate = range.endDate || range.startDate;
      }
    }

    switch (e.key) {
      case 'Down':
      case 'ArrowDown':
        currentActiveDate = moment(currentActiveDate).add(7, 'days').toDate();
        onPreviewChange(currentActiveDate);
        break;
      case 'Up':
      case 'ArrowUp':
        currentActiveDate = moment(currentActiveDate).subtract(7, 'days').toDate();
        onPreviewChange(currentActiveDate);
        break;
      case 'Left':
      case 'ArrowLeft':
        currentActiveDate = moment(currentActiveDate).subtract(1, 'days').toDate();
        onPreviewChange(currentActiveDate);
        break;
      case 'Right':
      case 'ArrowRight':
        currentActiveDate = moment(currentActiveDate).add(1, 'days').toDate();
        onPreviewChange(currentActiveDate);
        break;
      case 'Enter':
        if (activeDate) {
          onDateRangePickerChange({
            startDate: isStartDateFocused ? activeDate : range.startDate,
            endDate: isEndDateFocused ? activeDate : range.endDate,
          });
        }
        break;
      case 'Esc':
      case 'Escape':
        setIsComponentVisible(false);
        break;
      default:
        return; // Quit when this doesn't handle the key event.
    }

    e.preventDefault();
  };


  /**
   * User Effect for listening to keypress event
   */
  useEffect(() => {
    if (isComponentVisible) {
      document.addEventListener('keydown', handleKeyDown, true);
    } else {
      document.removeEventListener('keydown', handleKeyDown, true);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  });

  /**
   * Focus the calendar to the given date,
   * so for example, if the user click menu for end date it will open the calendar
   * and focus it to current end date
   */
  const getShownDate = () => {
    if (activeDate) {
      return activeDate;
    }

    if (isStartDateFocused) {
      if (preview) return preview.startDate;
      return range.startDate || moment().toDate();
    }
    if (preview) return preview.endDate;
    return range.endDate || moment().toDate();
  };

  /**
   * Disable the days that cannot be selected
   */
  const disabledDay = (date) => {
    if (isStartDateFocused) {
      return range.endDate ? moment(date).isAfter(range.endDate, 'day') : false;
    }
    return range.startDate ? moment(date).isBefore(range.startDate, 'day') : false;
  };


  /**
   * Get Date Ranges
   */
  const getRanges = () => {
    if (activeDate) {
      return [
        {
          ...range,
          key: 'selection',
          color: '#0B71E6',
        },
        {
          startDate: activeDate,
          endDate: activeDate,
          key: 'active',
          color: '#59A7FF',
        },
      ];
    }
    return [
      {
        ...range,
        key: 'selection',
        color: '#0A81FF',
      },
    ];
  };

  /**
   * Check whether the preview invalid
   */
  const isInvalidPreview = () => {
    if (!preview) return false;
    if (isStartDateFocused) {
      return isAfterDay(preview.startDate, range.endDate);
    }
    return isBeforeDay(preview.endDate, range.startDate);
  };

  return (
    <div
      styleName="dateRangePicker"
      className={cn([
        focusedRange[1] === 1 && styles.endDate,
        (range.startDate && range.endDate) && styles.isRange,
        isInvalidPreview() && styles.isInvalidPreview,
        (errors.startDate || errors.endDate) && styles.isErrorInput,
      ])}
    >
      <div styleName="dateInputWrapper">
        <DateInput
          id="input-start-date-range"
          isActive={focusedRange[1] === 0 && isComponentVisible}
          readOnly={readOnly}
          value={rangeString.startDateString}
          placeholder={startDatePlaceholder}
          onChange={onStartDateChange}
          onFocus={() => setFocusedRange([0, 0])}
          onIconClick={onIconClickStartDate}
          error={errors.startDate}
        />
        <ArrowNext styleName="arrow" />
        <DateInput
          id="input-end-date-range"
          isActive={focusedRange[1] === 1 && isComponentVisible}
          label="You must input start date first"
          readOnly={readOnly}
          value={rangeString.endDateString}
          placeholder={endDatePlaceholder}
          onChange={onEndDateChange}
          onFocus={() => setFocusedRange([0, 1])}
          onIconClick={onIconClickEndDate}
          error={errors.endDate}
        />
      </div>
      <div ref={calendarRef}>
        {
          isComponentVisible && (
            <ReactDateRangePicker
              focusedRange={focusedRange}
              onRangeFocusChange={setFocusedRange}
              onChange={item => onDateRangePickerChange(item.selection || item.active)}
              dateDisplayFormat="MM/dd/yyyy"
              showDateDisplay={false}
              staticRanges={createStaticRanges()}
              inputRanges={[]}
              moveRangeOnFirstSelection={false}
              initialFocusedRange={[0, 1]}
              showMonthArrow={false}
              ranges={getRanges()}
              disabledDay={disabledDay}
              shownDate={getShownDate()}
              preview={preview}
              onPreviewChange={onPreviewChange}
            />
          )
        }
      </div>
    </div>
  );
}

// It use https://www.npmjs.com/package/react-date-range internally
// Check the docs for further options

DateRangePicker.propTypes = {
  readOnly: PropTypes.bool,
  startDatePlaceholder: PropTypes.string,
  endDatePlaceholder: PropTypes.string,
  range: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

DateRangePicker.defaultProps = {
  readOnly: false,
  startDatePlaceholder: 'Start Date',
  endDatePlaceholder: 'End Date',
};

export default DateRangePicker;
