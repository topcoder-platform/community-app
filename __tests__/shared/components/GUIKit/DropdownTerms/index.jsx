import React from 'react';
import Renderer from 'react-test-renderer/shallow';

import DropdownTerms from 'components/GUIKit/DropdownTerms';


const rnd = new Renderer();

it('Default render', () => {
  rnd.render((<DropdownTerms terms={[{ label: 'dropdownLabel', selected: true }]} />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
