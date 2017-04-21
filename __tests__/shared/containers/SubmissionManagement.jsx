import _ from 'lodash';
import React from 'react';
import renderer from 'react-test-renderer';
import TU from 'react-dom/test-utils';

const mockChallengeActions = {
  fetchChallengeInit: jest.fn(),
  fetchChallengeDone: jest.fn(),
  fetchSubmissionsInit: jest.fn(),
  fetchSubmissionsDone: jest.fn(),
};
jest.setMock(require.resolve('actions/challenge'), mockChallengeActions);

const mockSmpActions = {
  smp: {
    cancelDelete: jest.fn(),
    confirmDelete: jest.fn(),
    deleteSubmissionDone: jest.fn(),
    downloadSubmission: jest.fn(),
    showDetails: jest.fn(),
  },
};
jest.setMock(require.resolve('actions/smp'), mockSmpActions);

const mockState = {
  auth: {},
  challenge: {
    details: {
      track: 'Track',
    },
    loadingDetails: true,
    mySubmissionsManagement: {
      showDetails: new Set(),
      showModal: true,
    },
  },
};

const SubmissionManagement = require('containers/SubmissionManagement').default;

beforeEach(() => jest.clearAllMocks());

test('Matches shapshot', () => {
  const render = renderer.create((
    <SubmissionManagement
      match={{
        params: {
          challengeId: '12345',
        },
      }}
      store={{
        dispatch: () => _.noop,
        getState: () => mockState,
        subscribe: _.noop,
      }}
    />
  ));
  expect(render.toJSON()).toMatchSnapshot();
});

const obj = TU.renderIntoDocument((
  <SubmissionManagement
    match={{
      params: {
        challengeId: '12345',
      },
    }}
    store={{
      dispatch: () => _.noop,
      getState: () => mockState,
      subscribe: _.noop,
    }}
  />
));
const props = obj.selector.props;

test('onShowDetails dispatches', () => {
  props.onShowDetails('12345');
  expect(mockSmpActions.smp.showDetails).toHaveBeenCalledWith('12345');
});

test('onSubmissionDelete dispatches', () => {
  props.onSubmissionDelete('12345');
  expect(mockSmpActions.smp.confirmDelete).toHaveBeenCalledWith('12345');
});

test('onCancelSubmissionDelete dispatches', () => {
  props.onCancelSubmissionDelete();
  expect(mockSmpActions.smp.cancelDelete).toHaveBeenCalledWith();
});

test('onSubmissionDeleteConfirmed dispatches', () => {
  props.onSubmissionDeleteConfirmed('12345', '54321');
  expect(mockSmpActions.smp.deleteSubmissionDone)
    .toHaveBeenCalledWith('12345', '54321');
});

test('onDownloadSubmission dispatches', () => {
  props.onDownloadSubmission('12345', '54321');
  expect(mockSmpActions.smp.downloadSubmission)
    .toHaveBeenCalledWith('12345', '54321');
});

test('loadChallengeDetails dispatches', () => {
  props.loadChallengeDetails('12345', '54321');
  expect(mockChallengeActions.fetchChallengeInit).toHaveBeenCalled();
  expect(mockChallengeActions.fetchChallengeDone)
    .toHaveBeenCalledWith('12345', '54321');
});

test('loadMySubmissions dispatches', () => {
  props.loadMySubmissions('12345', '54321');
  expect(mockChallengeActions.fetchSubmissionsInit).toHaveBeenCalled();
  expect(mockChallengeActions.fetchSubmissionsDone)
    .toHaveBeenCalledWith('12345', '54321');
});
