import fetch from 'isomorphic-fetch';
import sharp from 'sharp';

import getAvatar, { normalizeAvatarUrl } from 'server/services/avatar';

jest.mock('isomorphic-fetch', () => jest.fn());
jest.mock('sharp', () => jest.fn());

function mockResponse({
  body = Buffer.from('image'),
  contentType = 'image/png',
  location,
  status = 200,
} = {}) {
  const headers = {
    'content-length': String(body.length),
    'content-type': contentType,
    location,
  };
  return {
    buffer: jest.fn(() => Promise.resolve(body)),
    headers: {
      get: jest.fn(name => headers[name.toLowerCase()] || null),
    },
    ok: status >= 200 && status < 300,
    status,
  };
}

describe('avatar service security boundaries', () => {
  let resize;
  let toBuffer;

  beforeEach(() => {
    jest.clearAllMocks();
    toBuffer = jest.fn(() => Promise.resolve(Buffer.from('resized')));
    resize = jest.fn(() => ({ toBuffer }));
    sharp.mockReturnValue({ resize });
  });

  test('rejects loopback and attacker-controlled destinations before fetching', async () => {
    await expect(getAvatar('http://127.0.0.1/latest/meta-data', 32))
      .rejects.toThrow('Avatar URL is not trusted');
    await expect(getAvatar('https://member-media.topcoder.com.attacker.test/a.png', 32))
      .rejects.toThrow('Avatar URL is not trusted');

    expect(fetch).not.toHaveBeenCalled();
  });

  test('normalizes only legacy relative paths against the configured site', () => {
    const normalized = normalizeAvatarUrl('/i/m/avatar.png');

    expect(normalized.pathname).toBe('/i/m/avatar.png');
    expect(normalized.protocol).toBe('https:');
  });

  test('fetches and resizes a bounded raster image from a trusted media host', async () => {
    fetch.mockResolvedValue(mockResponse());

    await expect(getAvatar(
      'https://topcoder-prod-media.s3.amazonaws.com/member/profile/avatar.png',
      64,
    )).resolves.toEqual(Buffer.from('resized'));

    expect(fetch).toHaveBeenCalledWith(
      'https://topcoder-prod-media.s3.amazonaws.com/member/profile/avatar.png',
      expect.objectContaining({ redirect: 'manual' }),
    );
    expect(sharp).toHaveBeenCalledWith(
      Buffer.from('image'),
      { limitInputPixels: 40000000 },
    );
    expect(resize).toHaveBeenCalledWith(64, 64, { fit: 'inside' });
  });

  test('rejects a redirect that leaves the trusted media origins', async () => {
    fetch.mockResolvedValue(mockResponse({
      location: 'http://169.254.169.254/latest/meta-data',
      status: 302,
    }));

    await expect(getAvatar(
      'https://member-media.topcoder.com/avatar.png',
      32,
    )).rejects.toThrow('Avatar URL is not trusted');
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test('rejects unsupported content types and excessive resize requests', async () => {
    fetch.mockResolvedValue(mockResponse({ contentType: 'text/html' }));

    await expect(getAvatar(
      'https://member-media.topcoder.com/avatar.png',
      32,
    )).rejects.toThrow('Avatar response is not a supported image');
    await expect(getAvatar(
      'https://member-media.topcoder.com/avatar.png',
      2048,
    )).rejects.toThrow('Invalid avatar size');
  });
});
