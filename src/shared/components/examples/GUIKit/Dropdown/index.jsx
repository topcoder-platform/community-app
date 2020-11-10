import React from 'react';
import Dropdown from 'components/GUIKit/Dropdown';
import _ from 'lodash';
import PT from 'prop-types';

import './style.scss';

function DropdownExample({ size }) {
  const options = [
    { label: 'Afghanistan', selected: false },
    { label: 'Albania', selected: true },
    { label: 'Andorra', selected: false },
    { label: 'Anguilla', selected: false },
    { label: 'Belgium', selected: false },
    { label: 'Brazil', selected: false },
  ];

  const values = [
    {
      key: 1,
      options: _.cloneDeep(options.map(o => ({ ...o, selected: false }))),
      label: 'Country',
      required: false,
      placeholder: 'Select country',
      errorMsg: '',
      sectionTitle: 'Empty',
    },
    {
      key: 2,
      options: _.cloneDeep(options),
      label: 'Country',
      required: false,
      placeholder: '',
      errorMsg: '',
      sectionTitle: 'Filled',
    },
    {
      key: 4,
      options: _.cloneDeep(options),
      label: 'Country',
      required: false,
      placeholder: '',
      errorMsg: 'The country is wrong. Please check it again.',
      sectionTitle: 'Error',
    },
    {
      key: 3,
      options: _.cloneDeep(options),
      label: 'Country',
      required: true,
      placeholder: '',
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
          <Dropdown
            onChange={changedOptions => onChange(changedOptions)}
            options={value.options}
            label={value.label}
            required={value.required}
            placeholder={value.placeholder}
            errorMsg={value.errorMsg}
            size={size}
          />
        </div>
      ))}
    </div>
  );
}

DropdownExample.defaultProps = {
  size: 'lg',
};

DropdownExample.propTypes = {
  size: PT.oneOf(['xs', 'lg']),
};

export default DropdownExample;
