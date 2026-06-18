/* eslint-env jest */
import {
  buildMmSubmissionData,
  buildStatisticsData,
} from '../../../src/shared/utils/mm-review-summations';

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

  it('uses v6 submitter fields and submittedDate for imported raw submissions', () => {
    const rawSubmissions = [
      {
        createdAt: '2026-04-09T05:00:55.279Z',
        createdBy: 'historical-mm-importer',
        finalScore: '7186.79',
        id: 'submission-imported',
        isLatest: true,
        memberId: '16064986',
        submittedDate: '2006-05-16T10:31:42.790Z',
        submitterHandle: 'ctrucza',
        submitterMaxRating: 1228,
      },
    ];

    const result = buildMmSubmissionData([], rawSubmissions);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(expect.objectContaining({
      member: 'ctrucza',
      memberId: '16064986',
      rating: 1228,
    }));
    expect(result[0].submissions).toEqual([
      expect.objectContaining({
        finalScore: 7186.79,
        submissionId: 'submission-imported',
        submissionTime: '2006-05-16T10:31:42.790Z',
      }),
    ]);
  });

  it('uses reviewedDate before import createdAt for review summation times', () => {
    const reviewSummations = [
      {
        aggregateScore: 7186.79,
        createdAt: '2026-04-21T02:55:21.255Z',
        id: 'summation-imported',
        isFinal: true,
        reviewedDate: '2006-05-16T10:31:42.790Z',
        submissionId: 'submission-reviewed',
        submitterHandle: 'ctrucza',
        submitterId: '16064986',
      },
    ];

    const result = buildMmSubmissionData(reviewSummations);

    expect(result[0].submissions).toEqual([
      expect.objectContaining({
        finalScore: 7186.79,
        submissionId: 'submission-reviewed',
        submissionTime: '2006-05-16T10:31:42.790Z',
      }),
    ]);
  });

  it('does not treat example summations as provisional or final scores', () => {
    const reviewSummations = [
      {
        aggregateScore: 73.14798973137148,
        id: 'summation-system',
        isFinal: true,
        metadata: {
          testType: 'system',
        },
        reviewedDate: '2026-05-26T06:52:08.038Z',
        updatedAt: '2026-05-26T07:00:00.000Z',
        submissionId: 'submission-latest',
        submitterHandle: 'topacc_four',
        submitterId: '1004',
      },
      {
        aggregateScore: 76.16139684222824,
        id: 'summation-example',
        isExample: true,
        metadata: {
          testType: 'example',
        },
        reviewedDate: '2026-05-26T06:04:39.123Z',
        submissionId: 'submission-latest',
        submitterHandle: 'topacc_four',
        submitterId: '1004',
      },
      {
        aggregateScore: 69.13482014723114,
        id: 'summation-provisional',
        isProvisional: true,
        metadata: {
          testType: 'provisional',
        },
        reviewedDate: '2026-05-26T06:03:55.171Z',
        submissionId: 'submission-latest',
        submitterHandle: 'topacc_four',
        submitterId: '1004',
      },
    ];

    const rawSubmissions = [
      {
        createdAt: '2026-05-26T06:02:59.385Z',
        id: 'submission-latest',
        isLatest: true,
        memberId: '1004',
        registrant: {
          memberHandle: 'topacc_four',
          memberId: '1004',
        },
      },
    ];

    const result = buildMmSubmissionData(reviewSummations, rawSubmissions);

    expect(result).toHaveLength(1);
    expect(result[0].submissions).toEqual([
      expect.objectContaining({
        finalScore: 73.14798973137148,
        provisionalScore: 69.13482014723114,
        reviewSummations: expect.arrayContaining([
          expect.objectContaining({ id: 'summation-example' }),
        ]),
        submissionId: 'submission-latest',
        submissionTime: '2026-05-26T06:02:59.385Z',
      }),
    ]);
  });
});

describe('buildStatisticsData', () => {
  it('omits processing and failed scorer updates from dashboard graph data', () => {
    const reviewSummations = [
      {
        aggregateScore: 0,
        id: 'summation-processing-zero',
        isProvisional: true,
        metadata: {
          testStatus: 'IN PROGRESS',
          testType: 'provisional',
        },
        reviewedDate: '2026-05-29T01:00:00.000Z',
        submissionId: 'submission-processing',
        submitterHandle: 'alpha',
        submitterId: '1001',
      },
      {
        aggregateScore: -1,
        id: 'summation-failed',
        isProvisional: true,
        metadata: {
          testStatus: 'FAILED',
          testType: 'provisional',
        },
        reviewedDate: '2026-05-29T01:05:00.000Z',
        submissionId: 'submission-failed',
        submitterHandle: 'alpha',
        submitterId: '1001',
      },
      {
        aggregateScore: 0,
        id: 'summation-success-zero',
        isProvisional: true,
        metadata: {
          testStatus: 'SUCCESS',
          testType: 'provisional',
        },
        reviewedDate: '2026-05-29T01:10:00.000Z',
        submissionId: 'submission-success-zero',
        submitterHandle: 'beta',
        submitterId: '1002',
      },
      {
        aggregateScore: 84.25,
        id: 'summation-success',
        isProvisional: true,
        metadata: {
          testStatus: 'SUCCESS',
          testType: 'provisional',
        },
        reviewedDate: '2026-05-29T01:15:00.000Z',
        submissionId: 'submission-success',
        submitterHandle: 'alpha',
        submitterId: '1001',
      },
    ];

    const result = buildStatisticsData(reviewSummations);

    expect(result).toHaveLength(2);
    expect(result).toEqual(expect.arrayContaining([
      expect.objectContaining({
        handle: 'alpha',
        submissions: [
          expect.objectContaining({
            score: 84.25,
            submissionId: 'submission-success',
          }),
        ],
      }),
      expect.objectContaining({
        handle: 'beta',
        submissions: [
          expect.objectContaining({
            score: 0,
            submissionId: 'submission-success-zero',
          }),
        ],
      }),
    ]));
  });

  it('keeps legacy non-negative summations when scorer status metadata is absent', () => {
    const result = buildStatisticsData([
      {
        aggregateScore: 72.5,
        id: 'summation-legacy',
        isProvisional: true,
        reviewedDate: '2026-05-29T02:00:00.000Z',
        submissionId: 'submission-legacy',
        submitterHandle: 'gamma',
        submitterId: '1003',
      },
    ]);

    expect(result).toEqual([
      expect.objectContaining({
        handle: 'gamma',
        submissions: [
          expect.objectContaining({
            score: 72.5,
            submissionId: 'submission-legacy',
          }),
        ],
      }),
    ]);
  });
});
