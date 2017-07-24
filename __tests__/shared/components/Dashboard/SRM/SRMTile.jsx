import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import SRMTile from 'components/Dashboard/SRM/SRMTile';

const mockData1 = {
  srm: {
    id: '1',
    status: 'FUTURE',
    rounds: [{
      id: '1',
    }],
    userStatus: 'registered',
    codingStartAt: '2017-01-01',
  },
};

const mockData2 = {
  srm: {
    id: '1',
    status: 'FUTURE',
    rounds: [{
      id: '1',
    }],
    codingStartAt: '2017-01-01',
  },
};

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();

  renderer.render((
    <SRMTile {...mockData1} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();

  renderer.render((
    <SRMTile {...mockData2} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
