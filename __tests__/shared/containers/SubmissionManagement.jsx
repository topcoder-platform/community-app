import _ from 'lodash';
import React from 'react';
import Rnd from 'react-test-renderer/shallow';
import TU from 'react-dom/test-utils';

const rnd = new Rnd();

const mockChallengeActions = {
  challenge: {
    getDetailsInit: jest.fn(),
    getDetailsDone: jest.fn(),
    getSubmissionsInit: jest.fn(),
    getSubmissionsDone: jest.fn(),
  },
};
jest.setMock(require.resolve('actions/challenge'), mockChallengeActions);

const mockSmpActions = {
  smp: {
    cancelDelete: jest.fn(),
    confirmDelete: jest.fn(),
    deleteSubmissionDone: jest.fn(),
    deleteSubmissionInit: jest.fn(),
    downloadSubmission: jest.fn(),
    showDetails: jest.fn(),
  },
};
jest.setMock(require.resolve('actions/smp'), mockSmpActions);

const mockState = {
  auth: {
    tokenV3: 'Token V3',
  },
  challenge: {
    details: {
      track: 'Track',
    },
    loadingDetails: true,
    mySubmissions: {
      v2: [{
        submissionId: 12345,
      }],
    },
    mySubmissionsManagement: {
      deletingSubmission: true,
      showDetails: new Set(),
      showModal: true,
      toBeDeletedId: 12345,
    },
  },
};

const mockState2 = {
  auth: {
    tokenV2: 'Token V2',
    tokenV3: 'Token V3',
  },
  challenge: {
    mySubmissionsManagement: {},
  },
};

const SubmissionManagement = require('containers/SubmissionManagement').default;

beforeEach(() => jest.clearAllMocks());

test('Matches shapshot', () => {
  rnd.render((
    <SubmissionManagement
      match={{
        params: {
          challengeId: 12345,
        },
      }}
      store={{
        dispatch: () => _.noop,
        getState: () => mockState,
        subscribe: _.noop,
      }}
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});

test('Triggers data loading, if necessary', () => {
  TU.renderIntoDocument((
    <SubmissionManagement
      match={{
        params: {
          challengeId: 12345,
        },
      }}
      store={{
        dispatch: () => _.noop,
        getState: () => mockState2,
        subscribe: _.noop,
      }}
    />
  ));
  expect(mockChallengeActions.challenge.getDetailsInit).toHaveBeenCalledWith(12345);
  expect(mockChallengeActions.challenge.getDetailsDone)
    .toHaveBeenCalledWith(12345, 'Token V3', 'Token V2');
  expect(mockChallengeActions.challenge.getSubmissionsInit).toHaveBeenCalled();
  expect(mockChallengeActions.challenge.getSubmissionsDone)
    .toHaveBeenCalledWith(12345, 'Token V2');
});

const obj = TU.renderIntoDocument((
  <SubmissionManagement
    match={{
      params: {
        challengeId: 12345,
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
  props.onShowDetails(12345);
  expect(mockSmpActions.smp.showDetails).toHaveBeenCalledWith(12345);
});

test('onSubmissionDelete dispatches', () => {
  props.onSubmissionDelete(12345);
  expect(mockSmpActions.smp.confirmDelete).toHaveBeenCalledWith(12345);
});

test('onCancelSubmissionDelete dispatches', () => {
  props.onCancelSubmissionDelete();
  expect(mockSmpActions.smp.cancelDelete).toHaveBeenCalledWith();
});

test('onSubmissionDeleteConfirmed dispatches', () => {
  props.onSubmissionDeleteConfirmed(12345, 54321);
  expect(mockSmpActions.smp.deleteSubmissionInit)
    .toHaveBeenCalled();
  expect(mockSmpActions.smp.deleteSubmissionDone)
    .toHaveBeenCalledWith(12345, 54321);
});

test('onDownloadSubmission dispatches', () => {
  props.onDownloadSubmission('12345', '54321');
  expect(mockSmpActions.smp.downloadSubmission)
    .toHaveBeenCalledWith('12345', '54321');
});

test('loadChallengeDetails dispatches', () => {
  props.loadChallengeDetails({
    tokenV2: 'Token V2',
    tokenV3: 'Token V3',
  }, 54321);
  expect(mockChallengeActions.challenge.getDetailsInit).toHaveBeenCalledWith(54321);
  expect(mockChallengeActions.challenge.getDetailsDone)
    .toHaveBeenCalledWith(54321, 'Token V3', 'Token V2');
});

test('loadMySubmissions dispatches', () => {
  props.loadMySubmissions({
    tokenV2: 'Token V2',
    tokenV3: 'Token V3',
  }, 54321);
  expect(mockChallengeActions.challenge.getSubmissionsInit).toHaveBeenCalled();
  expect(mockChallengeActions.challenge.getSubmissionsDone)
    .toHaveBeenCalledWith(54321, 'Token V2');
});

test('onBtnDefault', () => {
  const button = TU.findAllInRenderedTree(obj, item =>
    item && item.className && item.className.match(/tc-btn-default/));
  expect(button.length).toBe(1);
  TU.Simulate.click(button[0]);
  expect(mockSmpActions.smp.cancelDelete).toHaveBeenCalled();
});

test('onBtnWarning', () => {
  const button = TU.findAllInRenderedTree(obj, item =>
    item && item.className && item.className.match(/tc-btn-warning/));
  expect(button.length).toBe(1);
  TU.Simulate.click(button[0]);
  expect(mockSmpActions.smp.deleteSubmissionDone)
    .toHaveBeenCalledWith('Token V3', 12345);
});
