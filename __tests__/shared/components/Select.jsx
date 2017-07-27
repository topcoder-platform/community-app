import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import Select from 'components/Select';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();

  renderer.render((
    <Select id="id" />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
