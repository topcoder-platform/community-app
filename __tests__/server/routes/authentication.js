import { createJwtAuthenticator } from 'server/routes/authentication';

function mockResponse() {
  const res = {
    json: jest.fn(),
    status: jest.fn(),
  };
  res.status.mockReturnValue(res);
  return res;
}

describe('JWT route configuration', () => {
  test('fails closed when the canonical secret is absent', () => {
    const factory = jest.fn();
    const handler = createJwtAuthenticator({
      AUTH_SECRET: 'legacy-fallback-must-not-be-used',
      SECRET: '',
      VALID_ISSUERS: '["https://api.topcoder.com"]',
    }, factory);
    const next = jest.fn();
    const res = mockResponse();

    handler({}, res, next);

    expect(factory).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Authentication is unavailable.',
    });
  });

  test('fails closed when issuer configuration is malformed', () => {
    const factory = jest.fn();
    const handler = createJwtAuthenticator({
      SECRET: 'configured-secret',
      VALID_ISSUERS: 'not-json',
    }, factory);
    const next = jest.fn();
    const res = mockResponse();

    handler({}, res, next);

    expect(factory).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(503);
  });

  test('maps the canonical secret to the tc-core authenticator contract', () => {
    const expectedMiddleware = jest.fn();
    const factory = jest.fn(() => expectedMiddleware);
    const handler = createJwtAuthenticator({
      SECRET: 'configured-secret',
      VALID_ISSUERS: ['https://api.topcoder.com'],
    }, factory);

    expect(handler).toBe(expectedMiddleware);
    expect(factory).toHaveBeenCalledWith({
      AUTH_SECRET: 'configured-secret',
      VALID_ISSUERS: '["https://api.topcoder.com"]',
    });
  });
});
