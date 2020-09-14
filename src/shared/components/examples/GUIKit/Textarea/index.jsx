import React from 'react';
import Textarea from 'components/GUIKit/Textarea';

import './style.scss';

export default function TextareaExample() {
  const values = [
    {
      key: 2,
      placeholder: 'Briefly describe your request',
      label: '',
      value: '',
      required: false,
      errorMsg: '',
      sectionTitle: 'Empty',
    },
    {
      key: 3,
      placeholder: 'Briefly describe your request',
      label: 'Briefly describe your request',
      value: 'Different members have differet reasons for joining Topcoder and that’s why I would like to propose one thing.',
      required: false,
      errorMsg: '',
      sectionTitle: 'Filled',
    },
    {
      key: 4,
      placeholder: 'Briefly describe your request',
      label: 'Briefly describe your request',
      value: 'Different members have differet reasons for joining Topcoder and that’s why I would like to propose one thing.',
      required: false,
      errorMsg: 'Your request is wrong. Please check it again.',
      sectionTitle: 'Error',
    },
    {
      key: 5,
      placeholder: 'Briefly describe your request',
      label: 'Briefly describe your request',
      value: 'Different members have differet reasons for joining Topcoder and that’s why I would like to propose one thing.',
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
          <Textarea
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
