/* eslint-env jest */
import { buildMmSubmissionData } from '../../../src/shared/utils/mm-review-summations';

describe('buildMmSubmissionData', () => {
  it('keeps newer raw submissions that do not have review summations yet', () => {
    const reviewSummations = [
      {
        aggregateScore: 100,
        id: 'summation-old',
        isProvisional: true,
        reviewedDate: '2026-03-30T11:06:00.000Z',
        submissionId: 'submission-old',
        submitterHandle: 'alpha',
        submitterId: '1001',
        submitterMaxRating: 1800,
      },
    ];

    const rawSubmissions = [
      {
        createdAt: '2026-03-30T11:06:00.000Z',
        id: 'submission-old',
        memberId: '1001',
        registrant: {
          memberHandle: 'alpha',
          memberId: '1001',
          rating: 1800,
        },
        status: 'completed',
      },
      {
        createdAt: '2026-03-30T11:21:00.000Z',
        id: 'submission-new',
        memberId: '1001',
        registrant: {
          memberHandle: 'alpha',
          memberId: '1001',
          rating: 1800,
        },
        status: 'queued',
      },
    ];

    const result = buildMmSubmissionData(reviewSummations, rawSubmissions);

    expect(result).toHaveLength(1);
    expect(result[0].member).toBe('alpha');
    expect(result[0].provisionalRank).toBeNull();
    expect(result[0].submissions).toHaveLength(2);
    expect(result[0].submissions[0]).toEqual(expect.objectContaining({
      provisionalScore: null,
      status: 'queued',
      submissionId: 'submission-new',
    }));
    expect(result[0].submissions[1]).toEqual(expect.objectContaining({
      provisionalScore: 100,
      status: 'completed',
      submissionId: 'submission-old',
    }));
  });

  it('builds submission rows from raw marathon match submissions when no summations exist', () => {
    const rawSubmissions = [
      {
        createdAt: '2026-03-30T11:13:00.000Z',
        id: 'submission-only',
        memberId: '1002',
        registrant: {
          memberHandle: 'beta',
          memberId: '1002',
          rating: 1500,
        },
        status: 'failed',
      },
    ];

    const result = buildMmSubmissionData([], rawSubmissions);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(expect.objectContaining({
      member: 'beta',
      memberId: '1002',
      provisionalRank: null,
      finalRank: null,
      registrant: expect.objectContaining({
        memberHandle: 'beta',
        userId: '1002',
      }),
    }));
    expect(result[0].submissions).toEqual([
      expect.objectContaining({
        status: 'failed',
        submissionId: 'submission-only',
      }),
    ]);
  });

  it('prefers initial scores over stale provisional scores from raw submissions', () => {
    const rawSubmissions = [
      {
        createdAt: '2026-04-01T00:01:03.000Z',
        finalScore: 100,
        id: 'submission-stale-provisional',
        initialScore: 100,
        memberId: '1003',
        provisionalScore: 0,
        registrant: {
          memberHandle: 'gamma',
          memberId: '1003',
          rating: 1700,
        },
        status: 'queued',
      },
    ];

    const result = buildMmSubmissionData([], rawSubmissions);

    expect(result).toHaveLength(1);
    expect(result[0].submissions).toEqual([
      expect.objectContaining({
        finalScore: 100,
        provisionalScore: 100,
        status: 'queued',
        submissionId: 'submission-stale-provisional',
      }),
    ]);
  });
});
