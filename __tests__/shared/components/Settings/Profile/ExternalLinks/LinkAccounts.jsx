import React from 'react';
import Renderer from 'react-test-renderer/shallow';

import LinkAccounts from 'components/Settings/Profile/ExternalLinks/LinkAccounts';

import userProfile from '../../__mocks__/user-profile.json';

const rnd = new Renderer();

it('renders link accounts section of profile setting page correctly', () => {
  rnd.render((<LinkAccounts
    tokenV3=""
    profile={userProfile}
    allLinks={[]}
    supportedAccounts={[]}
    linkExternalAccount={() => {}}
    unlinkExternalAccount={() => {}}
  />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
