import React from 'react';
import Renderer from 'react-test-renderer/shallow';

import Header from 'components/ProfilePage/Header';

import fullProfile from '../__mocks__/full-profile.json';

const rnd = new Renderer();

it('renders profile about header correctly', () => {
  rnd.render((<Header
    country={fullProfile.country}
    info={fullProfile.info}
  />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
