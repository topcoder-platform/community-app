import _ from 'lodash';

jest.setMock('../../src/server/renderer', _.noop);

test('Should not throw', () => {
  expect(() => require('server/server')).not.toThrow();
});
