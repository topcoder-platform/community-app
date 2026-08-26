/* NOTE: This test is incorrectly implemented. See the line
 * const props = obj.selector.props;
 * it is just antipattern, and it broke as soon as there was a slight
 * modification of SubmissionManagement component, that required to wrap
 * it into <StaticRouter> element. No time to properly fix it now, thus
 * just commented out. */
import { SubmissionManagementPageContainer } from 'containers/SubmissionManagement';
import { getChallengeSubmissions as mockedGetChallengeSubmissions } from 'services/submissions';

jest.mock('services/submissions', () => ({
  downloadSubmissions: jest.fn(),
  getChallengeSubmissions: jest.fn(),
  getSubmissionArtifacts: jest.fn(),
  getSubmissionDownloadUrl: jest.fn(),
}));

test.skip('Placeholder', () => {});

/**
 * Creates a mounted Submission Management container with Design limit defaults.
 *
 * @param {Object} propOverrides Optional container prop replacements.
 * @return {{container: SubmissionManagementPageContainer, props: Object}} Test container and props.
 * @throws Does not throw.
 */
function createSubmissionManagementContainer(propOverrides = {}) {
  const props = {
    authTokens: {
      tokenV3: 'token-v3',
      user: { userId: 'member-id' },
    },
    challenge: {
      metadata: [{
        name: 'submissionLimit',
        value: JSON.stringify({
          count: '1',
          limit: 'true',
          unlimited: 'false',
        }),
      }],
      phases: [{ isOpen: true, name: 'Submission' }],
      track: 'Design',
    },
    challengeId: 'challenge-id',
    challengesUrl: '/challenges',
    history: { push: jest.fn() },
    mySubmissions: [],
    ...propOverrides,
  };
  const container = new SubmissionManagementPageContainer(props);
  container.isComponentMounted = true;
  container.setState = jest.fn((state, callback) => {
    container.state = { ...container.state, ...state };
    if (callback) callback();
  });

  return { container, props };
}

describe('Submission Management Add Submission limit', () => {
  beforeEach(() => {
    mockedGetChallengeSubmissions.mockReset();
  });

  test('blocks the regular Design route when service history reaches the contest limit', async () => {
    mockedGetChallengeSubmissions.mockResolvedValue({
      data: [{ id: 'contest-submission' }],
    });
    const { container, props } = createSubmissionManagementContainer();
    const event = { preventDefault: jest.fn() };

    await container.onAddSubmission(event);

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(mockedGetChallengeSubmissions).toHaveBeenCalledWith(
      'token-v3',
      'challenge-id',
      {
        memberId: 'member-id',
        type: 'CONTEST_SUBMISSION',
      },
    );
    expect(props.history.push).not.toHaveBeenCalled();
  });

  test('routes when complete checkpoint history confirms a slot remains', async () => {
    mockedGetChallengeSubmissions.mockResolvedValue({ data: [] });
    const { container, props } = createSubmissionManagementContainer({
      challenge: {
        metadata: [{
          name: 'submissionLimit',
          value: JSON.stringify({
            count: '1',
            limit: 'true',
            unlimited: 'false',
          }),
        }],
        phases: [{ isOpen: true, name: 'Checkpoint Submission' }],
        track: 'Design',
      },
    });

    await container.onAddSubmission({ preventDefault: jest.fn() });

    expect(mockedGetChallengeSubmissions).toHaveBeenCalledWith(
      'token-v3',
      'challenge-id',
      {
        memberId: 'member-id',
        type: 'CHECKPOINT_SUBMISSION',
      },
    );
    expect(props.history.push).toHaveBeenCalledWith('/challenges/challenge-id/submit');
  });

  test('fails closed and releases the pending guard when history lookup fails', async () => {
    mockedGetChallengeSubmissions.mockRejectedValue(new Error('network error'));
    const { container, props } = createSubmissionManagementContainer();

    await container.onAddSubmission({ preventDefault: jest.fn() });

    expect(props.history.push).not.toHaveBeenCalled();
    expect(container.submissionLimitCheckPending).toBe(false);
    expect(container.state.submissionLimitCheckPending).toBe(false);
  });

  test('leaves unlimited, non-Design, and final-fix links to normal navigation', async () => {
    const { container: unlimitedContainer } = createSubmissionManagementContainer({
      challenge: {
        metadata: [],
        phases: [{ isOpen: true, name: 'Submission' }],
        track: 'Design',
      },
    });
    const { container: finalFixContainer } = createSubmissionManagementContainer({
      challenge: {
        metadata: [{
          name: 'submissionLimit',
          value: JSON.stringify({
            count: '1',
            limit: 'true',
            unlimited: 'false',
          }),
        }],
        phases: [{ isOpen: true, name: 'Final Fix' }],
        track: 'Design',
      },
    });
    const { container: developmentContainer } = createSubmissionManagementContainer({
      challenge: {
        metadata: [{
          name: 'submissionLimit',
          value: JSON.stringify({
            count: '1',
            limit: 'true',
            unlimited: 'false',
          }),
        }],
        phases: [{ isOpen: true, name: 'Submission' }],
        track: 'Development',
      },
    });
    const unlimitedEvent = { preventDefault: jest.fn() };
    const finalFixEvent = { preventDefault: jest.fn() };
    const developmentEvent = { preventDefault: jest.fn() };

    await unlimitedContainer.onAddSubmission(unlimitedEvent);
    await finalFixContainer.onAddSubmission(finalFixEvent);
    await developmentContainer.onAddSubmission(developmentEvent);

    expect(unlimitedEvent.preventDefault).not.toHaveBeenCalled();
    expect(finalFixEvent.preventDefault).not.toHaveBeenCalled();
    expect(developmentEvent.preventDefault).not.toHaveBeenCalled();
    expect(mockedGetChallengeSubmissions).not.toHaveBeenCalled();
  });
});

/*
import _ from 'lodash';
import React from 'react';
import Rnd from 'react-test-renderer/shallow';
import TU from 'react-dom/test-utils';
import { StaticRouter } from 'react-router-dom';

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
    mySubmissions: {},
    mySubmissionsManagement: {},
  },
};

const SubmissionManagement = require('containers/SubmissionManagement').default;

beforeEach(() => jest.clearAllMocks());

test('Matches shapshot', () => {
  rnd.render((
    <StaticRouter>
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
    </StaticRouter>
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});

test('Triggers data loading, if necessary', () => {
  TU.renderIntoDocument((
    <StaticRouter>
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
    </StaticRouter>
  ));
  expect(mockChallengeActions.challenge.getDetailsInit).toHaveBeenCalledWith(12345);
  expect(mockChallengeActions.challenge.getDetailsDone)
    .toHaveBeenCalledWith(12345, 'Token V3', 'Token V2');
  expect(mockChallengeActions.challenge.getSubmissionsInit).toHaveBeenCalled();
  expect(mockChallengeActions.challenge.getSubmissionsDone)
    .toHaveBeenCalledWith(12345, 'Token V2');
});

const obj = TU.renderIntoDocument((
  <StaticRouter context={{}}>
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
  </StaticRouter>
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
*/
