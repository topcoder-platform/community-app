import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import CommunityUpdates from 'components/Dashboard/CommunityUpdates';

const blogsData = [{ link: 'http', title: 'title', description: 'description' }];

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  renderer.render((
    <CommunityUpdates blogs={blogsData} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
