import React from 'react';
import renderer from 'react-test-renderer';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import _ from 'lodash';

import DataFetchRoute from 'routes/examples/DataFetch';

const reducer = _.identity;

const store = createStore(reducer);

let originalFetch;

beforeAll(() => {
  originalFetch = global.fetch;
  global.fetch = jest.fn(() =>
  Promise.resolve({ json: () => [] }));
});

afterAll(() => {
  global.fetch = originalFetch;
});

test('matches snapshots', () => {
  const cmp = renderer.create(
    <Provider store={store}>
      <StaticRouter context={{}}>
        <DataFetchRoute />
      </StaticRouter>
    </Provider>,
  );
  expect(cmp.toJSON()).toMatchSnapshot();
});
