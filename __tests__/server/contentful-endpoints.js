import {
  getContentfulApiBaseUrl,
  getContentfulApiHost,
} from 'server/services/contentful-endpoints';

describe('server/services/contentful-endpoints', () => {
  test('retains Contentful Delivery and Preview hosts by default', () => {
    expect(getContentfulApiHost({}, false)).toBe('cdn.contentful.com');
    expect(getContentfulApiHost({}, true)).toBe('preview.contentful.com');
  });

  test('uses configured compatibility hosts and normalizes URL syntax', () => {
    const environment = {
      CDN_API_HOST: 'https://cms.topcoder-dev.com/',
      PREVIEW_API_HOST: 'cms.topcoder-dev.com',
    };

    expect(getContentfulApiHost(environment, false)).toBe('cms.topcoder-dev.com');
    expect(getContentfulApiHost(environment, true)).toBe('cms.topcoder-dev.com');
  });

  test('builds the Contentful-compatible spaces and environments path', () => {
    expect(getContentfulApiBaseUrl('cms.topcoder-dev.com', 'space id', 'feature/test'))
      .toBe('https://cms.topcoder-dev.com/spaces/space%20id/environments/feature%2Ftest');
  });

  test('rejects non-string configured hosts', () => {
    expect(() => getContentfulApiHost({ CDN_API_HOST: true }, false))
      .toThrow('CDN_API_HOST must be a hostname string.');
  });
});
