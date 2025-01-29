import React from 'react';
import Renderer from 'react-test-renderer/shallow';

import Header from 'components/Settings/Header';

import profileState from '../__mocks__/profile-state.json';

const rnd = new Renderer();

it('renders setting page header correctly', () => {
  rnd.render((<Header
    profileState={profileState}
    xlBadge="SRM Engagement Honor"
    showXlBadge={() => {}}
  />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
