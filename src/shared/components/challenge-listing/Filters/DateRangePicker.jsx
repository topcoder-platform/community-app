/* eslint react/prop-types: 0 */ // startDate and endDate are instances of Moment

/**
 * This is an auxiliary wrapper around the DateRangePicker from the react-dates
 * package. It takes care about focus management and styling, leaving for the
 * parent component to deal with the dates handling in the same way the wrapped
 * DateRangePicker demands to do it. I.e. you should pass in via 'startDate' and
 * 'endDate' properties the dates to show in the component (both should be
 * instances of the MomentJS object), and it triggers the callback provided via
 * the 'onDatesChanged' property, if any, passing in the object having
 * 'startDate' and 'endDate' fields the user wants to set.
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import 'react-dates/initialize';
import { DateRangePicker as WrappedDateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import './_fix_DateInput__input.css';

class DateRangePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focusedInput: null,
    };
  }

  render() {
    const {
      endDate,
      onDatesChange,
      numberOfMonths,
      readOnly,
      startDate,
      setDatepickerStatus,
    } = this.props;
    const {
      focusedInput,
    } = this.state;
    return (
      <WrappedDateRangePicker
        hideKeyboardShortcutsPanel
        numberOfMonths={numberOfMonths}
        focusedInput={focusedInput}
        isOutsideRange={() => false}
        onDatesChange={onDatesChange}
        onFocusChange={(newFocusedInput) => {
          const status = !_.isEmpty(newFocusedInput);
          setDatepickerStatus(status);
          this.setState({ focusedInput: newFocusedInput });
        }}
        startDate={startDate}
        endDate={endDate}
        endDateId="date-range-picker-two-month"
        startDateId="date-range-picker-one-month"
        anchorDirection="right"
        displayFormat="MMM DD, YYYY"
        readOnly={readOnly}
      />
    );
  }
}

DateRangePicker.defaultProps = {
  onDatesChange: () => true,
  readOnly: true,
};

DateRangePicker.propTypes = {
  onDatesChange: PT.func,
  readOnly: PT.bool,
  setDatepickerStatus: PT.func.isRequired,
};

export default DateRangePicker;
