import React from 'react';
import PT from 'prop-types';

import moment from 'moment';
import ReactSelect from 'react-select';
import DatePicker from 'components/GUIKit/Datepicker';
import styles from './styles.scss';

const renderResetButton = props => (
  <div style={{ display: 'flex' }} className="reset-btn-container">
    <button
      type="button"
      onClick={() => {
        props.onChange(null);
      }}
    >
      RESET
    </button>
  </div>
);

renderResetButton.defaultProps = {
  onChange: () => {},
};

renderResetButton.propTypes = {
  onChange: PT.func,
};

const renderDatePickerMonthElement = ({ month, onMonthSelect, onYearSelect }) => {
  const monthOptions = moment.months().map((label, value) => ({
    value, label,
  }));

  const yearOptions = [];
  for (let year = moment().year(), i = year; i > year - 99; i -= 1) {
    yearOptions.push({ value: i, label: `${i}` });
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div>
        <ReactSelect
          value={month.month()}
          options={monthOptions}
          onChange={(option) => {
            onMonthSelect(month, option.value);
          }}
          placeholder="Month"
          clearable={false}
          autosize={false}
          searchable={false}
          autoBlur={false}
        />
      </div>
      <div>
        <ReactSelect
          value={month.year()}
          options={yearOptions}
          onChange={(option) => {
            onYearSelect(month, option.value);
          }}
          placeholder="Year"
          clearable={false}
          autosize={false}
          searchable={false}
          autoBlur={false}
        />
      </div>
    </div>
  );
};

renderDatePickerMonthElement.propTypes = {
  month: PT.number.isRequired,
  onMonthSelect: PT.func.isRequired,
  onYearSelect: PT.func.isRequired,
};

export default function FormInputDatePicker(props) {
  const { value, onChange } = props;

  return (
    <DatePicker
      {...props}
      value={value ? moment(value).toDate() : null}
      onChange={date => onChange(date ? date.toISOString() : '')}
      renderCalendarInfo={() => renderResetButton(props)}
      renderMonthElement={renderDatePickerMonthElement}
      className={styles.formInputDatePicker}
    />
  );
}

FormInputDatePicker.defaultProps = {
  value: null,
  placeholder: '',
  label: '',
  onChange: () => {},
  isOutsideRange: () => false,
  isDayBlocked: () => false,
  displayFormat: 'MM/DD/YYYY',
  id: '',
  readOnly: false,
  showClearDate: false,
  anchorDirection: 'left',
};


FormInputDatePicker.propTypes = {
  value: PT.any,
  placeholder: PT.string,
  label: PT.string,
  onChange: PT.func,
  isOutsideRange: PT.func,
  isDayBlocked: PT.func,
  displayFormat: PT.string,
  id: PT.string,
  readOnly: PT.bool,
  showClearDate: PT.bool,
  anchorDirection: PT.oneOf(['left', 'right']),
};
