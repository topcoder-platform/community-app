/* eslint-env jest */
import { config } from 'topcoder-react-utils';
import getReviewSummations from '../../../src/shared/services/reviewSummations';

const baseUrl = `${config.API.V6}${config.URL.REVIEW_SUMMATIONS_API_URL}`;

describe('reviewSummations service', () => {
  const originalFetch = global.fetch;
  const originalHeaders = global.Headers;

  beforeAll(() => {
    if (!global.Headers) {
      global.Headers = class HeadersMock {
        constructor() {
          this.values = {};
        }

        set(key, value) {
          this.values[key] = value;
        }

        get(key) {
          return this.values[key];
        }
      };
    }
  });

  afterAll(() => {
    global.fetch = originalFetch;
    global.Headers = originalHeaders;
  });

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('loads every page when review summations metadata reports more pages', async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          data: [{ id: 'summation-page-1' }],
          meta: {
            page: 1,
            perPage: 100,
            totalPages: 2,
            totalItems: 101,
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          data: [{ id: 'summation-page-2' }],
          meta: {
            page: 2,
            perPage: 100,
            totalPages: 2,
            totalItems: 101,
          },
        }),
      });

    const result = await getReviewSummations('token-v3', 'challenge-id');

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      `${baseUrl}?challengeId=challenge-id&perPage=500&page=1&metadata=true`,
      expect.objectContaining({ method: 'GET' }),
    );
    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      `${baseUrl}?challengeId=challenge-id&perPage=500&page=2&metadata=true`,
      expect.objectContaining({ method: 'GET' }),
    );
    expect(result.data).toEqual([
      { id: 'summation-page-1' },
      { id: 'summation-page-2' },
    ]);
    expect(result.meta).toEqual(expect.objectContaining({
      page: 2,
      perPage: 500,
      totalItems: 2,
      totalPages: 2,
    }));
  });

  it('uses the short-page heuristic only when metadata does not include total pages', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        data: [{ id: 'summation-only-page' }],
        meta: {
          page: 1,
          perPage: 100,
        },
      }),
    });

    const result = await getReviewSummations(null, 'challenge-id');

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(result.data).toEqual([{ id: 'summation-only-page' }]);
  });
});
