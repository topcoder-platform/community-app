import moment from 'moment';

const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;
  return moment(date1).isSame(moment(date2), 'day');
};

const staticRangeHandler = {
  isSelected(range) {
    const definedRange = { startDate: this.startDate, endDate: this.endDate };
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
  const now = moment().utcOffset(0);
  const pastMonth = now.clone().subtract(1, 'month');
  const past3Months = now.clone().subtract(3, 'month');
  const past6Months = now.clone().subtract(6, 'month');
  const pastYear = now.clone().subtract(1, 'year');

  const ranges = [
    {
      label: 'Past Month',
      startDate: pastMonth.startOf('day').toDate(),
      endDate: now.clone().endOf('day').toDate(),
    },
    {
      label: 'Past 6 Months',
      startDate: past6Months.startOf('day').toDate(),
      endDate: now.clone().endOf('day').toDate(),
    },
    {
      label: 'Custom Date',
      startDate: null,
      endDate: null,
      isCustom: true,
    },
    {
      label: 'Past 3 Month',
      startDate: past3Months.startOf('day').toDate(),
      endDate: now.clone().endOf('day').toDate(),
    },
    {
      label: 'Past 1 Year',
      startDate: pastYear.startOf('day').toDate(),
      endDate: now.clone().endOf('day').toDate(),
    },

  ];

  return ranges.map(range => ({ ...staticRangeHandler, ...range }));
}

export default createStaticRanges;
