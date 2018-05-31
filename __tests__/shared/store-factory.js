/* TODO:
 * Store factory was moved to topcoder-react-utils,
 * this test should be moved there as well.
 */
/*
const MODULE = require.resolve('shared/store-factory');

afterAll(() => {
  delete process.env.DEV_TOOLS;
});

beforeEach(() => {
  jest.resetModules();
});
*/

test.skip('Does not throw', () => {
  // expect(() => require(MODULE)).not.toThrow();
});

test.skip('Does not throw when uses dev tools', () => {
  /*
  process.env.DEV_TOOLS = true;
  expect(() => require(MODULE)).not.toThrow();
  delete process.env.DEV_TOOLS;
  */
});
