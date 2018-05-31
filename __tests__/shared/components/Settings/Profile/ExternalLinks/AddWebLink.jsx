import React from 'react';
import Renderer from 'react-test-renderer/shallow';

import AddWebLink from 'components/Settings/Profile/ExternalLinks/AddWebLink';

import profileState from '../../__mocks__/profile-state.json';

const rnd = new Renderer();

it('renders add web link section of profile setting page correctly', () => {
  rnd.render((<AddWebLink
    handle=""
    tokenV3=""
    profileState={profileState}
    addWebLink={() => {}}
  />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
