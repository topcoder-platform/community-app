import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import Footer from 'components/challenge-listing/Sidebar/Footer';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  renderer.render((
    <Footer />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
