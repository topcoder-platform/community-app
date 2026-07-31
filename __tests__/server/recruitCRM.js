import fetch from 'isomorphic-fetch';

import RecruitCRMService, {
  normalizeRecruitCrmIdentifier,
  parseApplicationForm,
} from 'server/services/recruitCRM';

jest.mock('isomorphic-fetch', () => jest.fn());
jest.mock('topcoder-react-lib', () => ({
  logger: {
    error: jest.fn(),
  },
  services: {
    api: {},
  },
}));
jest.mock('server/services/sendGrid', () => ({
  sendEmailDirect: jest.fn(),
}));

function validApplication(overrides = {}) {
  return {
    city: 'Hobart',
    contact_number: '+61 400 000 000',
    custom_fields: [
      { field_id: 1, value: 'https://topcoder.com/members/member' },
      { field_id: 2, value: 'member' },
      { field_id: 14, value: 'Job information' },
    ],
    email: 'member@example.com',
    first_name: 'Test',
    last_name: 'Member',
    locality: 'Australia',
    salary_expectation: '',
    skill: 'JavaScript',
    ...overrides,
  };
}

describe('RecruitCRM input security boundaries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('accepts bounded opaque identifiers and rejects URL path injection', () => {
    expect(normalizeRecruitCrmIdentifier('job_slug-123')).toBe('job_slug-123');
    expect(normalizeRecruitCrmIdentifier('../../admin')).toBeNull();
    expect(normalizeRecruitCrmIdentifier('job/assign?admin=true')).toBeNull();
    expect(normalizeRecruitCrmIdentifier('short')).toBeNull();
  });

  test('parses a valid bounded application form', () => {
    const parsed = parseApplicationForm(JSON.stringify(validApplication()));

    expect(parsed.email).toBe('member@example.com');
    expect(parsed.custom_fields).toHaveLength(3);
  });

  test('rejects malformed and unbounded custom field arrays', () => {
    expect(() => parseApplicationForm('{invalid-json'))
      .toThrow('Invalid application form');
    expect(() => parseApplicationForm(JSON.stringify(validApplication({
      custom_fields: Array.from(
        { length: 33 },
        (value, fieldId) => ({ field_id: fieldId + 1, value: '' }),
      ),
    })))).toThrow('Invalid application form');
  });

  test('rejects an invalid job identifier before any upstream request', async () => {
    const service = new RecruitCRMService();
    const req = {
      body: { form: JSON.stringify(validApplication()) },
      params: { id: '../../../metadata' },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn(),
    };
    res.status.mockReturnValue(res);

    await service.applyForJob(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid job ID format.' });
    expect(fetch).not.toHaveBeenCalled();
  });

  test('does not return an upstream exception or stack trace to the cache', async () => {
    fetch.mockRejectedValue(new Error('private upstream stack details'));
    const service = new RecruitCRMService();

    await expect(service.getAll({ job_status: 1 }))
      .resolves.toEqual({ error: true });
  });
});
