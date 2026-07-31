import qs from 'qs';

import { buildSearchUrl } from 'components/Contentful/SearchBar/SearchBar';

jest.mock('services/contentful', () => ({
  getService: jest.fn(),
}));

describe('Contentful SearchBar URL construction', () => {
  const input = '<svg onload=alert(1)>&role=admin';

  test.each([
    ['Author', { author: input }],
    ['Title', { title: input }],
    ['All', { phrase: input }],
    ['Tags', { tags: [input] }],
  ])('encodes %s input as query data rather than DOM markup', (filter, expected) => {
    const searchUrl = buildSearchUrl(filter, input);
    const query = searchUrl.slice(searchUrl.indexOf('?') + 1);

    expect(qs.parse(query)).toEqual(expected);
    expect(searchUrl).not.toContain('<svg');
    expect(searchUrl).not.toContain('&role=admin');
  });

  test('retains the existing query shape for tag searches', () => {
    const searchUrl = buildSearchUrl('Tags', 'JavaScript & Node.js');
    const query = searchUrl.slice(searchUrl.indexOf('?') + 1);

    expect(qs.parse(query)).toEqual({ tags: ['JavaScript & Node.js'] });
  });
});
