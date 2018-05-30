import React from 'react';
import Renderer from 'react-test-renderer/shallow';

import Credential from 'components/Settings/Account/Credential';

import userProfile from '../../__mocks__/user-profile.json';
import profileState from '../../__mocks__/profile-state.json';

const rnd = new Renderer();

it('renders credential section of account setting page correctly', () => {
  rnd.render((<Credential
    tokenV3=""
    profile={userProfile}
    profileState={profileState}
    settingsPageState={{}}
    updatePassword={() => {}}
    clearIncorrectPassword={() => {}}
  />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
