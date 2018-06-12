import React from 'react';
import Renderer from 'react-test-renderer/shallow';

import Skills from 'components/Settings/Profile/Skills';

import profileState from '../../__mocks__/profile-state.json';

const rnd = new Renderer();

it('renders skills section of profile setting page correctly', () => {
  rnd.render((<Skills
    handle=""
    tokenV3=""
    profileState={profileState}
    settingsPageState={{ skills: profileState.skills }}
    lookupData={{}}
    addSkill={() => {}}
    hideSkill={() => {}}
  />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
