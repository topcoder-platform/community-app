/* eslint-env jest */

import config from 'config';
import fetch from 'isomorphic-fetch';
import {
  ApiService,
  articleVote,
  getService,
} from 'server/services/contentful';

const RETIRED_ASSET_HOST = ['images.', 'ctf', 'assets.net'].join('');
const RETIRED_ASSET_URL = `https://${RETIRED_ASSET_HOST}/space/asset/file.png`;

jest.mock('config', () => ({
  CONTENTFUL: {
    DEFAULT_ENVIRONMENT: 'master',
    DEFAULT_SPACE_NAME: 'default',
    PAYLOAD_REQUEST_TIMEOUT_MS: 4321,
  },
  SECRET: {
    CONTENTFUL: {
      PAYLOAD_MANAGEMENT_API_KEY: 'management-key',
      PAYLOAD_VOTE_API_URL: 'https://cms.topcoder-dev.com/contentful-management/votes',
      default: {
        SPACE_ID: 'default-space',
        master: {
          CDN_API_HOST: 'cms.topcoder-dev.com',
          CDN_API_KEY: 'delivery-key',
          PREVIEW_API_HOST: 'cms.topcoder-dev.com',
          PREVIEW_API_KEY: 'preview-key',
        },
      },
      EDU: {
        SPACE_ID: 'edu-space',
        master: {
          CDN_API_HOST: 'cms.topcoder-dev.com',
          CDN_API_KEY: 'edu-key',
          PREVIEW_API_HOST: 'cms.topcoder-dev.com',
          PREVIEW_API_KEY: 'edu-preview-key',
        },
      },
      unsupported: {
        SPACE_ID: 'unsupported-space',
        master: {
          CDN_API_HOST: '',
          CDN_API_KEY: 'legacy-key',
          PREVIEW_API_HOST: '',
          PREVIEW_API_KEY: 'legacy-preview-key',
        },
      },
    },
  },
}));

jest.mock('isomorphic-fetch', () => jest.fn());

function response(data, status = 200) {
  return {
    json: jest.fn(() => Promise.resolve(data)),
    ok: status >= 200 && status < 300,
    status,
  };
}

