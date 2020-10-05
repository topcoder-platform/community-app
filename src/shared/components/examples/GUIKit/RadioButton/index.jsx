import React from 'react';
import RadioButton from 'components/GUIKit/RadioButton';

import './style.scss';

export default function RadioButtonExample() {
  const values = [
    {
      key: 1,
      options: [{ label: '', value: false }, { label: '', value: true }],
      size: 'lg',
    },
    {
      key: 3,
      options: [{ label: '', value: false }, { label: '', value: true }],
      size: 'sm',
    },
    {
      key: 5,
      options: [{ label: '', value: false }, { label: '', value: true }],
      size: 'xs',
    },
    {
      key: 7,
      options: [{ label: 'Option 1', value: true }, { label: 'Option 2', value: false }],
      size: 'lg',
    },
    {
      key: 8,
      options: [{ label: 'Option 1', value: true }, { label: 'Option 2', value: false }],
      size: 'sm',
    },
    {
      key: 9,
      options: [{ label: 'Option 1', value: true }, { label: 'Option 2', value: false }],
      size: 'xs',
    },
  ];

  // eslint-disable-next-line no-console
  const onChange = value => console.log('onChange', value);
  return (
    <div styleName="container">
      <div styleName="grid1">
        <RadioButton
          onChange={options => onChange(options)}
          size={values[0].size}
          options={values[0].options}
        />
        <RadioButton
          onChange={options => onChange(options)}
          size={values[1].size}
          options={values[1].options}
        />
        <RadioButton
          onChange={options => onChange(options)}
          size={values[2].size}
          options={values[2].options}
        />
      </div>
      <div styleName="grid2">
        <span styleName="grid2Label">Examples usage</span>
        <div styleName="grid21">
          <RadioButton
            onChange={options => onChange(options)}
            size={values[3].size}
            options={values[3].options}
          />
          <RadioButton
            onChange={options => onChange(options)}
            size={values[4].size}
            options={values[4].options}
          />
          <RadioButton
            onChange={options => onChange(options)}
            size={values[5].size}
            options={values[5].options}
          />
        </div>
      </div>
    </div>
  );
}
