import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import ChallengeLinks from 'components/Dashboard/MyChallenges/ChallengeLinks';

const mockData1 = {
  viewMode: 'list',
  challenge: {
    track: 'DEVELOP',
    subTrack: 'CODE',
  },
};

const mockData2 = {
  viewMode: 'list',
  challenge: {
    track: 'DEVELOP',
    subTrack: 'MARATHON_MATCH',
    rounds: [{}],
    numRegistrants: [0],
  },
};

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  renderer.render((
    <ChallengeLinks {...mockData1} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();

  renderer.render((
    <ChallengeLinks {...mockData2} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
