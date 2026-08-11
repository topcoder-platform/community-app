import { errors as mockedErrors } from 'topcoder-react-lib';
import { getChallengeSubmissions as mockedGetChallengeSubmissions } from 'services/submissions';

import { SubmissionsPageContainer } from 'containers/SubmissionPage';

jest.mock('topcoder-react-lib', () => ({
  actions: {
    challenge: {},
  },
  errors: {
    fireErrorMessage: jest.fn(),
  },
}));

jest.mock('services/submissions', () => ({
  getChallengeSubmissions: jest.fn(),
}));

jest.mock('actions/page/submission', () => ({
  page: {
    submission: {},
  },
}));
jest.mock('actions/page/challenge-details', () => ({
  page: {
    challengeDetails: {},
  },
}));
jest.mock('actions/tc-communities', () => ({
  tcCommunity: {},
}));
jest.mock('components/SubmissionPage', () => () => null);
jest.mock('components/tc-communities/AccessDenied', () => ({
  __esModule: true,
  CAUSE: {
    NOT_AUTHORIZED: 'NOT_AUTHORIZED',
  },
  default: () => null,
}));
jest.mock('components/LoadingIndicator', () => () => null);
jest.mock('topcoder-react-ui-kit', () => ({
  PrimaryButton: () => null,
}));

function createContainerProps(overrides = {}) {
  return {
    challenge: {},
    challengeId: 'challenge-id',
    metadata: [],
    submit: jest.fn(),
    tokenV2: 'token-v2',
    tokenV3: 'token-v3',
    track: 'Design',
    userId: 'member-id',
    ...overrides,
  };
}

describe('SubmissionsPageContainer submission limits', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('skips the limit lookup for unlimited challenges', async () => {
    const props = createContainerProps();
    const container = new SubmissionsPageContainer(props);
    const body = {};

    await container.handleSubmit(body);

    expect(mockedGetChallengeSubmissions).not.toHaveBeenCalled();
    expect(props.submit).toHaveBeenCalledWith(
      'token-v3',
      'token-v2',
      'challenge-id',
      body,
      'Design',
    );
  });

  test('submits while a limited challenge still has an available slot', async () => {
    mockedGetChallengeSubmissions.mockResolvedValue({
      data: [{ id: 'submission-1' }],
    });
    const props = createContainerProps({
      metadata: [{
        name: 'submissionLimit',
        value: JSON.stringify({
          count: '2',
          limit: 'true',
          unlimited: 'false',
        }),
      }],
    });
    const container = new SubmissionsPageContainer(props);
    const body = {};

    await container.handleSubmit(body);

    expect(mockedGetChallengeSubmissions).toHaveBeenCalledWith(
      'token-v3',
      'challenge-id',
      { memberId: 'member-id' },
    );
    expect(props.submit).toHaveBeenCalled();
    expect(mockedErrors.fireErrorMessage).not.toHaveBeenCalled();
  });

  test('shows the limit message and does not submit when the limit is reached', async () => {
    mockedGetChallengeSubmissions.mockResolvedValue({
      data: [{ id: 'submission-1' }],
    });
    const props = createContainerProps({
      metadata: [{
        name: 'submissionLimit',
        value: JSON.stringify({
          count: '1',
          limit: 'true',
          unlimited: 'false',
        }),
      }],
    });
    const container = new SubmissionsPageContainer(props);

    await container.handleSubmit({});

    expect(props.submit).not.toHaveBeenCalled();
    expect(mockedErrors.fireErrorMessage).toHaveBeenCalledWith(
      'Submission Limit Reached',
      'This challenge allows only one submission, and you\'ve already submitted.'
        + ' To replace it, delete your existing submission first.',
    );
  });

  test('does not submit when the existing-submission lookup fails', async () => {
    mockedGetChallengeSubmissions.mockRejectedValue(new Error('network error'));
    const props = createContainerProps({
      metadata: [{
        name: 'submissionLimit',
        value: JSON.stringify({
          count: '1',
          limit: 'true',
          unlimited: 'false',
        }),
      }],
    });
    const container = new SubmissionsPageContainer(props);

    await container.handleSubmit({});

    expect(props.submit).not.toHaveBeenCalled();
    expect(mockedErrors.fireErrorMessage).toHaveBeenCalledWith(
      'Unable to Verify Submission Limit',
      'We could not verify your existing submissions. Please try again.',
    );
  });
});
