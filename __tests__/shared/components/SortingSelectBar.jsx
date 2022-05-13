import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import SortingSelectBar from 'components/SortingSelectBar';

const mockData = {
  title: 'title',
  options: [
    {
      label: 'label',
      value: 'value',
    },
  ],
};

const mockData2 = {
  title: 'title',
};

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();

  renderer.render((
    <SortingSelectBar {...mockData} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();

  renderer.render((
    <SortingSelectBar {...mockData2} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
