jest.mock('config', () => ({
  URL: { BASE: 'https://www.topcoder.com' },
  CDN: { PUBLIC: 'https://cdn.example.test' },
  GIGS_LISTING_CACHE_TIME: 60,
  SECRET: { RECRUITCRM_API_KEY: 'fixture-only' },
}));
jest.mock('isomorphic-fetch', () => jest.fn());
jest.mock('topcoder-react-lib', () => ({ logger: { error: jest.fn() }, services: { api: {} } }));
jest.mock('../../src/server/services/sendGrid', () => ({ sendEmailDirect: jest.fn() }));
jest.mock('node-cache', () => class Cache { on() { return this; } });

const fetch = require('isomorphic-fetch');
const sharp = require('sharp');
const getAvatar = require('../../src/server/services/avatar').default;
const RecruitCRMService = require('../../src/server/services/recruitCRM').default;
const { sendEmailDirect } = require('../../src/server/services/sendGrid');

beforeEach(() => jest.clearAllMocks());

test('avatar fetch disables redirects, limits bytes, and resizes with real Sharp', async () => {
  const input = await sharp({
    create: {
      width: 100, height: 50, channels: 3, background: 'red',
    },
  }).png().toBuffer();
  fetch.mockResolvedValue({ ok: true, buffer: () => Promise.resolve(input) });
  const output = await getAvatar('https://topcoder-media.s3.amazonaws.com/member/image.png', 32);
  expect(fetch).toHaveBeenCalledWith('https://topcoder-media.s3.amazonaws.com/member/image.png', {
    redirect: 'error', timeout: 10000, size: 8 * 1024 * 1024,
  });
  const metadata = await sharp(output).metadata();
  expect([metadata.width, metadata.height]).toEqual([32, 16]);
});

test('untrusted avatar input never reaches the network', async () => {
  await expect(getAvatar('https://169.254.169.254/latest/meta-data/', 32)).rejects.toThrow();
  await expect(getAvatar('https://www.topcoder.com/image.png', 100000000)).rejects.toThrow();
  expect(fetch).not.toHaveBeenCalled();
});

test.each(['{broken', JSON.stringify({ custom_fields: { length: 100000000 } }), JSON.stringify({ custom_fields: Array(101).fill({}) })])(
  'malformed and unbounded recruiting forms are rejected before external calls: %s', async (form) => {
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn().mockReturnThis() };
    await new RecruitCRMService().applyForJob({ params: { id: 'fixture-job' }, body: { form } }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(fetch).not.toHaveBeenCalled();
    expect(sendEmailDirect).not.toHaveBeenCalled();
  },
);

test('recruiting HTTP requests reject redirects and include a bounded timeout', async () => {
  fetch.mockResolvedValue({ status: 200, json: async () => ({ data: [{ id: 1, slug: 'fixture' }] }) });
  await new RecruitCRMService().getCandidateByEmail('member@example.test');
  expect(fetch).toHaveBeenCalledWith(expect.stringContaining('https://api.recruitcrm.io/v1/candidates/search?'), expect.objectContaining({ redirect: 'error', timeout: 15000, size: 8 * 1024 * 1024 }));
});

test('an untrusted recruiting base URL cannot receive the API credential', async () => {
  await expect(new RecruitCRMService('https://evil.example').getCandidateByEmail('member@example.test')).rejects.toThrow('Invalid recruiting API origin');
  expect(fetch).not.toHaveBeenCalled();
});
