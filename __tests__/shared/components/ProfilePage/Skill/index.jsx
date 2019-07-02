import React from 'react';
import Renderer from 'react-test-renderer/shallow';

import Skill from 'components/ProfilePage/Skill';

const rnd = new Renderer();

it('renders a skill correctly', () => {
  rnd.render((<Skill
    tagId="1"
    tagName="Test Skill"
    isVerified
  />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
