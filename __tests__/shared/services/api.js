import { getApiV2, getApiV3 } from 'services/api';

global.fetch = (url, ops) => Promise.resolve({ url, ops });

const ENDPOINT = '/ENDPOINT';
const MOCK_OPS = { OPTIONS: 'OPTIONS' };

jest.mock('utils/config', () => ({
  API: {
    V2: 'API-URL-V2',
    V3: 'API-URL-V3',
  },
}));

function testRes(res, base, token, method, body, mockOps) {
  expect(res).toEqual({
    url: `${base}${ENDPOINT}`,
    ops: {
      body,
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
        'Content-Type': 'application/json',
      },
      method,
      OPTIONS: mockOps ? 'OPTIONS' : undefined,
    },
  });
}

function testApi(api, base, token) {
  return api.fetch(ENDPOINT, MOCK_OPS)
  .then((res) => {
    testRes(res, base, token, undefined, undefined, true);
    return api.delete(ENDPOINT);
  }).then((res) => {
    testRes(res, base, token, 'DELETE');
    return api.get(ENDPOINT);
  }).then((res) => {
    testRes(res, base, token);
    return api.post(ENDPOINT, 'BODY');
  })
  .then((res) => {
    testRes(res, base, token, 'POST', 'BODY');
    return api.postJson(ENDPOINT, { BODY: 'BODY' });
  })
  .then((res) => {
    testRes(res, base, token, 'POST', JSON.stringify({ BODY: 'BODY' }));
    return api.put(ENDPOINT, 'BODY');
  })
  .then((res) => {
    testRes(res, base, token, 'PUT', 'BODY');
    return api.putJson(ENDPOINT, { BODY: 'BODY' });
  })
  .then((res) => {
    testRes(res, base, token, 'PUT', JSON.stringify({ BODY: 'BODY' }));
  });
}

let api;
test('API v2 service works without auth token', () => {
  api = getApiV2();
  return testApi(api, 'API-URL-V2');
});

test('API v2 service works with auth token', () => {
  api = getApiV2('TOKEN');
  return testApi(api, 'API-URL-V2', 'TOKEN');
});

test(
  'API v2 service from the previous call is re-used, if token is the same',
  () => expect(getApiV2('TOKEN')).toBe(api),
);

test(
  'New API v2 service is created if token is new', () => {
    const api2 = getApiV2('TOKEN2');
    expect(api2).not.toBe(api);
    return testApi(api2, 'API-URL-V2', 'TOKEN2');
  },
);

test('API v3 service works without auth token', () => {
  api = getApiV3();
  return testApi(api, 'API-URL-V3');
});

test('API v3 service works with auth token', () => {
  api = getApiV3('TOKEN');
  return testApi(api, 'API-URL-V3', 'TOKEN');
});

test(
  'API v3 service from the previous call is re-used, if token is the same',
  () => expect(getApiV3('TOKEN')).toBe(api),
);

test(
  'New API v3 service is created if token is new', () => {
    const api2 = getApiV3('TOKEN2');
    expect(api2).not.toBe(api);
    return testApi(api2, 'API-URL-V3', 'TOKEN2');
  },
);
