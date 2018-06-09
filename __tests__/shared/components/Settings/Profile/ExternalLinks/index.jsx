import React from 'react';
import Renderer from 'react-test-renderer/shallow';

import ExternalLinks from 'components/Settings/Profile/ExternalLinks';

import userProfile from '../../__mocks__/user-profile.json';
import profileState from '../../__mocks__/profile-state.json';

const rnd = new Renderer();

it('renders external links section of profile setting page correctly', () => {
  rnd.render((<ExternalLinks
    handle=""
    tokenV3=""
    profile={userProfile}
    profileState={profileState}
    settingsPageState={{}}
    addWebLink={() => {}}
    deleteWebLink={() => {}}
    linkExternalAccount={() => {}}
    unlinkExternalAccount={() => {}}
  />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
