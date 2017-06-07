import _ from 'lodash';

afterAll(() => {
  process.env.NODE_ENV = 'test';
});

describe('Dev logger', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'development';
  });
  test.skip('is an alias for console in dev environment', () =>
    expect(require('utils/logger').default).toBe(console));
});

describe('Prod logger', () => {
  beforeAll(() => {
    jest.resetModules();
    process.env.NODE_ENV = 'production';
  });
  test.skip('does not use console methods', () => {
    const logger = require('utils/logger').default;
    const spies = _.functions(console).map(key => jest.spyOn(console, key));
    _.functions(console).forEach((func) => {
      expect(_.isFunction(logger[func])).toBe(true);
      logger[func]();
    });
    spies.forEach(spy => expect(spy).not.toHaveBeenCalled());
  });
});
