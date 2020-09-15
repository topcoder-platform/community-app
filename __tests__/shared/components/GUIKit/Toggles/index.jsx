import React from 'react';
import Renderer from 'react-test-renderer/shallow';

import Toggles from 'components/GUIKit/Toggles';


const rnd = new Renderer();

it('Default render', () => {
  rnd.render((<Toggles />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
