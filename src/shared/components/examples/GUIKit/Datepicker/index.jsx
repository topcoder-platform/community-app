import React from 'react';
import Datepicker from 'components/GUIKit/Datepicker';

import './style.scss';

export default function DatepickerExample() {
  const values = [
    {
      key: 2,
      placeholder: 'Available From',
      label: '',
      value: null,
      required: false,
      errorMsg: '',
      sectionTitle: 'Empty',
    },
    {
      key: 3,
      placeholder: 'Available From',
      label: 'Available From',
      value: new Date(),
      required: false,
      errorMsg: '',
      sectionTitle: 'Filled',
    },
    {
      key: 4,
      placeholder: 'Available From',
      label: 'Available From',
      value: new Date(),
      required: false,
      errorMsg: 'This date is wrong. Please check it again.',
      sectionTitle: 'Error',
    },
    {
      key: 5,
      placeholder: 'Available From',
      label: 'Available From',
      value: new Date(),
      required: true,
      errorMsg: '',
      sectionTitle: 'Require',
    },
  ];

  // eslint-disable-next-line no-console
  const onChange = value => console.log('onChange', value);
  return (
    <div styleName="container">
      {values.map(value => (
        <div styleName="rowItem" key={value.key}>
          <span styleName="sectionTitle">{value.sectionTitle}</span>
          <Datepicker
            placeholder={value.placeholder}
            label={value.label}
            value={value.value}
            required={value.required}
            errorMsg={value.errorMsg}
            onChange={onChange}
          />
        </div>
      ))}
    </div>
  );
}
