/* TODO: This test is temporarly disabled. The problem is that this test cannot
 * work in prod until we find a way to mock a non-installed module. I believe,
 * Babel should be able to help here. */

/*
import _ from 'lodash';

test('placeholder', _.noop);
*/


import React from 'react';
import Rnd from 'react-test-renderer/shallow';

const DevTools = require('containers/DevTools').default;

const rnd = new Rnd();
// const store = createStore(() => ({}), {}, DevTools.instrument());

test('Snapshot match', () => {
  rnd.render(<DevTools />);
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
