import React from 'react';
import Rnd from 'react-test-renderer/shallow';
import Dropdown from 'components/tc-communities/Dropdown';

const rnd = new Rnd();

const dropdownOptions = [
  {
    label: 'iOS Community',
    value: '1',
  }, {
    label: 'Predix Topcoder',
    value: '2',
  }, {
    label: 'Cognitive Topcoder',
    value: '3',
  }, {
    label: 'Android Community',
    value: '4',
  },
];

test('Snapshot match', () => {
  rnd.render((
    <Dropdown
      options={dropdownOptions}
      value={dropdownOptions[0]}
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
