import React from 'react';
import Renderer from 'react-test-renderer/shallow';

import ExternalLink from 'components/ProfilePage/ExternalLink';

const rnd = new Renderer();

it('renders an external link correctly', () => {
  rnd.render((<ExternalLink
    type="github"
    data={{
      handle: 'testHandle',
      followers: 20,
      publicRepos: 42,
    }}
  />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
