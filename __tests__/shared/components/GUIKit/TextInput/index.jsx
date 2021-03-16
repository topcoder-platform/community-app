import React from 'react';
import Renderer from 'react-test-renderer/shallow';

import TextInput from 'components/GUIKit/TextInput';


const rnd = new Renderer();

it('Default render', () => {
  rnd.render((<TextInput />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
