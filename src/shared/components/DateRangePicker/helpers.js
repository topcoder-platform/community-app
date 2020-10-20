import { useEffect, useRef, useState } from 'react';
import moment from 'moment';

/**
 * Check whether the dates are same
 * @param {Date} date1.
 * @param {Date} date2.
 * @return {boolean}
 */
export function isSameDay(date1, date2) {
  if (!date1 || !date2) return false;
  return moment(date1).isSame(moment(date2), 'day');
}

/**
 * Check whether the date1 is occur before date2
 * @param {Date} date1.
 * @param {Date} date2.
 * @return {boolean}
 */
export function isBeforeDay(date1, date2) {
  if (!date1 || !date2) return false;
  return moment(date1).isBefore(moment(date2), 'day');
}

/**
 * Check whether the date1 is occur after date2
 * @param {Date} date1.
 * @param {Date} date2.
 * @return {boolean}
 */
export function isAfterDay(date1, date2) {
  if (!date1 || !date2) return false;
  return moment(date1).isAfter(moment(date2), 'day');
}

const staticRangeHandler = {
  range: {},
  isSelected(range) {
    const definedRange = this.range();
    return (
      isSameDay(range.startDate, definedRange.startDate)
      && isSameDay(range.endDate, definedRange.endDate)
    );
  },
};

/**
 * Create defined date ranges
 * @return {object[]} list of defined ranges
 */
export function createStaticRanges() {
  const now = moment();
  const pastWeek = moment().subtract(1, 'week');
  const pastMonth = moment().subtract(1, 'month');
  const past6Months = moment().subtract(6, 'month');
  const pastYear = moment().subtract(1, 'year');

  const ranges = [
    {
      label: 'Past Week',
      range: () => ({
        startDate: pastWeek.startOf('day').toDate(),
        endDate: now.endOf('day').toDate(),
      }),
    },
    {
      label: 'Past Month',
      range: () => ({
        startDate: pastMonth.startOf('day').toDate(),
        endDate: now.endOf('day').toDate(),
      }),
    },
    {
      label: 'Past 6 Months',
      range: () => ({
        startDate: past6Months.startOf('day').toDate(),
        endDate: now.endOf('day').toDate(),
      }),
    },
    {
      label: 'Past Year',
      range: () => ({
        startDate: pastYear.startOf('day').toDate(),
        endDate: now.endOf('day').toDate(),
      }),
    },
  ];

  return ranges.map(range => ({ ...staticRangeHandler, ...range }));
}

/**
 * React hook for checking if the click is from outside the reference
 * @param {boolean} initialIsVisible true if visible and false if hidden
 */
export function useComponentVisible(initialIsVisible) {
  const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible);
  const ref = useRef(null);

  const handleHideDropdown = (event) => {
    if (event.key === 'Escape') {
      setIsComponentVisible(false);
    }
  };

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsComponentVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleHideDropdown, true);
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('keydown', handleHideDropdown, true);
      document.removeEventListener('click', handleClickOutside, true);
    };
  });

  return { ref, isComponentVisible, setIsComponentVisible };
}

export default {
  useComponentVisible,
  createStaticRanges,
};
