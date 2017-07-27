import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import Header from 'components/Dashboard/Header';

const mockData = {
  title: 'title',
  profile: {
    maxRating: {},
  },
  financials: 0,
};

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  renderer.render((
    <Header {...mockData} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
