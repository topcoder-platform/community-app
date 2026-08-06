/* eslint-env jest */

jest.mock('isomorphic-fetch', () => jest.fn());
jest.mock('money', () => ({
  convert: jest.fn(() => 42),
}));
jest.mock('topcoder-react-utils', () => ({
  config: {
    CDN: { PUBLIC: 'https://cdn.example.com' },
  },
  isomorphy: {
    isClientSide: () => false,
  },
}));

const fetch = require('isomorphic-fetch');
const fx = require('money');

fetch.mockResolvedValue({
  ok: false,
  statusText: 'Internal Server Error',
});

const money = jest.requireActual('../../../src/shared/services/money');

describe('money service', () => {
  test('keeps background refresh failures from becoming unhandled rejections', async () => {
    expect(money.getRatesNow()).toEqual({ timestamp: 0 });
    expect(money.convertNow(10, 'EUR')).toBe(42);

    await Promise.resolve();
    await Promise.resolve();

    expect(fetch).toHaveBeenCalledTimes(3);
    expect(fx.convert).toHaveBeenCalledWith(10, { from: 'USD', to: 'EUR' });
  });
});
