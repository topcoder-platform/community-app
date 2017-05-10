import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import Avatar from 'components/Avatar';

test('Matches shallow shapshot', () => {
  const baseStyles = {
    height: '100%',
    width: '100%',
  };

  const defaultModifier = {
    borderColor: 'rgba(0, 0, 0, 0.05)',
  };

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
    <Avatar customStyles={baseStyles} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();

  renderer.render((
    <Avatar url={'some-fake-string'} customStyles={[baseStyles, defaultModifier]} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
