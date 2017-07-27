/* global window */

import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import IosCard from 'components/Dashboard/Program/IosCard';

const mockData1 = {
  challenge: {
    id: '1',
    name: 'name',
  },
};

const mockData2 = {
  challenge: {
    id: '1',
    name: 'name',
    userCurrentPhaseEndTime: [1, 2],
  },
};

const mockData3 = {
  challenge: {
    id: '1',
    name: 'name',
    reviewType: 'PEER',
  },
};

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();

  renderer.render((
    <IosCard {...mockData1} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();

  renderer.render((
    <IosCard {...mockData2} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();

  Object.defineProperty(window.location, 'href', {
    writable: true,
    value: 'http://members.topcoder.com',
  });
  renderer.render((
    <IosCard {...mockData3} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
