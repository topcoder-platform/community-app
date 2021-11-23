import React from 'react';
import Renderer from 'react-test-renderer/shallow';

import Account from 'components/Settings/Account';

import userProfile from '../__mocks__/user-profile.json';
import profileState from '../__mocks__/profile-state.json';

const rnd = new Renderer();

const settingsUI = {
  TABS: {
    ACCOUNT: {
      MYACCOUNT: 'my account',
      // LINKEDACCOUNT: 'linked account',
    },
  },
};

it('renders account setting page correctly', () => {
  rnd.render((<Account
    tokenV3=""
    profile={userProfile}
    profileState={profileState}
    settingsPageState={{}}
    updatePassword={() => {}}
    clearIncorrectPassword={() => {}}
    updateProfile={() => {}}
    settingsUI={settingsUI}
  />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
