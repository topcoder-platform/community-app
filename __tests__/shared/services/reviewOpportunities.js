import { getDetails } from 'services/reviewOpportunities';

describe('shared/services/reviewOpportunities.getDetails', () => {
  let originalFetch;

  beforeAll(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  test('returns challenge API details when challenge request succeeds', async () => {
    const opportunityPayload = {
      result: {
        content: {
          id: 'opp-1',
          payments: [{ role: 'Reviewer', payment: 100 }],
        },
      },
    };
    const challengePayload = {
      id: '12345',
      name: 'Challenge from API',
      type: 'Challenge',
      phases: [],
      terms: [],
    };

    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(opportunityPayload),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(challengePayload),
      });

    const result = await getDetails('12345', 'opp-1');

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(result.challenge).toEqual(challengePayload);
  });

  test('falls back to challenge data from opportunity payload when challenge request is forbidden', async () => {
    const opportunityPayload = {
      result: {
        content: {
          id: 'opp-2',
          payments: [{ role: 'Reviewer', payment: 20 }],
          challengeData: {
            title: 'Grouped Challenge',
            subTrack: 'CODE',
          },
        },
      },
    };

    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(opportunityPayload),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
      });

    const result = await getDetails('grouped-challenge-id', 'opp-2');

    expect(result.challenge).toEqual({
      id: 'grouped-challenge-id',
      name: 'Grouped Challenge',
      phases: [],
      subTrack: 'CODE',
      terms: [],
      title: 'Grouped Challenge',
      type: 'CODE',
    });
  });

  test('rejects when review opportunity request fails', async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

    await expect(getDetails('12345', 'opp-3')).rejects.toThrow(
      'Failed to load review opportunity: Not Found',
    );
  });
});
