import isSupportedCommunityId from 'routes/Communities/community-ids';

test('accepts communities with dedicated route implementations', () => {
  expect(isSupportedCommunityId('blockchain')).toBe(true);
  expect(isSupportedCommunityId('wipro')).toBe(true);
  expect(isSupportedCommunityId('tco01')).toBe(true);
  expect(isSupportedCommunityId('tco23')).toBe(true);
});

test('rejects communities without dedicated route implementations', () => {
  expect(isSupportedCommunityId('retired-community')).toBe(false);
  expect(isSupportedCommunityId('tco00')).toBe(false);
  expect(isSupportedCommunityId('tco24')).toBe(false);
  expect(isSupportedCommunityId('')).toBe(false);
});
