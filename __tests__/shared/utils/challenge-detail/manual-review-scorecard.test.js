/* eslint-env jest */
import {
  getManualReviewScorecardId,
  getManualReviewScorecardUrl,
} from '../../../../src/shared/utils/challenge-detail/manual-review-scorecard';

const REVIEW_PHASE_ID = 'aa5a3f78-79e0-4bf7-93ff-b11e8f5b398b';
const SCREENING_PHASE_ID = '2d7d3d85-0b29-4989-b3b4-be7f2b1d0aa6';
const ITERATIVE_REVIEW_PHASE_ID = '003a4b14-de5d-43fc-9e35-835dbeb6af1f';

const PHASES = [
  { id: 'screening-instance', name: 'Screening', phaseId: SCREENING_PHASE_ID },
  { id: 'review-instance', name: 'Review', phaseId: REVIEW_PHASE_ID },
];

describe('getManualReviewScorecardId', () => {
  test('returns the member reviewer scorecard for the Review phase', () => {
    expect(getManualReviewScorecardId({
      phases: PHASES,
      reviewers: [
        { isMemberReview: true, phaseId: SCREENING_PHASE_ID, scorecardId: 'screening-scorecard' },
        {
          aiWorkflowId: 'ai-workflow',
          isMemberReview: false,
          phaseId: REVIEW_PHASE_ID,
          scorecardId: 'ai-scorecard',
        },
        { isMemberReview: true, phaseId: REVIEW_PHASE_ID, scorecardId: 'hFU73Ve2XlYCK-' },
      ],
    })).toBe('hFU73Ve2XlYCK-');
  });

  test('falls back to the Iterative Review member reviewer', () => {
    expect(getManualReviewScorecardId({
      phases: [{ id: 'ir-instance', name: 'Iterative Review', phaseId: ITERATIVE_REVIEW_PHASE_ID }],
      reviewers: [
        { isMemberReview: true, phaseId: ITERATIVE_REVIEW_PHASE_ID, scorecardId: 'f2f-scorecard' },
      ],
    })).toBe('f2f-scorecard');
  });

  test('ignores AI-only, screening-only, and missing review definitions', () => {
    expect(getManualReviewScorecardId({
      phases: PHASES,
      reviewers: [{
        aiWorkflowId: 'ai-workflow',
        isMemberReview: false,
        phaseId: REVIEW_PHASE_ID,
        scorecardId: 'ai-scorecard',
      }],
    })).toBe('');
    expect(getManualReviewScorecardId({
      phases: PHASES,
      reviewers: [
        { isMemberReview: true, phaseId: SCREENING_PHASE_ID, scorecardId: 'screening-scorecard' },
      ],
    })).toBe('');
    expect(getManualReviewScorecardId({ phases: PHASES })).toBe('');
    expect(getManualReviewScorecardId(undefined)).toBe('');
  });
});

describe('getManualReviewScorecardUrl', () => {
  const challenge = {
    phases: PHASES,
    reviewers: [{ isMemberReview: true, phaseId: REVIEW_PHASE_ID, scorecardId: 'score card' }],
  };

  test('builds an encoded Review App scorecard URL', () => {
    expect(getManualReviewScorecardUrl(challenge, 'https://review.topcoder.com/'))
      .toBe('https://review.topcoder.com/scorecard/score%20card');
  });

  test('uses the configured Review App origin by default', () => {
    expect(getManualReviewScorecardUrl(challenge))
      .toBe('https://review.topcoder-dev.com/scorecard/score%20card');
  });

  test('returns an empty string without a manual review scorecard', () => {
    expect(getManualReviewScorecardUrl({ phases: PHASES, reviewers: [] })).toBe('');
  });
});
