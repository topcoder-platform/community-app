/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-plusplus */
import moment from 'moment/moment';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';

import PT from 'prop-types';

import './styles.scss';
import _ from 'lodash';

const Filter = ({
  selectedYear, setSelectedYear, selectedMonth, setSelectedMonth,
}) => {
  const minYear = 2002;
  const currentYear = moment().format('YYYY');
  const months = ['January', 'February', 'March', 'April', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const renderMonth = () => _.reverse(months).map((month, index) => {
    const currentItem = new Date(selectedYear, 11 - index);
    const isPrior = moment().isBefore(moment(currentItem));
    if (!isPrior) {
      return (
        <p
          key={uuidv4()}
          styleName={`month ${selectedMonth === month ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            setSelectedMonth(month);
          }}
        >{month}
        </p>
      );
    }
    return null;
  });

  const renderYear = () => {
    const elements = [];
    for (let year = currentYear; year >= minYear; --year) {
      elements.push(
        <React.Fragment>

          <p
            key={uuidv4()}
            styleName={`year ${selectedYear === year ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setSelectedYear(year);
            }}
          >{year}
          </p>
          { selectedYear === year ? renderMonth() : null }
        </React.Fragment>,
      );
    }

    return elements;
  };

  return (
    <div styleName="filter">
      {renderYear()}
    </div>
  );
};

Filter.defaultProps = {
  selectedYear: 0,
  selectedMonth: '',
};

Filter.propTypes = {
  selectedYear: PT.number,
  setSelectedYear: PT.func.isRequired,
  selectedMonth: PT.string,
  setSelectedMonth: PT.func.isRequired,
};

export default Filter;
