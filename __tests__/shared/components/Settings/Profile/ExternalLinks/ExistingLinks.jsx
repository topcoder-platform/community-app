import React from 'react';
import Renderer from 'react-test-renderer/shallow';

import ExistingLinks from 'components/Settings/Profile/ExternalLinks/ExistingLinks';

import userProfile from '../../__mocks__/user-profile.json';
import profileState from '../../__mocks__/profile-state.json';

const rnd = new Renderer();

it('renders existing links section of profile setting page correctly', () => {
  rnd.render((<ExistingLinks
    handle=""
    tokenV3=""
    profile={userProfile}
    profileState={profileState}
    allLinks={[]}
    supportedAccounts={[]}
    deleteWebLink={() => {}}
    unlinkExternalAccount={() => {}}
  />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
