/* eslint-disable jsx-a11y/label-has-for */
/**
 * Datepicker component.
 */
import React, { useState } from 'react';
import PT from 'prop-types';
import moment from 'moment';
import './style.scss';

import 'react-dates/initialize';
import { SingleDatePicker } from 'react-dates';
import IconCalendar from 'assets/images/tc-edu/icon-calendar.svg';
import useWindowSize from 'utils/useWindowSize';
import CalendarWeek from 'react-dates/lib/components/CalendarWeek';
import IconNext from '../Assets/Images/icon-next.svg';
import IconPrev from '../Assets/Images/icon-prev.svg';

// eslint-disable-next-line no-unused-expressions, react/forbid-foreign-prop-types
CalendarWeek && CalendarWeek.propTypes && delete CalendarWeek.propTypes.children; // fixing the bug in react-dates, more detail in here https://github.com/airbnb/react-dates/issues/1121

function Datepicker({
  value,
  placeholder,
  label,
  onChange,
  errorMsg,
  required,
}) {
  const [date, setDate] = useState(value ? moment(value) : null);
  const [focused, setFocused] = useState(false);
  const { width } = useWindowSize();
  return (
    <div
      styleName={`container ${date ? 'haveValue' : ''} ${
        errorMsg ? 'haveError' : ''
      } ${focused ? 'isFocused' : ''}`}
    >
      <SingleDatePicker
        hideKeyboardShortcutsPanel
        customInputIcon={<IconCalendar />}
        date={date}
        onDateChange={(changedDate) => {
          setDate(changedDate);
          onChange(changedDate ? changedDate.toDate() : null);
        }}
        focused={focused}
        onFocusChange={({ focused: changedFocused }) => setFocused(changedFocused)
        }
        id={`${value}-${placeholder}-${label}-${errorMsg}-${required}`}
        placeholder={`${placeholder}${placeholder && required ? ' *' : ''}`}
        inputIconPosition="after"
        numberOfMonths={1}
        navPrev={<IconPrev />}
        navNext={<IconNext />}
        displayFormat="MMM DD, YYYY"
        daySize={width > 600 ? 47 : 35}
        renderDayContents={d => (<div>{d.date ? d.date() : ''}</div>)}
        enableOutsideDays
        firstDayOfWeek={1}
        weekDayFormat="ddd"
      />
      {label ? (
        <span styleName="label">
          {label}
          {required ? <span>&nbsp;*</span> : null}
        </span>
      ) : null}
      {errorMsg ? <span styleName="errorMessage">{errorMsg}</span> : null}
    </div>
  );
}

Datepicker.defaultProps = {
  value: null,
  placeholder: '',
  label: '',
  onChange: () => {},
  errorMsg: '',
  required: false,
};

Datepicker.propTypes = {
  value: PT.instanceOf(Date),
  placeholder: PT.string,
  label: PT.string,
  onChange: PT.func,
  errorMsg: PT.string,
  required: PT.bool,
};

export default Datepicker;
