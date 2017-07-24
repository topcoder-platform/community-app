import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import SRM from 'components/Dashboard/SRM';

const mockData1 = {
  srms: [{
    id: '1',
  }],
};

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();

  renderer.render((
    <SRM {...mockData1} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
