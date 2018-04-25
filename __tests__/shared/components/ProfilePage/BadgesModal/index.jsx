import React from 'react';
import Renderer from 'react-test-renderer/shallow';

import BadgeModal from 'components/ProfilePage/BadgesModal';

import fullProfile from '../__mocks__/full-profile.json';

const rnd = new Renderer();

it('renders achievements correctly', () => {
  rnd.render((<BadgeModal
    achievements={fullProfile.achievements}
    handle={fullProfile.info.handle}
  />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
