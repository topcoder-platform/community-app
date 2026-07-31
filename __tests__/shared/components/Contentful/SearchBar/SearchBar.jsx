import qs from 'qs';

import { buildSearchUrl } from 'components/Contentful/SearchBar/SearchBar';

jest.mock('services/contentful', () => ({
  getService: jest.fn(),
}));

describe('Contentful SearchBar URL construction', () => {
  test('encodes author input as query data rather than DOM markup', () => {
    const input = '<svg onload=alert(1)>&role=admin';
    const searchUrl = buildSearchUrl('Author', input);
    const query = searchUrl.slice(searchUrl.indexOf('?') + 1);

    expect(qs.parse(query)).toEqual({ author: input });
    expect(searchUrl).not.toContain('<svg');
    expect(searchUrl).not.toContain('&role=admin');
  });

  test('retains the existing query shape for tag searches', () => {
    const searchUrl = buildSearchUrl('Tags', 'JavaScript & Node.js');
    const query = searchUrl.slice(searchUrl.indexOf('?') + 1);

    expect(qs.parse(query)).toEqual({ tags: ['JavaScript & Node.js'] });
  });
});
