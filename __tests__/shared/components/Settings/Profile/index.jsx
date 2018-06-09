import React from 'react';
import Renderer from 'react-test-renderer/shallow';

import Profile from 'components/Settings/Profile';

import userProfile from '../__mocks__/user-profile.json';
import profileState from '../__mocks__/profile-state.json';

const rnd = new Renderer();

it('renders profile setting page correctly', () => {
  rnd.render((<Profile
    handle=""
    tokenV3=""
    profile={userProfile}
    profileState={profileState}
    settingsPageState={{}}
    lookupData={{}}
    updateProfile={() => {}}
    uploadPhoto={() => {}}
    deletePhoto={() => {}}
    addSkill={() => {}}
    hideSkill={() => {}}
  />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