describe('server/services/contentful Payload compatibility client', () => {
  beforeEach(() => {
    fetch.mockReset();
  });

  test('uses an explicit host, a shared keep-alive agent, and no redirects', async () => {
    fetch.mockResolvedValue(response({ fields: { title: 'Asset' }, sys: { id: 'asset-id' } }));

    await getService('default', 'master', false).getAsset('asset-id');

    expect(fetch.mock.calls[0][0])
      .toBe('https://cms.topcoder-dev.com/spaces/default-space/environments/master/assets/asset-id');
    const options = fetch.mock.calls[0][1];
    expect(options.redirect).toBe('manual');
    expect(options.agent.options.keepAlive).toBe(true);
    expect(options.headers.Authorization).toBe('Bearer delivery-key');
    expect(options.timeout).toBe(4321);
  });

  test('fails closed for an unsupported space before making a request', () => {
    expect(() => getService('unsupported', 'master', false))
      .toThrow('CDN_API_HOST is required; external CMS fallbacks are disabled.');
    expect(fetch).not.toHaveBeenCalled();
  });

  test('resolves linked compatibility entries without the provider SDK', async () => {
    fetch.mockResolvedValue(response({
      items: [{
        fields: { author: { sys: { id: 'author-id', linkType: 'Entry', type: 'Link' } } },
        sys: { id: 'article-id', type: 'Entry' },
      }],
      includes: {
        Entry: [{
          fields: { name: 'Payload Author' },
          sys: { id: 'author-id', type: 'Entry' },
        }],
      },
      limit: 100,
      skip: 0,
      total: 1,
    }));

    const result = await getService('default', 'master', false).queryEntries({
      'fields.slug': 'payload%20article',
    });

    expect(result.items[0].fields.author.fields.name).toBe('Payload Author');
    expect(fetch.mock.calls[0][0]).toContain('/entries?fields.slug=payload%20article');
  });

  test('preserves getEntry link resolution through the compatibility collection', async () => {
    fetch.mockResolvedValue(response({
      items: [{
        fields: {
          avatar: { sys: { id: 'avatar-id', linkType: 'Asset', type: 'Link' } },
        },
        sys: { id: 'member-id', type: 'Entry' },
      }],
      includes: {
        Asset: [{
          fields: { file: { url: 'https://assets.topcoder-dev.com/member.png' } },
          sys: { id: 'avatar-id', type: 'Asset' },
        }],
      },
      limit: 100,
      skip: 0,
      total: 1,
    }));

    const entry = await new ApiService(
      'https://cms.topcoder-dev.com/spaces/a/environments/master',
      'key',
    ).getEntry('member-id');

    expect(entry.fields.avatar.fields.file.url)
      .toBe('https://assets.topcoder-dev.com/member.png');
    expect(fetch.mock.calls[0][0])
      .toBe('https://cms.topcoder-dev.com/spaces/a/environments/master/entries?sys.id=member-id&limit=1');
  });

  test.each([
    [500, 1000],
    [60000, 30000],
    ['invalid', 10000],
  ])('keeps configured request timeout %p within safe bounds', async (configured, expected) => {
    const originalTimeout = config.CONTENTFUL.PAYLOAD_REQUEST_TIMEOUT_MS;
    config.CONTENTFUL.PAYLOAD_REQUEST_TIMEOUT_MS = configured;
    fetch.mockResolvedValue(response({ fields: {}, sys: { id: 'asset-id' } }));
    try {
      await new ApiService(
        'https://cms.topcoder-dev.com/spaces/a/environments/master',
        'key',
      ).getAsset('asset-id');
      expect(fetch.mock.calls[0][1].timeout).toBe(expected);
    } finally {
      config.CONTENTFUL.PAYLOAD_REQUEST_TIMEOUT_MS = originalTimeout;
    }
  });

  test('propagates a Payload request timeout without retrying it', async () => {
    const timeoutError = new Error('network timeout');
    fetch.mockRejectedValue(timeoutError);

    await expect(new ApiService(
      'https://cms.topcoder-dev.com/spaces/a/environments/master',
      'key',
    ).getAsset('asset-id')).rejects.toBe(timeoutError);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][1].timeout).toBe(4321);
  });

  test('rejects compatibility responses containing retired asset URLs', async () => {
    fetch.mockResolvedValue(response({
      fields: { file: { url: `//${RETIRED_ASSET_HOST}/space/asset/file.png` } },
      sys: { id: 'asset-id', type: 'Asset' },
    }));

    await expect(new ApiService('https://cms.topcoder-dev.com/spaces/a/environments/master', 'key')
      .getAsset('asset-id')).rejects.toThrow('retired provider URL');
  });

  test.each([
    `https://player.example.test/embed?source=${RETIRED_ASSET_URL}`,
    encodeURIComponent(encodeURIComponent(RETIRED_ASSET_URL)),
    'https:\\u002f\\u002fquickedit\\u002eoctana\\u002eio/preview',
    'https&colon;&sol;&sol;preview--topcoder&period;netlify&period;app/page',
  ])('fails closed for an obscured retired URL in a compatibility response', async (url) => {
    fetch.mockResolvedValue(response({ fields: { body: url } }));

    await expect(new ApiService('https://cms.topcoder-dev.com/spaces/a/environments/master', 'key')
      .getEntry('entry-id')).rejects.toThrow('retired provider URL');
  });

  test('writes votes only through the configured Payload endpoint', async () => {
    fetch.mockResolvedValue(response({ updated: true }));

    await expect(articleVote({
      id: 'article-id',
      votes: { downvotes: 1, upvotes: 2 },
    }, 'EDU', 'master')).resolves.toEqual({ updated: true });

    expect(fetch.mock.calls[0][0])
      .toBe('https://cms.topcoder-dev.com/contentful-management/votes');
    expect(fetch.mock.calls[0][1]).toMatchObject({
      method: 'POST',
      redirect: 'manual',
      timeout: 4321,
      body: JSON.stringify({
        spaceId: 'edu-space',
        environment: 'master',
        entryId: 'article-id',
        votes: { downvotes: 1, upvotes: 2 },
      }),
    });
  });

  test('rejects retired provider URLs in vote responses', async () => {
    fetch.mockResolvedValue(response({ redirect: RETIRED_ASSET_URL }));

    await expect(articleVote({
      id: 'article-id',
      votes: { downvotes: 1, upvotes: 2 },
    }, 'EDU', 'master')).rejects.toThrow('retired provider URL');
  });

  test('does not fall back when vote write-through is unconfigured', async () => {
    const originalUrl = config.SECRET.CONTENTFUL.PAYLOAD_VOTE_API_URL;
    config.SECRET.CONTENTFUL.PAYLOAD_VOTE_API_URL = '';
    await expect(articleVote({ id: 'article-id', votes: {} }, 'EDU', 'master'))
      .rejects.toThrow('external CMS fallbacks are disabled');
    config.SECRET.CONTENTFUL.PAYLOAD_VOTE_API_URL = originalUrl;
    expect(fetch).not.toHaveBeenCalled();
  });
});
