import React from 'react';
import DropdownTerms from 'components/GUIKit/DropdownTerms';
import _ from 'lodash';

import './style.scss';

export default function DropdownTermsExample() {
  const options = [
    { label: 'EJB', selected: false },
    { label: 'Java', selected: true },
    { label: 'Javascript', selected: false },
    { label: 'MangoDB', selected: false },
    { label: 'Oracle', selected: false },
    { label: 'React', selected: false },
    { label: 'Serverlet', selected: false },
    { label: 'Web Services', selected: false },
    { label: 'Zipkin', selected: false },
  ];

  const values = [
    {
      key: 1,
      options: _.cloneDeep(options.map(o => ({ ...o, selected: false }))),
      label: 'Tech Skills',
      required: false,
      placeholder: 'Tech Skills',
      errorMsg: '',
      sectionTitle: 'Empty',
      addNewOptionPlaceholder: 'Type to add another skill...',
    },
    {
      key: 2,
      options: _.cloneDeep(options),
      label: 'Tech Skills',
      required: false,
      placeholder: 'Tech Skills',
      errorMsg: '',
      sectionTitle: 'Filled',
      addNewOptionPlaceholder: 'Type to add another skill...',
    },
    {
      key: 4,
      options: _.cloneDeep(options),
      label: 'Tech Skills',
      required: false,
      placeholder: 'Tech Skills',
      errorMsg: 'The skill is wrong. Please check it again.',
      sectionTitle: 'Error',
      addNewOptionPlaceholder: 'Type to add another skill...',
    },
    {
      key: 5,
      options: _.cloneDeep(options.map(o => ({ ...o, selected: false }))),
      label: 'Tech Skills',
      required: true,
      placeholder: 'Tech Skills',
      errorMsg: '',
      sectionTitle: 'Require',
      addNewOptionPlaceholder: 'Type to add another skill...',
    },
  ];

  // eslint-disable-next-line no-console
  const onChange = value => console.log('onChange', value);
  return (
    <div styleName="container">
      {values.map(value => (
        <div styleName="rowItem" key={value.key}>
          <span styleName="sectionTitle">{value.sectionTitle}</span>
          <DropdownTerms
            onChange={changedOptions => onChange(changedOptions)}
            terms={value.options}
            label={value.label}
            required={value.required}
            placeholder={value.placeholder}
            errorMsg={value.errorMsg}
            addNewOptionPlaceholder={value.addNewOptionPlaceholder}
          />
        </div>
      ))}
    </div>
  );
}
