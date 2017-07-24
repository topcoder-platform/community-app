import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import Loader from 'components/Loader/Loader';

const mockData = {
  type: 'small',
};

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();

  renderer.render((
    <Loader {...mockData} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();

  renderer.render((
    <Loader />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
