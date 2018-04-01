import React from 'react';
import FiltersSwitch from 'components/challenge-listing/Filters/FiltersSwitch';

import {
  findInDomByClass,
  renderDom,
  shallowSnapshot,
  simulate,
} from 'topcoder-react-utils/jest-utils';

const onSwitch = jest.fn();

const mockDatas = [{
  active: false,
  filtersCount: 0,
  onSwitch,
  className: 'name',
}, {
  active: true,
  filtersCount: 5,
  onSwitch,
  className: 'name',
}];

test('Matches shallow shapshot', () => {
  mockDatas.forEach(data => shallowSnapshot(<FiltersSwitch {...data} />));
});

test('handle events', () => {
  const dom = renderDom(<FiltersSwitch {...mockDatas[1]} />);
  const matches = findInDomByClass(dom, 'tc-outline-btn');
  simulate.click(matches);
  expect(onSwitch).toHaveBeenCalledTimes(1);
});

