import _ from 'lodash';

jest.setMock('../../src/server/renderer', _.noop);

beforeEach(() => {
  delete process.env.FRONT_END;
});

test('Should not throw', () => {
  expect(() => require('server/server')).not.toThrow();
});
