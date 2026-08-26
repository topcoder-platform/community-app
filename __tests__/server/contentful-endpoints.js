import {
  getContentfulApiBaseUrl,
  getContentfulApiHost,
} from 'server/services/contentful-endpoints';

describe('server/services/contentful-endpoints', () => {
  test('fails closed when a compatibility host is not configured', () => {
    expect(() => getContentfulApiHost({}, false))
      .toThrow('CDN_API_HOST is required; external CMS fallbacks are disabled.');
    expect(() => getContentfulApiHost({}, true))
      .toThrow('PREVIEW_API_HOST is required; external CMS fallbacks are disabled.');
  });

  test('uses configured compatibility hosts and normalizes URL syntax', () => {
    const environment = {
      CDN_API_HOST: 'https://cms.topcoder-dev.com/',
      PREVIEW_API_HOST: 'cms.topcoder-dev.com',
    };

    expect(getContentfulApiHost(environment, false)).toBe('cms.topcoder-dev.com');
    expect(getContentfulApiHost(environment, true)).toBe('cms.topcoder-dev.com');
  });

  test('builds the compatibility spaces and environments path', () => {
    expect(getContentfulApiBaseUrl('cms.topcoder-dev.com', 'space id', 'feature/test'))
      .toBe('https://cms.topcoder-dev.com/spaces/space%20id/environments/feature%2Ftest');
  });

  test('rejects provider, arbitrary, and path-bearing hosts', () => {
    expect(() => getContentfulApiHost({ CDN_API_HOST: 'cdn.contentful.com' }, false))
      .toThrow('approved Topcoder Payload CMS host');
    expect(() => getContentfulApiHost({ CDN_API_HOST: 'cms.example.com' }, false))
      .toThrow('approved Topcoder Payload CMS host');
    expect(() => getContentfulApiHost({ CDN_API_HOST: 'cms.topcoder.com/path' }, false))
      .toThrow('must not include credentials, a path, query, or fragment');
  });

  test('rejects non-string configured hosts', () => {
    expect(() => getContentfulApiHost({ CDN_API_HOST: true }, false))
      .toThrow('CDN_API_HOST must be a hostname string.');
  });
});
