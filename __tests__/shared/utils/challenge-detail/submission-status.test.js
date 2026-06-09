/* eslint-env jest */
import { getSubmissionStatus } from '../../../../src/shared/utils/challenge-detail/submission-status';

describe('getSubmissionStatus', () => {
  it('marks submissions with failed virus scans as failed', () => {
    expect(getSubmissionStatus({
      status: 'ACTIVE',
      url: 'https://s3.amazonaws.com/topcoder-dev-submissions-dmz/submission.zip',
      virusScan: false,
    })).toEqual({
      hasReviewSummation: false,
      isAccepted: false,
      isFailed: true,
    });
  });

  it('marks quarantined submissions as failed', () => {
    expect(getSubmissionStatus({
      status: 'ACTIVE',
      url: 'https://s3.amazonaws.com/topcoder-dev-submissions-quarantine/submission.zip',
    }).isFailed).toBe(true);
  });

  it('keeps pending virus scans in preparing state', () => {
    expect(getSubmissionStatus({
      status: 'ACTIVE',
      url: 'https://s3.amazonaws.com/topcoder-dev-submissions-dmz/submission.zip',
    })).toEqual({
      hasReviewSummation: false,
      isAccepted: false,
      isFailed: false,
    });
  });
});
