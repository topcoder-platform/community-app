import React from 'react';
import Renderer from 'react-test-renderer/shallow';

import Popup from 'components/ProfilePage/BadgesModal/Popup';

import fullProfile from '../../__mocks__/full-profile.json';

const rnd = new Renderer();

it('renders badge modal popup correctly', () => {
  rnd.render((<Popup
    date={fullProfile.achievements[0].date}
    name={fullProfile.achievements[0].description}
  />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
