import {
  enrichChallengeSubmissions,
  groupSubmissionsByMember,
} from 'components/challenge-detail/Submissions';

describe('challenge detail Submissions helpers', () => {
  const challenge = {
    registrants: [
      {
        memberHandle: 'JayaApurva',
        memberId: '1001',
        rating: 1152,
      },
      {
        memberHandle: 'Om2707',
        memberId: '1002',
        rating: 1326,
      },
    ],
  };

  it('enriches complete v6 submissions with registrants outside the embedded first page', () => {
    const embeddedSubmissions = [
      {
        id: 'submission-2',
        memberId: '1002',
        registrant: challenge.registrants[1],
      },
    ];
    const fetchedSubmissions = [
      {
        id: 'submission-1',
        memberId: '1001',
        submittedDate: '2026-05-20T10:04:00.000Z',
        submitterHandle: 'JayaApurva',
        submitterMaxRating: 1152,
      },
      {
        id: 'submission-2',
        memberId: '1002',
        submittedDate: '2026-05-20T18:56:00.000Z',
        submitterHandle: 'Om2707',
        submitterMaxRating: 1326,
      },
    ];

    const enriched = enrichChallengeSubmissions(
      fetchedSubmissions,
      challenge,
      embeddedSubmissions,
    );
    const grouped = groupSubmissionsByMember(enriched);

    expect(grouped.map(group => group.member)).toEqual(['JayaApurva', 'Om2707']);
    expect(grouped[0]).toEqual(expect.objectContaining({
      rating: 1152,
      submissions: [
        expect.objectContaining({
          created: '2026-05-20T10:04:00.000Z',
          registrant: challenge.registrants[0],
        }),
      ],
    }));
  });

  it('uses review summations to populate missing score fields', () => {
    const enriched = enrichChallengeSubmissions([
      {
        id: 'submission-1',
        memberId: '1001',
        submitterHandle: 'JayaApurva',
        reviewSummation: [
          {
            aggregateScore: 75,
            isProvisional: true,
            reviewedDate: '2026-05-20T10:05:00.000Z',
          },
          {
            aggregateScore: 82,
            isFinal: true,
            reviewedDate: '2026-05-20T10:06:00.000Z',
          },
        ],
      },
    ], challenge);

    expect(enriched[0]).toEqual(expect.objectContaining({
      finalScore: 82,
      initialScore: 75,
    }));
  });
});
