import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import Program from 'components/Dashboard/Program';

const mockData1 = {
  challenges: [{
    id: '1',
  }],
  iosRegistered: true,
  registerIos: () => {},
};

const mockData2 = {
  challenges: [],
  iosRegistered: false,
  registerIos: () => {},
};

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();

  renderer.render((
    <Program {...mockData1} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();

  renderer.render((
    <Program {...mockData2} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
