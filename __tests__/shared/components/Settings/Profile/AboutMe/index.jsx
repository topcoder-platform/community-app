import React from 'react';
import Renderer from 'react-test-renderer/shallow';

import AboutMe from 'components/Settings/Profile/AboutMe';

import userProfile from '../../__mocks__/user-profile.json';
import profileState from '../../__mocks__/profile-state.json';

const rnd = new Renderer();

it('renders about me section of profile setting page correctly', () => {
  rnd.render((<AboutMe
    handle=""
    tokenV3=""
    profile={userProfile}
    profileState={profileState}
    bio={userProfile.description}
    countryCode={userProfile.competitionCountryCode}
    onUpdateCountry={() => {}}
    onUpdateBio={() => {}}
    uploadPhoto={() => {}}
    deletePhoto={() => {}}
  />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
