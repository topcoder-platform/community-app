import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import _ from 'lodash';
import GalleryModal from 'components/ProfilePage/Stats/SubTrackChallengeView/GalleryModal';

import challenge from './__mocks__/challenge.json';

const rnd = new Renderer();

it('renders gallery modal', () => {
  rnd.render((<GalleryModal
    onCancel={_.noop}
    challenge={challenge}
  />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
