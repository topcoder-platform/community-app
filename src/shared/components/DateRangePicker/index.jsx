import React, { useState } from 'react';
import moment from 'moment';
import cn from 'classnames';
import { DateRangePicker as ReactDateRangePicker } from 'react-date-range';
import PropTypes from 'prop-types';

import ArrowNext from 'assets/images/long-arrow-next.svg';
import styles from './style.scss';

import DateInput from './DateInput';
import {
  useComponentVisible, createStaticRanges, isSameDay, isAfterDay, isBeforeDay, isSameOrAfterDay,
} from './helpers';

function DateRangePicker(props) {
  const {
    readOnly,
    startDatePlaceholder,
    endDatePlaceholder,
  } = props;

  const [range, setRange] = useState(
    {
      startDate: null,
      startDateString: '',
      endDateString: '',
      endDate: null,
      key: 'selection',
    },
  );

  const [focusedRange, setFocusedRange] = useState([0, 0]);

  const {
    ref: calendarRef,
    isComponentVisible,
    setIsComponentVisible,
  } = useComponentVisible(false);


  const onEndDateChange = (e) => {
    const endDateString = e.target.value;
    const endDate = moment(e.target.value, 'MM/DD/YYYY', true);
    if (endDate.isValid()) {
      setRange({
        ...range,
        endDate: endDate.toDate(),
        endDateString: endDate.format('MM/DD/YYYY'),
      });
    } else {
      setRange({
        ...range,
        endDateString,
      });
    }
  };

  const onStartDateChange = (e) => {
    const startDateString = e.target.value;
    const startDate = moment(e.target.value, 'MM/DD/YYYY', true);
    if (startDate.isValid()) {
      setRange({
        ...range,
        startDate: startDate.toDate(),
        startDateString: startDate.format('MM/DD/YYYY'),
      });
    } else {
      setRange({
        ...range,
        startDateString,
      });
    }
  };

  const handleRangeFocusChange = newFocusedRange => setFocusedRange(newFocusedRange);

  const onIconClickStartDate = () => {
    handleRangeFocusChange([0, 0]);
    setIsComponentVisible(!isComponentVisible);
  };

  const onIconClickEndDate = () => {
    if (range.startDateString) {
      handleRangeFocusChange([0, 1]);
      setIsComponentVisible(!isComponentVisible);
    }
  };

  const isEndDateDisabled = () => range.disabled || !range.startDate || !range.startDateString;

  const onDateRangePickerChange = (item) => {
    const isStartDateFocused = focusedRange[1] === 0;
    const isEndDateFocused = focusedRange[1] === 1;

    let shouldCloseCalendar = false;

    const payload = {
      ...item.selection,
      endDate: moment(item.selection.endDate).endOf('day').toDate(),
      endDateString: undefined,
      startDateString: undefined,
    };

    if (isStartDateFocused && isSameDay(payload.startDate, payload.endDate)) {
      if (isAfterDay(payload.startDate, range.endDate) || !range.endDate) {
        payload.endDate = payload.startDate;
        payload.endDateString = '';
      } else {
        payload.endDate = range.endDate;
      }
    } else if (isEndDateFocused) {
      if (isBeforeDay(payload.startDate, range.startDate)) {
        payload.endDate = null;
        payload.startDate = null;
      } else {
        shouldCloseCalendar = true;
      }
    } else {
      // Changes From Defined Selection (Past Week, Past Month, etc)
      shouldCloseCalendar = true;
    }

    console.dir(payload)

    payload.startDateString = payload.startDate ? moment(payload.startDate).format('MM/DD/YYYY') : '';
    if (payload.endDateString === undefined) {
      payload.endDateString = payload.endDate ? moment(payload.endDate).format('MM/DD/YYYY') : '';
    }

    setRange(payload);

    if (shouldCloseCalendar) {
      setIsComponentVisible(false);
    }
  };

  const disabledDay = day => false;

  return (
    <div>
      <div styleName="dateInputWrapper">
        <DateInput
          isFocused={focusedRange[1] === 0 && isComponentVisible}
          disabled={range.disabled}
          readOnly={readOnly}
          value={range.startDateString}
          placeholder={startDatePlaceholder}
          maskChar={null}
          onChange={onStartDateChange}
          onFocus={() => handleRangeFocusChange([0, 0])}
          onIconClick={onIconClickStartDate}
        />
        <ArrowNext styleName="arrow" />
        <DateInput
          isFocused={focusedRange[1] === 1 && isComponentVisible}
          disabled={isEndDateDisabled()}
          label="You must input start date first"
          readOnly={readOnly}
          value={range.endDateString}
          placeholder={endDatePlaceholder}
          maskChar={null}
          onChange={onEndDateChange}
          onFocus={() => handleRangeFocusChange([0, 1])}
          onIconClick={onIconClickEndDate}
        />
      </div>

      <div
        className={cn([
          styles.calendarWrapper,
          focusedRange[1] === 1 && styles.endDate,
          (!range.startDate && !range.endDate) && styles.empty
        ])}
        ref={calendarRef}
      >
        {
          isComponentVisible && (
            <ReactDateRangePicker
              focusedRange={focusedRange}
              onRangeFocusChange={handleRangeFocusChange}
              onChange={onDateRangePickerChange}
              dateDisplayFormat="MM/dd/yyyy"
              rangeColors={['#10B88A']}
              showDateDisplay={false}
              staticRanges={createStaticRanges()}
              inputRanges={[]}
              moveRangeOnFirstSelection={false}
              disabledDay={disabledDay}
              initialFocusedRange={[0,1]}
              showMonthArrow={false}
              ranges={[range]}
            />
          )
        }
      </div>
    </div>
  );
}

DateRangePicker.propTypes = {
  readOnly: PropTypes.bool,
  startDatePlaceholder: PropTypes.string,
  endDatePlaceholder: PropTypes.string,
};

DateRangePicker.defaultProps = {
  readOnly: false,
  startDatePlaceholder: 'Start Date',
  endDatePlaceholder: 'End Date',
};

export default DateRangePicker;
