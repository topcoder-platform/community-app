import React from 'react';
import Renderer from 'react-test-renderer/shallow';

import Datepicker from 'components/GUIKit/Datepicker';


const rnd = new Renderer();

it('Default render', () => {
  rnd.render((<Datepicker />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
