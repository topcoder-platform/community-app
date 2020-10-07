import React from 'react';
import Renderer from 'react-test-renderer/shallow';

import RadioButton from 'components/GUIKit/RadioButton';


const rnd = new Renderer();

it('Default render', () => {
  rnd.render((<RadioButton options={[{ label: 'radio', value: true }]} />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
