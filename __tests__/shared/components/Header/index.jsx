import React from 'react';
import Renderer from 'react-test-renderer/shallow';

import Header from 'components/Header';

import profileState from './__mocks__/profile-state.json';


const rnd = new Renderer();

it('Default render', () => {
  rnd.render((<Header
    profile={profileState}
  />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
