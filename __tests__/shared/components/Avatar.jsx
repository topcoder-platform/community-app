import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import Avatar from 'components/Avatar';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();

  renderer.render((
    <Avatar />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();

  renderer.render((
    <Avatar url={'some-fake-string'} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();

  renderer.render((
    <Avatar
      theme={{
        avatar: 'test-style',
      }}
    />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();

  renderer.render((
    <Avatar
      theme={{
        avatar: 'test-style',
      }}
      url={'some-fake-string'}
    />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
