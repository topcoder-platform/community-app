import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import SRMTile from 'components/Dashboard/SRM/SRMTile';
import MockDate from 'mockdate';

jest.mock('utils/tc', () => ({
  timeDiff: () => '1d',
  localTime: (date, format) => {
    switch (format) {
      case 'DD':
        return '31';
      case 'MMM':
        return 'Dec';
      case 'hh:mm a':
        return '08:00 am';
      case 'z':
        return 'EET';
      default:
        return '2019-12-31T08:00:00.000Z';
    }
  },
}));

beforeAll(() => {
  MockDate.set(1500262917951, 160);
});

afterAll(() => {
  MockDate.reset();
});

const mockData1 = {
  srm: {
    id: '1',
    status: 'FUTURE',
    rounds: [{
      id: '1',
    }],
    userStatus: 'registered',
    codingStartAt: '2019-12-31T08:00:00.000Z',
  },
};

const mockData2 = {
  srm: {
    id: '1',
    status: 'FUTURE',
    rounds: [{
      id: '1',
    }],
    codingStartAt: '2019-12-31T08:00:00.000Z',
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
