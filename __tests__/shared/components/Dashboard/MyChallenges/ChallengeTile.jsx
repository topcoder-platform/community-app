import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import ChallengeTile from 'components/Dashboard/MyChallenges/ChallengeTile';

const mockData2 = {
  viewMode: 'tile',
  challenge: {
    track: 'DEVELOP',
    subTrack: 'CODE',
    status: 'ACTIVE',
    userDetails: {
      roles: ['abcdefg', 'hijklmn', 'opqrst', 'uvwxyz', '1234567890', '0987654321', 'abcdefghijklmnopqrstuvwxyz'],
    },
    userAction: 'Appeal',
  },
};

const mockData3 = {
  viewMode: 'tile',
  challenge: {
    track: 'DEVELOP',
    subTrack: 'CODE',
    status: 'ACTIVE',
    isPrivate: true,
    groupLabel: 'do',
    userDetails: {
      roles: ['abcdefg'],
    },
    userCurrentPhaseEndTime: true,
    userAction: 'Submit',
  },
};

const mockData4 = {
  viewMode: 'tile',
  challenge: {
    track: 'DEVELOP',
    subTrack: 'CODE',
    status: 'ACTIVE',
    isPrivate: true,
    groupLabel: 'do',
    userDetails: {
      roles: ['abcdefg'],
    },
    userCurrentPhaseEndTime: true,
    userAction: 'Submit',
    isLate: true,
  },
};

const mockData5 = {
  viewMode: 'tile',
  challenge: {
    track: 'DEVELOP',
    subTrack: 'CODE',
    status: 'ACTIVE',
    userDetails: {
      roles: [],
    },
    userAction: 'Appeal',
    isSubmitter: true,
  },
};

const mockData6 = {
  viewMode: 'tile',
  challenge: {
    track: 'DEVELOP',
    subTrack: 'CODE',
    status: 'ACTIVE',
    userDetails: {
    },
    userAction: 'Submitted',
  },
};

const mockData7 = {
  viewMode: 'tile',
  challenge: {
    track: 'DEVELOP',
    subTrack: 'CODE',
    status: 'ACTIVE',
    userDetails: {
    },
    userAction: 'Registered',
  },
};

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();

  renderer.render((
    <ChallengeTile {...mockData2} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();

  renderer.render((
    <ChallengeTile {...mockData2} viewMode="list" />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();

  renderer.render((
    <ChallengeTile {...mockData3} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();

  renderer.render((
    <ChallengeTile {...mockData3} viewMode="list" />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();

  renderer.render((
    <ChallengeTile {...mockData4} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();

  renderer.render((
    <ChallengeTile {...mockData4} viewMode="list" />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();

  renderer.render((
    <ChallengeTile {...mockData5} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();

  renderer.render((
    <ChallengeTile {...mockData5} viewMode="list" />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();

  renderer.render((
    <ChallengeTile {...mockData6} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();

  renderer.render((
    <ChallengeTile {...mockData6} viewMode="list" />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();

  renderer.render((
    <ChallengeTile {...mockData7} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();

  renderer.render((
    <ChallengeTile {...mockData7} viewMode="list" />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
