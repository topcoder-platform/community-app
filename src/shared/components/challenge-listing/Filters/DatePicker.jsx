import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import _ from 'lodash';
import moment from 'moment';

import { SingleDatePicker } from 'react-dates';
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

  render() {
    const { focused } = this.state;
    const { id, date, onDateChange } = this.props;

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
        isOutsideRange={() => false}
        date={_.isEmpty(date) ? moment() : moment(date)}
        focused={focused}
        onDateChange={onDateChange}
        onFocusChange={this.onFocusChange}
      />
    );
  }
}

DatePicker.propTypes = propTypes;
DatePicker.defaultProps = defaultProps;

export default DatePicker;
