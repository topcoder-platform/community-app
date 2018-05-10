import React from 'react';
import Renderer from 'react-test-renderer/shallow';

import NameAddress from 'components/Settings/Account/NameAddress';

import userProfile from '../../__mocks__/user-profile.json';
import profileState from '../../__mocks__/profile-state.json';

const rnd = new Renderer();

it('renders name & address section of account setting page correctly', () => {
  rnd.render((<NameAddress
    tokenV3=""
    profile={userProfile}
    profileState={profileState}
    updateProfile={() => {}}
  />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
