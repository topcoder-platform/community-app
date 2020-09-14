import React from 'react';
import Renderer from 'react-test-renderer/shallow';

import Checkbox from 'components/GUIKit/Checkbox';


const rnd = new Renderer();

it('Default render', () => {
  rnd.render((<Checkbox />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
