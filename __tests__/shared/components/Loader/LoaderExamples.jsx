import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import LoaderExamples from 'components/Loader/LoaderExamples';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  renderer.render((
    <LoaderExamples />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
