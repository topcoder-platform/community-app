import React from 'react';
import renderer from 'react-test-renderer';
import _ from 'lodash';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import DataFetchContainer from 'containers/examples/DataFetch';

let originalFetch;

beforeAll(() => {
  originalFetch = global.fetch;
  global.fetch = jest.fn(() =>
  Promise.resolve({ json: () => [] }));
});

afterAll(() => {
  global.fetch = originalFetch;
});

const reducer = _.identity;
const initialState = {};

const dispatch = jest.fn();// just a mock

const store = {
  ...createStore(reducer, initialState),
  dispatch,
};

test('renders correctly - no data, and not loading', () => {
  const cmp = renderer.create((
    <Provider store={store}>
      <DataFetchContainer />
    </Provider>
  )).toJSON();
  expect(cmp).toMatchSnapshot();
});

test('renders correctly - with data', () => {
  const data = [{
    dummy: 'This is dummy data',
  }];

  const cmp = renderer.create((
    <Provider store={store}>
      <DataFetchContainer data={data} />
    </Provider>
  )).toJSON();
  expect(cmp).toMatchSnapshot();
});

test('renders correctly - loading', () => {
  const cmp = renderer.create((
    <Provider store={store}>
      <DataFetchContainer loading />
    </Provider>
  )).toJSON();
  expect(cmp).toMatchSnapshot();
});
