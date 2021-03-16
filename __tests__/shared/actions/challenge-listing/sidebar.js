let originalFetch;

beforeAll(() => {
  originalFetch = global.fetch;
});

afterAll(() => {
  global.fetch = originalFetch;
  jest.clearAllMocks();
});

describe('challengeListing.sidebar', () => {
  test('not needed', () => {
    expect(true).toBe(true);
  });
});
