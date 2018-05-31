import React from 'react';
import Renderer from 'react-test-renderer/shallow';

import TabBar from 'components/Settings/TabBar';

const rnd = new Renderer();

it('renders tab bar correctly', () => {
  rnd.render((<TabBar
    settingsTab="profile"
    selectTab={() => {}}
  />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
