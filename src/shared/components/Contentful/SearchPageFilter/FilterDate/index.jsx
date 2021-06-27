/**
 * The filter date rendering.
 */
import moment from 'moment';
import PT from 'prop-types';
import React from 'react';
import { themr } from 'react-css-super-themr';
import Datepicker from 'components/GUIKit/Datepicker';
import CalendarWeek from 'react-dates/lib/components/CalendarWeek';
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
      <Datepicker
        label="Date Start"
        value={startDate}
        onChange={(date) => {
          if (date instanceof Date) onSelectStartDate(moment(date));
        }}
        size="xs"
        isOutsideRange={day => moment().isBefore(day)}
        displayFormat="M/DD/YYYY"
        hideCustomInputIcon
        errorMsg={startDate > endDate ? 'From should be before end' : null}
      />
      <div className={theme.separator} />
      <Datepicker
        label="Date End"
        value={endDate}
        onChange={(date) => {
          if (date instanceof Date) onSelectEndDate(moment(date));
        }}
        size="xs"
        isOutsideRange={day => moment().isSameOrBefore(day)}
        displayFormat="M/DD/YYYY"
        hideCustomInputIcon
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
