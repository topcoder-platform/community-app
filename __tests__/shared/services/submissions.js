/* eslint-env jest */
import { config } from 'topcoder-react-utils';
import {
  getChallengeSubmissions,
  getSubmissionDownloadUrl,
} from '../../../src/shared/services/submissions';

const baseUrl = `${config.API.V6}/submissions`;

describe('submissions service', () => {
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

  it('returns a signed submission URL without following the storage redirect', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        url: ' https://storage.example.test/signed-submission ',
      }),
    });

    const result = await getSubmissionDownloadUrl('token-v3', 'submission/id');

    expect(result).toBe('https://storage.example.test/signed-submission');
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      `${baseUrl}/submission%2Fid/download-url`,
      expect.objectContaining({ method: 'GET' }),
    );
    expect(global.fetch.mock.calls[0][1].headers.get('Authorization'))
      .toBe('Bearer token-v3');
  });

  it('rejects a submission download response without a signed URL', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

    await expect(getSubmissionDownloadUrl('token-v3', 'submission-id'))
      .rejects.toThrow('Submission download URL is missing');
  });

  it('loads every submissions page reported by metadata', async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          data: [{ id: 'submission-page-1' }],
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
          data: [{ id: 'submission-page-2' }],
          meta: {
            page: 2,
            perPage: 100,
            totalPages: 2,
            totalItems: 101,
          },
        }),
      });

    const result = await getChallengeSubmissions('token-v3', 'challenge-id');

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      `${baseUrl}?challengeId=challenge-id&perPage=500&page=1`,
      expect.objectContaining({ method: 'GET' }),
    );
    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      `${baseUrl}?challengeId=challenge-id&perPage=500&page=2`,
      expect.objectContaining({ method: 'GET' }),
    );
    expect(result.data).toEqual([
      { id: 'submission-page-1' },
      { id: 'submission-page-2' },
    ]);
    expect(result.meta).toEqual(expect.objectContaining({
      page: 2,
      perPage: 500,
      totalItems: 2,
      totalPages: 2,
    }));
  });

  it('uses the short-page heuristic when total pages are absent', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        data: [{ id: 'submission-only-page' }],
        meta: {
          page: 1,
          perPage: 100,
        },
      }),
    });

    const result = await getChallengeSubmissions(null, 'challenge-id');

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(result.data).toEqual([{ id: 'submission-only-page' }]);
  });

  it('passes latest and member filters to the submissions API', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        data: [{ id: 'submission-latest' }],
        meta: {
          page: 1,
          perPage: 100,
          totalPages: 1,
        },
      }),
    });

    await getChallengeSubmissions('token-v3', 'challenge-id', {
      isLatest: true,
      memberId: '1001',
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      `${baseUrl}?challengeId=challenge-id&perPage=500&page=1&isLatest=true&memberId=1001`,
      expect.objectContaining({ method: 'GET' }),
    );
  });
});
