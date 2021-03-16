import React from 'react';
import TextInput from 'components/GUIKit/TextInput';
import PT from 'prop-types';

import './style.scss';

function TextInputExample({ size }) {
  const values = [
    {
      key: 2,
      placeholder: 'Pick a username',
      label: '',
      value: '',
      required: false,
      errorMsg: '',
      sectionTitle: 'Empty',
    },
    {
      key: 3,
      placeholder: 'Pick a username',
      label: 'Username',
      value: 'Adam Morehead',
      required: false,
      errorMsg: '',
      sectionTitle: 'Filled',
    },
    {
      key: 4,
      placeholder: 'Pick a username',
      label: 'Username',
      value: 'Adam Morehead',
      required: false,
      errorMsg: 'This username is wrong. Please check it again.',
      sectionTitle: 'Error',
    },
    {
      key: 5,
      placeholder: 'Pick a username',
      label: 'Username',
      value: 'Adam Morehead',
      required: true,
      errorMsg: '',
      sectionTitle: 'Required',
    },
  ];

  // eslint-disable-next-line no-console
  const onChange = value => console.log('onChange', value);
  return (
    <div styleName="container">
      {values.map(value => (
        <div styleName="rowItem" key={value.key}>
          <span styleName="sectionTitle">{value.sectionTitle}</span>
          <TextInput
            placeholder={value.placeholder}
            label={value.label}
            value={value.value}
            required={value.required}
            errorMsg={value.errorMsg}
            onChange={onChange}
            size={size}
          />
        </div>
      ))}
    </div>
  );
}

TextInputExample.defaultProps = {
  size: 'lg',
};

TextInputExample.propTypes = {
  size: PT.oneOf(['xs', 'lg']),
};

export default TextInputExample;
