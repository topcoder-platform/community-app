import React from 'react';
import SSR, { DoSSR } from 'utils/SSR';

jest.mock('topcoder-react-utils', () => ({
  isomorphy: { isServerSide: () => true, isClientSide: () => false },
  webpack: { requireWeak: () => require('react-dom/server') },
}));

const store = { getState: () => ({}), subscribe: () => () => undefined, dispatch: jest.fn() };
const request = { originalUrl: '/fixture' };

test('SSR waits for nested asynchronous loads', async () => {
  const childLoad = jest.fn().mockResolvedValue(undefined);
  const Child = SSR(() => false, childLoad)(() => <span>Loaded</span>);
  const parentLoad = jest.fn().mockResolvedValue(undefined);
  const Parent = SSR(() => false, parentLoad)(Child);
  await DoSSR(request, store, Parent);
  expect(parentLoad).toHaveBeenCalledTimes(1);
  expect(childLoad).toHaveBeenCalledTimes(1);
});

test('SSR propagates concurrent load failures without unhandled rejections', async () => {
  const error = new Error('Fixture backend unavailable');
  const Slow = SSR(() => false, () => new Promise(resolve => setTimeout(resolve, 20)))(() => null);
  const Failed = SSR(() => false, () => Promise.reject(error))(() => null);
  const App = () => <div><Slow /><Failed /></div>;
  await expect(DoSSR(request, store, App)).rejects.toBe(error);
  await new Promise(resolve => setTimeout(resolve, 30));
});
