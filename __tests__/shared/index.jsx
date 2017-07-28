
import React from 'react';
import Rnd from 'react-test-renderer/shallow';

const rnd = new Rnd();

test('Snapshot match', () => {
  process.env.DEV_TOOLS = '';
  let App = require('shared').default;
  rnd.render((
    <App />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();

  process.env.DEV_TOOLS = true;
  jest.resetModules();
  App = require('shared').default;
  rnd.render((
    <App />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
