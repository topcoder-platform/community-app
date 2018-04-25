import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import ProfilePage from 'components/ProfilePage';

import emptyProfile from './__mocks__/empty-profile.json';
import fullProfile from './__mocks__/full-profile.json';

const rnd = new Renderer();

it('renders an empty Profile correctly', () => {
  rnd.render((<ProfilePage {...emptyProfile} />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});

it('renders a full Profile correctly', () => {
  rnd.render((<ProfilePage {...fullProfile} />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
