import config from 'config';
import { createClient } from 'contentful';

import { getService } from 'server/services/contentful';

jest.mock('contentful', () => ({
  createClient: jest.fn(() => ({})),
}));
jest.mock('contentful-management', () => ({
  createClient: jest.fn(),
}));
jest.mock('topcoder-react-lib', () => ({
  logger: { log: jest.fn() },
}));
jest.mock('topcoder-react-utils', () => ({
  isomorphy: { isDev: false },
}));

describe('server Contentful service configuration', () => {
  const originalDefault = config.SECRET.CONTENTFUL.default;
  const originalUnrelated = config.SECRET.CONTENTFUL.unrelated;

  beforeAll(() => {
    config.SECRET.CONTENTFUL.default = {
      SPACE_ID: 'default-space',
      master: {
        CDN_API_KEY: 'default-cdn-token',
        PREVIEW_API_KEY: '',
      },
    };
    config.SECRET.CONTENTFUL.unrelated = {
      SPACE_ID: '',
      master: {
        CDN_API_KEY: '',
        PREVIEW_API_KEY: '',
      },
    };
  });

  afterAll(() => {
    config.SECRET.CONTENTFUL.default = originalDefault;
    if (originalUnrelated) {
      config.SECRET.CONTENTFUL.unrelated = originalUnrelated;
    } else {
      delete config.SECRET.CONTENTFUL.unrelated;
    }
  });

  test('creates and caches only the requested delivery client', () => {
    const first = getService('default', 'master', false);
    const second = getService('default', 'master', false);

    expect(first).toBe(second);
    expect(createClient).toHaveBeenCalledTimes(1);
    expect(createClient).toHaveBeenCalledWith(expect.objectContaining({
      accessToken: 'default-cdn-token',
      space: 'default-space',
    }));
    expect(createClient.mock.calls[0][0].host).toBeUndefined();

    expect(() => getService('unrelated', 'master', false))
      .toThrow(/unrelated.*CONTENTFUL_UNRELATED_SPACE_ID.*CONTENTFUL_UNRELATED_CDN_API_KEY/);
    expect(createClient).toHaveBeenCalledTimes(1);
  });
});
