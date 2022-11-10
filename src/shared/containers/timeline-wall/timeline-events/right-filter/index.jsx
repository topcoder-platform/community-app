import React, { useEffect, useState } from 'react';
import PT from 'prop-types';
import moment from 'moment';
import cn from 'classnames';
import IconTooltipLeft from 'assets/images/timeline-wall/tooltip-left.svg';
import IconTooltipLeftMobileBlue from 'assets/images/timeline-wall/tooltip-left-mobile-blue.svg';
import IconCloseBlack from 'assets/images/tc-edu/icon-close-big.svg';

import './styles.scss';

function RightFilter({ className, selectedFilterValue, setSelectedFilterValue }) {
  const [yearList, setYearList] = useState([]);

  useEffect(() => {
    const year = [];
    const currentTime = new Date();
    const thisYear = currentTime.getFullYear();
    const thisMonth = currentTime.getMonth();

    for (let i = thisYear; i >= 2002;) {
      const months = [];
      const maxMonth = i === thisYear ? thisMonth : 11;
      for (let month = maxMonth; month >= 0;) {
        months.push({
          value: month,
          label: moment().month(month).format('MMMM'),
        });
        month -= 1;
      }
      year.push({
        year: i,
        months,
      });
      i -= 1;
    }
    setYearList(year);
  }, []);


  return (
    <div className={className} styleName="container">
      <div styleName="header hide-desktop show-mobile">
        <span>Timeline Wall</span>
        <button
          onClick={() => {
            setSelectedFilterValue(selectedFilterValue);
          }}
          type="button"
        >
          <IconCloseBlack width="14" height="14" />
        </button>
      </div>

      <div styleName="content">
        {yearList.map((yearObject) => {
          const isOnlyYearSelected = yearObject.year === selectedFilterValue.year
            && selectedFilterValue.month < 0;
          const isYearSelected = yearObject.year === selectedFilterValue.year;
          return (
            <div key={yearObject.year} styleName="list-item">
              <button
                styleName={cn('block-item', {
                  selected: isYearSelected,
                  'full-selected': isOnlyYearSelected,
                })}
                onClick={() => {
                  if (isOnlyYearSelected) {
                    setSelectedFilterValue({
                      year: 0,
                      month: -1,
                    });
                  } else {
                    setSelectedFilterValue({
                      year: yearObject.year,
                      month: -1,
                    });
                  }
                }}
                type="button"
              >
                <IconTooltipLeft styleName="select-indicator" />
                <IconTooltipLeftMobileBlue styleName="select-indicator-mobile" />
                <div styleName="block-item-title"><div styleName="minus" /><span>{yearObject.year}</span></div>
              </button>
              <div styleName={cn('child-list', {
                'month-selected': yearObject.year === selectedFilterValue.year && selectedFilterValue.month >= 0,
              })}
              >
                {yearObject.months.map((month) => {
                  const isMonthSelected = yearObject.year === selectedFilterValue.year
                    && selectedFilterValue.month === month.value;
                  return (
                    <button
                      styleName={cn('block-item', {
                        selected: isMonthSelected,
                        'full-selected': isMonthSelected,
                      })}
                      type="button"
                      onClick={() => {
                        if (isMonthSelected) {
                          setSelectedFilterValue({
                            year: 0,
                            month: -1,
                          });
                        } else {
                          setSelectedFilterValue({
                            year: yearObject.year,
                            month: month.value,
                          });
                        }
                      }}
                      key={month.value}
                    >
                      <IconTooltipLeft styleName="select-indicator" />
                      <IconTooltipLeftMobileBlue styleName="select-indicator-mobile" />
                      <div styleName="minus hide-desktop show-mobile" />
                      <span>{month.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Default values for Props
 */
RightFilter.defaultProps = {
  className: '',
  selectedFilterValue: {
    year: 0,
    month: -1,
  },
  setSelectedFilterValue: () => { },
};

/**
 * Prop Validation
 */
RightFilter.propTypes = {
  className: PT.string,
  selectedFilterValue: PT.shape(),
  setSelectedFilterValue: PT.func,
};

export default RightFilter;
