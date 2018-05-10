import React from 'react';
import Renderer from 'react-test-renderer/shallow';

import EmailPreferences from 'components/Settings/EmailPreferences';

import userProfile from '../__mocks__/user-profile.json';
import profileState from '../__mocks__/profile-state.json';

const rnd = new Renderer();

it('renders email preferences correctly', () => {
  rnd.render((<EmailPreferences
    tokenV3=""
    profile={userProfile}
    profileState={profileState}
    saveEmailPreferences={() => {}}
  />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
