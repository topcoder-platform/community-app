import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';

import SSR from 'utils/SSR';

jest.mock('topcoder-react-utils', () => ({
  isomorphy: {
    isClientSide: jest.fn(() => false),
    isServerSide: jest.fn(() => true),
  },
  webpack: {
    requireWeak: jest.fn(() => jest.requireActual('react-dom/server')),
  },
}));

test('registers the complete store-update and rerender promise with SSR', () => {
  const rerenderPromise = Promise.resolve();
  const updatePromise = {
    then: jest.fn(() => rerenderPromise),
  };
  const updateStore = jest.fn(() => updatePromise);
  const Wrapped = SSR(() => false, updateStore)(() => null);
  const staticContext = {
    request: {},
    ssrPromises: [],
    store: {},
  };

  ReactDOMServer.renderToString((
    <StaticRouter context={staticContext} location="/">
      <Wrapped />
    </StaticRouter>
  ));

  expect(updatePromise.then).toHaveBeenCalledTimes(1);
  expect(staticContext.ssrPromises).toEqual([rerenderPromise]);
});
