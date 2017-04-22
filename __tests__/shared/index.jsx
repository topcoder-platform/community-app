import React from 'react';
import Rnd from 'react-test-renderer/shallow';

const rnd = new Rnd();

afterAll(() => {
  process.env.NODE_ENV = 'test';
});

test('Snapshot match', () => {
  let App = require('shared').default;
  rnd.render((
    <App />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
  jest.resetModules();
  process.env.NODE_ENV = 'development';
  App = require('shared').default;
  rnd.render((
    <App />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
  process.env.NODE_ENV = 'test';
});
