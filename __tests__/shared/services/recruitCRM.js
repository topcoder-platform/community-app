/* eslint-env jest */
import fetch from 'isomorphic-fetch';
import { logger } from 'topcoder-react-lib';
import Service from '../../../src/shared/services/recruitCRM';

jest.mock('isomorphic-fetch', () => jest.fn());
jest.mock('topcoder-react-lib', () => ({
  logger: {
    error: jest.fn(),
  },
}));

describe('RecruitCRM application service', () => {
  const originalFormData = global.FormData;
  const originalHeaders = global.Headers;
  let formData;

  beforeEach(() => {
    formData = { append: jest.fn() };
    global.FormData = jest.fn(() => formData);
    global.Headers = jest.fn(headers => headers);
    fetch.mockReset();
    logger.error.mockReset();
  });

  afterAll(() => {
    global.FormData = originalFormData;
    global.Headers = originalHeaders;
  });

  it('returns the JSON application result for a successful proxy response', async () => {
    const json = jest.fn().mockResolvedValue({ id: 'application-id' });
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: jest.fn(() => 'application/json; charset=utf-8') },
      json,
    });

    const result = await new Service().applyForJob(
      'job-slug',
      { resume: 'resume-file', first_name: 'Ada' },
      'token-v3',
    );

    expect(result).toEqual({ id: 'application-id' });
    expect(formData.append).toHaveBeenNthCalledWith(1, 'resume', 'resume-file');
    expect(formData.append).toHaveBeenNthCalledWith(2, 'form', JSON.stringify({ first_name: 'Ada' }));
  });

  it('rejects an HTML edge error without trying to parse it as JSON', async () => {
    const json = jest.fn();
    fetch.mockResolvedValue({
      ok: false,
      status: 404,
      headers: { get: jest.fn(() => 'text/html; charset=utf-8') },
      json,
    });

    await expect(new Service().applyForJob(
      'job-slug',
      { resume: 'resume-file' },
      'token-v3',
    )).rejects.toMatchObject({
      message: "We couldn't submit your application. Please try again.",
      status: 404,
    });
    expect(json).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledTimes(1);
  });

  it('rejects a successful response when its body is not JSON', async () => {
    const json = jest.fn();
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: jest.fn(() => 'text/html') },
      json,
    });

    await expect(new Service().applyForJob(
      'job-slug',
      { resume: 'resume-file' },
      'token-v3',
    )).rejects.toMatchObject({
      message: "We couldn't submit your application. Please try again.",
      status: 200,
    });
    expect(json).not.toHaveBeenCalled();
  });

  it('replaces JSON parser details with the safe application error', async () => {
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: jest.fn(() => 'application/json') },
      json: jest.fn().mockRejectedValue(new SyntaxError("Unexpected token '<'")),
    });

    await expect(new Service().applyForJob(
      'job-slug',
      { resume: 'resume-file' },
      'token-v3',
    )).rejects.toMatchObject({
      message: "We couldn't submit your application. Please try again.",
      status: 200,
    });
  });
});
