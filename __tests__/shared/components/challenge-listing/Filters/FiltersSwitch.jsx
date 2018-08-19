import React from 'react';
import FiltersSwitch from 'components/challenge-listing/Filters/FiltersSwitch';

import { JU } from 'topcoder-react-utils';

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
  mockDatas.forEach(data => JU.shallowSnapshot(<FiltersSwitch {...data} />));
});

test('handle events', () => {
  const dom = JU.renderDom(<FiltersSwitch {...mockDatas[1]} />);
  const matches = JU.findInDomByClass(dom, 'tc-outline-btn');
  JU.simulate.click(matches);
  expect(onSwitch).toHaveBeenCalledTimes(1);
});
