import React from 'react';
import Checkbox from 'components/GUIKit/Checkbox';

import './style.scss';

export default function CheckboxExample() {
  const checkValues = [
    {
      label: '',
      key: 1,
      checked: false,
      size: 'lg',
    },
    {
      label: '',
      key: 2,
      checked: true,
      size: 'lg',
    },
    {
      label: '',
      key: 3,
      checked: false,
      size: 'sm',
    },
    {
      label: '',
      key: 4,
      checked: true,
      size: 'sm',
    },
    {
      label: '',
      key: 5,
      checked: false,
      size: 'xs',
    },
    {
      label: '',
      key: 6,
      checked: true,
      size: 'xs',
    },
    {
      label: 'Option 1',
      key: 7,
      checked: true,
      size: 'lg',
    },
    {
      label: 'Option 1',
      key: 8,
      checked: true,
      size: 'sm',
    },
    {
      label: 'Option 1',
      key: 9,
      checked: true,
      size: 'xs',
    },
    {
      label: 'Option 2',
      key: 10,
      checked: false,
      size: 'lg',
    },
    {
      label: 'Option 2',
      key: 11,
      checked: false,
      size: 'sm',
    },
    {
      label: 'Option 2',
      key: 12,
      checked: false,
      size: 'xs',
    },
  ];

  // eslint-disable-next-line no-console
  const onChange = value => console.log('onChange', value);
  return (
    <div styleName="container">
      <div styleName="grid1">
        <div styleName="grid11">
          <div styleName="grid111">
            <Checkbox
              onChange={checked => onChange(checked)}
              size={checkValues[0].size}
              checked={checkValues[0].checked}
            />
          </div>
          <Checkbox
            onChange={checked => onChange(checked)}
            size={checkValues[1].size}
            checked={checkValues[1].checked}
          />
        </div>
        <div styleName="grid11">
          <div styleName="grid111">
            <Checkbox
              onChange={checked => onChange(checked)}
              size={checkValues[2].size}
              checked={checkValues[2].checked}
            />
          </div>
          <Checkbox
            onChange={checked => onChange(checked)}
            size={checkValues[3].size}
            checked={checkValues[3].checked}
          />
        </div>
        <div styleName="grid11">
          <div styleName="grid111">
            <Checkbox
              onChange={checked => onChange(checked)}
              size={checkValues[4].size}
              checked={checkValues[4].checked}
            />
          </div>
          <Checkbox
            onChange={checked => onChange(checked)}
            size={checkValues[5].size}
            checked={checkValues[5].checked}
          />
        </div>
      </div>
      <div styleName="grid2">
        <span styleName="grid2Label">Examples usage</span>
        <div styleName="grid21">
          <div styleName="grid211">
            <div styleName="grid2111">
              <Checkbox
                onChange={checked => onChange(checked)}
                size={checkValues[6].size}
                checked={checkValues[6].checked}
              />
              <span>{checkValues[6].label}</span>
            </div>
            <div styleName="grid2111">
              <Checkbox
                onChange={checked => onChange(checked)}
                size={checkValues[7].size}
                checked={checkValues[7].checked}
              />
              <span>{checkValues[7].label}</span>
            </div>
            <div styleName="grid2111">
              <Checkbox
                onChange={checked => onChange(checked)}
                size={checkValues[8].size}
                checked={checkValues[8].checked}
              />
              <span>{checkValues[8].label}</span>
            </div>
          </div>
          <div styleName="grid211">
            <div styleName="grid2111">
              <Checkbox
                onChange={checked => onChange(checked)}
                size={checkValues[9].size}
                checked={checkValues[9].checked}
              />
              <span>{checkValues[9].label}</span>
            </div>
            <div styleName="grid2111">
              <Checkbox
                onChange={checked => onChange(checked)}
                size={checkValues[10].size}
                checked={checkValues[10].checked}
              />
              <span>{checkValues[10].label}</span>
            </div>
            <div styleName="grid2111">
              <Checkbox
                onChange={checked => onChange(checked)}
                size={checkValues[11].size}
                checked={checkValues[11].checked}
              />
              <span>{checkValues[11].label}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
