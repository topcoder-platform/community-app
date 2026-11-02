import fetch from 'isomorphic-fetch';
import fx from 'money';

jest.mock('isomorphic-fetch', () => jest.fn());
jest.mock('money', () => ({ convert: jest.fn(() => 12) }));
jest.mock('topcoder-react-utils', () => ({
  config: { CDN: { PUBLIC: 'https://cdn.example.test' } },
  isomorphy: { isClientSide: () => false },
}));

test('a failed background currency refresh preserves synchronous callers', async () => {
  fetch.mockRejectedValue(new Error('CDN unavailable'));
  // Load only after fetch is configured, to exercise the import-time refresh.
  const money = jest.requireActual('../../../src/shared/services/money');
  expect(money.getRatesNow()).toEqual({ timestamp: 0 });
  expect(money.convertNow(10, 'EUR')).toBe(12);
  await new Promise(resolve => setImmediate(resolve));
  expect(fetch).toHaveBeenCalledTimes(3);
  expect(fx.convert).toHaveBeenCalledWith(10, { from: 'USD', to: 'EUR' });
});
