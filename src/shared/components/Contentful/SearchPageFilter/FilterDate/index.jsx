/**
 * The filter date rendering.
 */
import moment from 'moment';
import PT from 'prop-types';
import React from 'react';
import { themr } from 'react-css-super-themr';
import DatePicker from 'components/challenge-listing/Filters/DatePicker';
import CalendarWeek from 'react-dates/lib/components/CalendarWeek';
import IconCalendar from 'assets/images/tc-edu/icon-calendar.svg';
import defaultTheme from './themes/default.scss';

// eslint-disable-next-line no-unused-expressions, react/forbid-foreign-prop-types
CalendarWeek && CalendarWeek.propTypes && delete CalendarWeek.propTypes.children; // fixing the bug in react-dates, more detail in here https://github.com/airbnb/react-dates/issues/1121

export function FilterDateInner(props) {
  const {
    theme,
    className,
    startDate,
    endDate,
    onSelectStartDate,
    onSelectEndDate,
  } = props;

  return (
    <div className={`${theme.container} ${className}`}>
      <span className={theme.title}>From</span>
      <IconCalendar />
      <DatePicker
        displayFormat="MMM D, YYYY"
        date={startDate}
        numberOfMonths={1}
        id="date-picker-start-date"
        onDateChange={(date) => { onSelectStartDate(date); }}
      />
      <span className={theme.separator}>-</span>
      <DatePicker
        displayFormat="MMM D, YYYY"
        date={endDate}
        numberOfMonths={1}
        id="date-picker-end-date"
        onDateChange={(date) => { onSelectEndDate(date); }}
      />
    </div>
  );
}

FilterDateInner.defaultProps = {
  className: '',
  startDate: null,
  endDate: null,
  onSelectStartDate: () => {},
  onSelectEndDate: () => {},
};

FilterDateInner.propTypes = {
  theme: PT.shape({
    container: PT.string.isRequired,
    title: PT.string.isRequired,
    separator: PT.string.isRequired,
  }).isRequired,
  className: PT.string,
  startDate: PT.instanceOf(moment),
  endDate: PT.instanceOf(moment),
  onSelectStartDate: PT.func,
  onSelectEndDate: PT.func,
};

export default themr('Contentful-Blog', defaultTheme)(FilterDateInner);
