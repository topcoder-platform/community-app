/**
 * The tracks date rendering.
 */
import PT from 'prop-types';
import moment from 'moment';
import React from 'react';
import { themr } from 'react-css-super-themr';
import Datepicker from 'components/GUIKit/Datepicker';
import defaultTheme from './themes/default.scss';


export function TracksDateInner(props) {
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
        onChange={(date) => { onSelectStartDate(date); }}
        size="xs"
        isOutsideRange={day => moment().isSameOrBefore(day)}
      />
      <div className={theme.separator} />
      <Datepicker
        label="Date End"
        value={endDate}
        onChange={(date) => { onSelectEndDate(date); }}
        size="xs"
        isOutsideRange={day => moment().isSameOrBefore(day)}
      />
    </div>
  );
}

TracksDateInner.defaultProps = {
  className: '',
  startDate: null,
  endDate: null,
  onSelectStartDate: () => { },
  onSelectEndDate: () => { },
};

TracksDateInner.propTypes = {
  theme: PT.shape({
    container: PT.string.isRequired,
    separator: PT.string.isRequired,
  }).isRequired,
  className: PT.string,
  startDate: PT.instanceOf(moment),
  endDate: PT.instanceOf(moment),
  onSelectStartDate: PT.func,
  onSelectEndDate: PT.func,
};

export default themr('Contentful-Blog', defaultTheme)(TracksDateInner);
