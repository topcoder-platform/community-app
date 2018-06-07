import React from 'react';
import Renderer from 'react-test-renderer/shallow';

import Preferences from 'components/Settings/Preferences';

const rnd = new Renderer();

it('renders preferences setting page correctly', () => {
  rnd.render((<Preferences />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
