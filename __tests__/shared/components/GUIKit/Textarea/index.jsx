import React from 'react';
import Renderer from 'react-test-renderer/shallow';

import Textarea from 'components/GUIKit/Textarea';


const rnd = new Renderer();

it('Default render', () => {
  rnd.render((<Textarea />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
