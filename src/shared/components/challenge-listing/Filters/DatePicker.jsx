import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import _ from 'lodash';
import moment from 'moment';

import 'react-dates/initialize';
import { SingleDatePicker, isInclusivelyBeforeDay } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import './_fix_DateInput__input.css';
import './_fix_SingleDatePicker.css';

const propTypes = {
  autoFocus: PropTypes.bool,

  ...omit({}, [
    'date',
    'onDateChange',
    'focused',
    'onFocusChange',
  ]),
};

const defaultProps = {
  autoFocus: false,

};

class DatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: props.autoFocus,
    };
    this.onFocusChange = this.onFocusChange.bind(this);
  }

  onFocusChange({ focused }) {
    this.setState({ focused });
  }

  createOptions = () => {
    const options = [];
    for (let i = -100; i <= 0; i += 1) {
      options.push(<option value={moment().year() + i}>{moment().year() + i}</option>);
    }
    return options;
  };

  render() {
    const { focused } = this.state;
    const {
      id, date, onDateChange, isOutsideRange,
    } = this.props;

    const props = omit(this.props, [
      'id',
      'autoFocus',
      'initialDate',
    ]);

    return (
      <SingleDatePicker
        {...props}
        hideKeyboardShortcutsPanel
        id={id}
        isOutsideRange={!_.isEmpty(isOutsideRange)
          ? day => !isInclusivelyBeforeDay(day, isOutsideRange)
          : () => false}
        date={_.isEmpty(date) ? undefined : moment.utc(date)}
        focused={focused}
        onDateChange={onDateChange}
        onFocusChange={this.onFocusChange}
        renderMonthElement={({ month, onMonthSelect, onYearSelect }) => (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div>
              <select
                className="CalendarDay"
                value={month.month()}
                onChange={(e) => {
                  onMonthSelect(month, e.target.value);
                }}
              >
                {moment.months().map((label, value) => (
                  <option value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                className="CalendarDay"
                value={month.year()}
                onChange={(e) => {
                  onYearSelect(month, e.target.value);
                }}
              >
                {this.createOptions()}
              </select>
            </div>
          </div>
        )}
      />
    );
  }
}

DatePicker.propTypes = propTypes;
DatePicker.defaultProps = defaultProps;

export default DatePicker;
