import React from 'react';
import Renderer from 'react-test-renderer/shallow';

import Tracks from 'components/Settings/Profile/Tracks';

import userProfile from '../../__mocks__/user-profile.json';

const rnd = new Renderer();

it('renders tracks section of profile setting page correctly', () => {
  rnd.render((<Tracks
    tracks={userProfile.tracks}
    onUpdateTracks={() => { }}
  />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
