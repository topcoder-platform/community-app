import React from 'react';
import Toggles from 'components/GUIKit/Toggles';

import './style.scss';

export default function TogglesExample() {
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
      label: 'Option 2',
      key: 10,
      checked: false,
      size: 'lg',
    },
  ];

  // eslint-disable-next-line no-console
  const onChange = value => console.log('onChange', value);
  return (
    <div styleName="container">
      <div styleName="grid1">
        <div styleName="grid11">
          <div styleName="grid111">
            <Toggles
              onChange={checked => onChange(checked)}
              size={checkValues[0].size}
              checked={checkValues[0].checked}
            />
          </div>
          <Toggles
            onChange={checked => onChange(checked)}
            size={checkValues[1].size}
            checked={checkValues[1].checked}
          />
        </div>
        <div styleName="grid11">
          <div styleName="grid111">
            <Toggles
              onChange={checked => onChange(checked)}
              size={checkValues[2].size}
              checked={checkValues[2].checked}
            />
          </div>
          <Toggles
            onChange={checked => onChange(checked)}
            size={checkValues[3].size}
            checked={checkValues[3].checked}
          />
        </div>
        <div styleName="grid11">
          <div styleName="grid111">
            <Toggles
              onChange={checked => onChange(checked)}
              size={checkValues[4].size}
              checked={checkValues[4].checked}
            />
          </div>
          <Toggles
            onChange={checked => onChange(checked)}
            size={checkValues[5].size}
            checked={checkValues[5].checked}
          />
        </div>
      </div>
      <div styleName="grid2">
        <span styleName="grid2Label">Examples usage</span>
        <div styleName="grid21">
          <span styleName="grid21Label">{checkValues[6].label}</span>
          <Toggles
            onChange={checked => onChange(checked)}
            size={checkValues[6].size}
            checked={checkValues[6].checked}
          />
        </div>
        <div styleName="grid21">
          <span styleName="grid21Label">{checkValues[7].label}</span>
          <Toggles
            onChange={checked => onChange(checked)}
            size={checkValues[7].size}
            checked={checkValues[7].checked}
          />
        </div>
      </div>
    </div>
  );
}
