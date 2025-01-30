import React from 'react';
import Renderer from 'react-test-renderer/shallow';

import Settings from 'components/Settings';

import userProfile from './__mocks__/user-profile.json';
import profileState from './__mocks__/profile-state.json';
import propsMatch from './__mocks__/props-match.json';

const rnd = new Renderer();

it('renders profile setting page correctly', () => {
  rnd.render((<Settings
    handle=""
    tokenV3=""
    settingsTab="profile"
    history={{}}
    selectTab={() => {}}
    showXlBadge={() => {}}
    profile={userProfile}
    profileState={profileState}
    settingsPageState={{}}
    lookupData={{}}
    updateProfile={() => {}}
    uploadPhoto={() => {}}
    deletePhoto={() => {}}
    addSkill={() => {}}
    hideSkill={() => {}}
    match={propsMatch}
  />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});

it('renders account setting page correctly', () => {
  rnd.render((<Settings
    handle=""
    tokenV3=""
    settingsTab="account"
    history={{}}
    selectTab={() => {}}
    showXlBadge={() => {}}
    profile={userProfile}
    profileState={profileState}
    settingsPageState={{}}
    updatePassword={() => {}}
    clearIncorrectPassword={() => {}}
    updateProfile={() => {}}
    match={propsMatch}
  />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});

it('renders tools setting page correctly', () => {
  rnd.render((<Settings
    handle=""
    tokenV3=""
    settingsTab="tools"
    history={{}}
    selectTab={() => {}}
    showXlBadge={() => {}}
    profile={userProfile}
    profileState={profileState}
    settingsPageState={{}}
    match={propsMatch}
  />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});

it('renders preferences setting page correctly', () => {
  rnd.render((<Settings
    handle=""
    tokenV3=""
    settingsTab="preferences"
    history={{}}
    selectTab={() => {}}
    showXlBadge={() => {}}
    profile={userProfile}
    profileState={profileState}
    settingsPageState={{}}
    match={propsMatch}
  />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
