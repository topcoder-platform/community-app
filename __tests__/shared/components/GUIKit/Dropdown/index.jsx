import React from 'react';
import Renderer from 'react-test-renderer/shallow';

import Dropdown from 'components/GUIKit/Dropdown';


const rnd = new Renderer();

it('Default render', () => {
  rnd.render((<Dropdown options={[{ label: 'dropdownLable', selected: true }]} />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
